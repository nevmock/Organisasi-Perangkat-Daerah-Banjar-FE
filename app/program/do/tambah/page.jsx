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
  dokumentasi_kegiatan: [],
  kendala: '',
  rekomendasi: '',
};

const MAX_FILE_COUNT = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function DoForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [programNames, setProgramNames] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileError, setFileError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await request.get(`/how?all=${true}`);

      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];

      setProgramNames(
        dataArray.map((item) => ({
          nama_program: item.nama_program,
          id: item._id,
        }))
      );
      setLoading(false);
    } catch (err) {
      console.error('Gagal fetch data how:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKolaboratorChange = (idx, field, value) => {
    const kolaborator = [...form.kolaborator];
    kolaborator[idx][field] = value;
    setForm({ ...form, kolaborator });
  };

  const addKolaborator = () => {
    setForm({
      ...form,
      kolaborator: [...form.kolaborator, { nama: '', peran: '' }],
    });
  };

  const removeKolaborator = (idx) => {
    const kolaborator = form.kolaborator.filter((_, i) => i !== idx);
    setForm({ ...form, kolaborator });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi file sebelum submit
    if (form.dokumentasi_kegiatan?.length === 0) {
      setFileError('Harap unggah minimal 1 file');
      return;
    }

    setLoading(true);
    setError(null);

    console.log(form);

    try {
      // 1. Kirim data utama DO terlebih dahulu
      const newData = {
        nama_program: form.nama_program,
        kolaborator: form.kolaborator,
        rincian_kegiatan: form.rincian_kegiatan,
        capaian_output: form.capaian_output,
        kendala: form.kendala,
        rekomendasi: form.rekomendasi,
      };

      const response = await request.post(`/do`, newData);
      const doId = response.data._id; // Asumsi response mengembalikan ID DO yang baru dibuat

      // 2. Jika ada file dokumentasi, upload ke endpoint dokumentasi
      if (uploadedFiles?.length > 0) {
        try {
          await uploadFiles(doId);
        } catch (uploadError) {
          console.error('Gagal mengunggah dokumentasi:', uploadError);
          // Anda bisa memilih untuk melanjutkan atau membatalkan
          // Di sini saya akan melanjutkan karena data utama sudah tersimpan
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

    // Validasi jumlah file
    if (files.length > MAX_FILE_COUNT) {
      setFileError(`Maksimal ${MAX_FILE_COUNT} file yang dapat diunggah`);
      return;
    }

    // Validasi ukuran file
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setFileError(
        `Ukuran file melebihi batas maksimal 5MB: ${oversizedFiles
          .map((f) => f.name)
          .join(', ')}`
      );
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
        dokumentasi_kegiatan: processedFiles,
      }));
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...form.dokumentasi_kegiatan];
    updatedFiles.splice(index, 1);
    setForm((prev) => ({
      ...prev,
      dokumentasi_kegiatan: updatedFiles,
    }));
    setFileError('');
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Input Data DO" />
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
                    <Selection
                      name="nama_program"
                      value={form.nama_program}
                      onChange={handleChange}
                      placeHolder="Pilih Nama Program"
                      className="form-select"
                      required
                    >
                      <option value="">Pilih Nama Program</option>
                      {programNames.map((opt, index) => (
                        <option key={index} value={opt.id}>
                          {opt.nama_program}
                        </option>
                      ))}
                    </Selection>
                  </Col>
                </Row>

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

                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Rincian Kegiatan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="rincian_kegiatan"
                      placeholder="Masukan rincian kegiatan"
                      value={form.rincian_kegiatan}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Capaian Output
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="capaian_output"
                      placeholder="Masukan capaian output"
                      value={form.capaian_output}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Dokumentasi Kegiatan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="dokumentasi_kegiatan"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      multiple
                      // onChange={(e) => {
                      //   const files = Array.from(e.target.files);
                      //   if (files.length > 0) {
                      //     setUploadedFiles(files);

                      //     const processedFiles = files.map((file) => ({
                      //       name: file.name,
                      //       type: file.type,
                      //       size: file.size,
                      //       url: URL.createObjectURL(file),
                      //       fileObject: file,
                      //     }));
                      //     setForm((prev) => ({
                      //       ...prev,
                      //       dokumentasi_kegiatan: processedFiles,
                      //     }));
                      //   }
                      // }}
                      onChange={handleFileChange}
                      required
                    />
                    {fileError ? (
                      <Alert variant="danger" className="mt-2">
                        {fileError}
                      </Alert>
                    ) : (
                      <div className="text-muted small mt-1">
                        Maksimal {MAX_FILE_COUNT} file, masing-masing maksimal
                        5MB
                      </div>
                    )}

                    {form.dokumentasi_kegiatan?.length > 0 && (
                      <div className="mt-3">
                        <h6>File Terpilih:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {form.dokumentasi_kegiatan.map((file, index) => (
                            <FilePreviewCard
                              key={index}
                              file={file}
                              // onRemove={() => {
                              //   const updatedFiles = [
                              //     ...form.dokumentasi_kegiatan,
                              //   ];
                              //   updatedFiles.splice(index, 1);
                              //   setForm((prev) => ({
                              //     ...prev,
                              //     dokumentasi_kegiatan: updatedFiles,
                              //   }));
                              // }}
                              onRemove={() => removeFile(index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Kendala
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="kendala"
                      placeholder="Masukan kendala"
                      value={form.kendala}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Rekomendasi
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="rekomendasi"
                      placeholder="Masukan rekomendasi"
                      value={form.rekomendasi}
                      onChange={handleChange}
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
                          {loading ? 'Menyimpan...' : 'Simpan'}
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
