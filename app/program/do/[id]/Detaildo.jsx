'use client';

import FilePreviewCard from 'components/bootstrap/FilePreviewCard';
import Selection from 'components/form/selection';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
} from 'react-bootstrap';
import request from 'utils/request';
import { PageHeading } from 'widgets';

const initialForm = {
  nama_program: '',
  kolaborator: [{ nama: '', peran: '' }],
  rincian_kegiatan: '',
  capaian_output: '',
  dokumentasi_kegiatan: '',
  kendala: '',
  rekomendasi: '',
};

const MAX_FILE_COUNT = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function DoForm({ id }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [programNames, setProgramNames] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [defaultFile, setDefaultFile] = useState([]);
  const [fileError, setFileError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request.get(`/how?all=${true}`);

      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];

      setProgramNames(
        dataArray.map((item) => ({
          nama_program: item.nama_program, // This will be displayed
          id: item._id, // This will be the actual value
        }))
      );

      if (id) {
        const res = await request.get(`/do/getById/${id}`);
        const {
          nama_program,
          kolaborator,
          rincian_kegiatan,
          capaian_output,
          dokumentasi_kegiatan,
          kendala,
          rekomendasi,
        } = res.data;

        setForm({
          nama_program: nama_program._id,
          kolaborator: kolaborator.length
            ? kolaborator
            : [{ nama: '', peran: '' }],
          rincian_kegiatan,
          capaian_output,
          kendala,
          rekomendasi,
        });
        setDefaultFile(dokumentasi_kegiatan);
      }

      setLoading(false);
    } catch (err) {
      console.error('Gagal fetch data how:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKolaboratorChange = (idx, field, value) => {
    const kolaborator = [...form.kolaborator];
    kolaborator[idx][field] = value;
    setForm((prev) => ({ ...prev, kolaborator }));
  };

  const addKolaborator = () => {
    setForm((prev) => ({
      ...prev,
      kolaborator: [...prev.kolaborator, { nama: '', peran: '' }],
    }));
  };

  const removeKolaborator = (idx) => {
    const kolaborator = form.kolaborator.filter((_, i) => i !== idx);
    setForm((prev) => ({ ...prev, kolaborator }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (defaultFile?.length > 3) {
      setFileError('Maksimal 3 File');
      return;
    }

    console.log(form);

    try {
      const newData = {
        nama_program: form.nama_program,
        kolaborator: form.kolaborator,
        rincian_kegiatan: form.rincian_kegiatan,
        capaian_output: form.capaian_output,
        dokumentasi_kegiatan: form.dokumentasi_kegiatan,
        kendala: form.kendala,
        rekomendasi: form.rekomendasi,
      };

      const response = await request.put(`/do/${id}`, newData);
      const doId = response.data._id;

      if (uploadedFiles?.length > 0) {
        try {
          await uploadFiles(doId);
        } catch (uploadError) {
          console.error('Gagal mengunggah dokumentasi:', uploadError);
        }
      }

      alert('Data berhasil disimpan!');
      window.location.href = '/program/do';
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (doId) => {
    if (!doId) {
      throw new Error('ID DO tidak valid');
    }
    console.log(uploadedFiles);

    try {
      const res = await request.postMultipart(`/do/${doId}/dokumentasi`, {
        files: Array.from(uploadedFiles),
      });

      // Handle response
      if (Array.isArray(res.data)) {
        return res.data;
      } else if (res.data.urls) {
        return res.data.urls;
      } else if (res.data.url) {
        return [res.data.url];
      }

      return [];
    } catch (err) {
      console.error('Gagal mengunggah file:', err);
      throw err;
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');

    // Calculate available slots for new files
    const availableSlots = MAX_FILE_COUNT - defaultFile.length;

    // Validation 1: Check if there are any available slots
    if (availableSlots <= 0) {
      setFileError(`Anda sudah mencapai batas maksimal ${MAX_FILE_COUNT} file`);
      e.target.value = ''; // Clear the file input
      return;
    }

    // Validation 2: Check if new files exceed available slots
    if (files.length > availableSlots) {
      setFileError(
        `Anda hanya dapat menambahkan ${availableSlots} file lagi (total maksimal ${MAX_FILE_COUNT} file)`
      );
      e.target.value = ''; // Clear the file input
      return;
    }

    // Validation 3: Check for oversized files
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setFileError(
        `Ukuran file melebihi batas maksimal 5MB: ${oversizedFiles
          .map((f) => f.name)
          .join(', ')}`
      );
      e.target.value = ''; // Clear the file input
      return;
    }

    if (files.length > 0) {
      setUploadedFiles(files);

      const processedFiles = files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        fileObject: file,
      }));
      setForm((prev) => ({
        ...prev,
        dokumentasi_kegiatan: [
          ...(prev.dokumentasi_kegiatan || []),
          ...processedFiles,
        ],
      }));
    }
  };

  const removeFile = async (file, index, isDefault = false) => {
    if (isDefault) {
      try {
        const filename = file.split('/').pop();
        await request.delete(
          `/do/${id}/dokumentasi?filename=${encodeURIComponent(filename)}`
        );
        // Remove from default files
        const updatedDefaultFiles = [...defaultFile];
        updatedDefaultFiles.splice(index, 1);
        setDefaultFile(updatedDefaultFiles);
        alert('File berhasil dihapus');
      } catch (error) {
        console.error('Gagal menghapus file:', error);
        alert('Gagal menghapus file. Silakan coba lagi.');
      }
    } else {
      // Remove from newly uploaded files
      const updatedFiles = [...form.dokumentasi_kegiatan];
      updatedFiles.splice(index, 1);
      setForm((prev) => ({
        ...prev,
        dokumentasi_kegiatan: updatedFiles,
      }));
    }
    setFileError('');
  };

  console.log(programNames);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Update Data DO" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger mb-4">{error}</div>
                )}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Nama Program
                  </Form.Label>
                  <Col md={9}>
                    {/* <Selection
                      name="nama_program"
                      value={form.nama_program}
                      onChange={handleChange}
                      placeHolder="Pilih Nama Program"
                      className="form-select"
                      required
                    >
                      <option value="">Pilih Nama Program</option>
                      {programNames.map((opt, index) => (
                        <option key={index} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Selection> */}
                    <Selection
                      name="nama_program"
                      value={form.nama_program} // Pastikan ini adalah ID (misal "68513aab5f4d5cf4feeb87fb")
                      onChange={handleChange}
                      options={programNames}
                      optionLabel="nama_program"
                      optionValue="id"
                      placeholder="Pilih Nama Program"
                    />
                  </Col>
                </Row>

                {/* Kolaborator */}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Kolaborator
                  </Form.Label>
                  <Col md={9}>
                    {form.kolaborator.map((item, idx) => (
                      <Row className="mb-2" key={idx}>
                        <Col md={5}>
                          <Form.Control
                            placeholder="Nama Kolaborator"
                            value={item.nama}
                            onChange={(e) =>
                              handleKolaboratorChange(
                                idx,
                                'nama',
                                e.target.value
                              )
                            }
                            required
                          />
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            placeholder="Peran Kolaborator"
                            value={item.peran}
                            onChange={(e) =>
                              handleKolaboratorChange(
                                idx,
                                'peran',
                                e.target.value
                              )
                            }
                            required
                          />
                        </Col>
                        <Col md={2} className="d-flex gap-2">
                          <Button
                            variant="outline-danger"
                            onClick={() => removeKolaborator(idx)}
                            disabled={form.kolaborator.length === 1}
                          >
                            -
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={addKolaborator}
                            disabled={idx !== form.kolaborator.length - 1}
                          >
                            +
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </Col>
                </Row>

                {/* Rincian Kegiatan */}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Rincian Kegiatan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="rincian_kegiatan"
                      value={form.rincian_kegiatan}
                      onChange={handleChange}
                      placeholder="Masukkan rincian kegiatan"
                      required
                    />
                  </Col>
                </Row>

                {/* Capaian Output */}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Capaian Output
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="capaian_output"
                      value={form.capaian_output}
                      onChange={handleChange}
                      placeholder="Masukkan capaian output"
                      required
                    />
                  </Col>
                </Row>

                {/* Dokumentasi */}
                {/* <Row className="mb-3">
                  <Form.Label column md={3}>
                    Dokumentasi Kegiatan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="dokumentasi_kegiatan"
                      value={form.dokumentasi_kegiatan}
                      onChange={handleChange}
                      placeholder="Link dokumentasi (Google Drive, dsb)"
                      required
                    />
                  </Col>
                </Row> */}

                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Laporan PDF
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="dokumentasi_kegiatan"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      multiple
                      // onChange={(e) => {
                      //   const file = e.target.files[0];
                      //   if (file) {
                      //     // Simpan nama file atau path relatif ke state
                      //     setForm((prev) => ({
                      //       ...prev,
                      //       dokumentasi_kegiatan: `uploads/${file.name}`, // atau format path lain yang Anda butuhkan
                      //     }));
                      //   }
                      // }}
                      onChange={handleFileChange}
                    />
                    {fileError ? (
                      <Alert variant="danger" className="mt-2">
                        {fileError}
                      </Alert>
                    ) : (
                      <div className="text-muted small mt-1">
                        {defaultFile.length}/{MAX_FILE_COUNT} file terisi.
                        Maksimal {MAX_FILE_COUNT} file (5MB/file)
                      </div>
                    )}
                    {(form.dokumentasi_kegiatan?.length > 0 ||
                      defaultFile.length > 0) && (
                      <div className="mt-3">
                        <h6>File Terpilih:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {defaultFile.length > 0 &&
                            defaultFile.map((file, index) => (
                              <FilePreviewCard
                                key={index}
                                file={file}
                                // onRemove={async () => {
                                //   try {
                                //     const filename = file.split('/').pop();
                                //     await request.delete(
                                //       `/date/${id}/dokumentasi?filename=${encodeURIComponent(
                                //         filename
                                //       )}`
                                //     );
                                //     alert('File berhasil dihapus');
                                //     fetchData();
                                //   } catch (error) {
                                //     console.error(
                                //       'Gagal menghapus file:',
                                //       error
                                //     );
                                //     alert(
                                //       'Gagal menghapus file. Silakan coba lagi.'
                                //     );
                                //   }
                                // }}
                                onRemove={() => removeFile(file, index, true)}
                              />
                            ))}
                          {form.dokumentasi_kegiatan?.length > 0 &&
                            form.dokumentasi_kegiatan.map((file, index) => (
                              <FilePreviewCard
                                key={index}
                                file={file}
                                onRemove={() => {
                                  const updatedFiles = [
                                    ...form.dokumentasi_kegiatan,
                                  ];
                                  updatedFiles.splice(index, 1);
                                  setForm((prev) => ({
                                    ...prev,
                                    dokumentasi_kegiatan: updatedFiles,
                                  }));
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Kendala */}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Kendala
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="kendala"
                      value={form.kendala}
                      onChange={handleChange}
                      placeholder="Masukkan kendala"
                      required
                    />
                  </Col>
                </Row>

                {/* Rekomendasi */}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Rekomendasi
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="rekomendasi"
                      value={form.rekomendasi}
                      onChange={handleChange}
                      placeholder="Masukkan rekomendasi"
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-8">
                  <Col md={12}>
                    <div className="d-flex align-items-center justify-content-end">
                      <div>
                        <Button
                          variant="primary"
                          className="me-2"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Menyimpan...' : 'Update'}
                        </Button>
                        <Button
                          variant="outline-white"
                          type="link"
                          href="/program/do"
                        >
                          Kembali
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
