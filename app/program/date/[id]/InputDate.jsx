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
  tanggal_mulai: '',
  tanggal_selesai: '',
  link_laporan_pdf: [],
  status: '',
};

const MAX_FILE_COUNT = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const sumberDanaOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'final', label: 'Final' },
  { value: 'revisi', label: 'Revisi' },
];

export default function DateForm({ id }) {
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
          label: item.nama_program, // This will be displayed
          value: item._id, // This will be the actual value
        }))
      );

      if (id) {
        const res = await request.get(`/date/getById/${id}`);
        const {
          nama_program,
          tanggal_mulai,
          tanggal_selesai,
          link_laporan_pdf,
          status_laporan,
        } = res.data;

        setForm({
          nama_program: nama_program._id,
          tanggal_mulai: tanggal_mulai,
          tanggal_selesai: tanggal_selesai,
          status: status_laporan,
        });
        setDefaultFile(link_laporan_pdf);
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
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai,
        status: form.status,
      };

      const response = await request.put(`/date/${id}`, newData);
      const doId = response.data._id;

      if (uploadedFiles?.length > 0) {
        try {
          await uploadFiles(doId);
        } catch (uploadError) {
          console.error('Gagal mengunggah dokumentasi:', uploadError);
        }
      }

      alert('Data berhasil disimpan!');
      window.location.href = '/program/date';
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
      const res = await request.postMultipart(`/date/${doId}/dokumentasi`, {
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
        link_laporan_pdf: [...(prev.link_laporan_pdf || []), ...processedFiles],
      }));
    }
  };

  const removeFile = async (file, index, isDefault = false) => {
    if (isDefault) {
      try {
        const filename = file.split('/').pop();
        await request.delete(
          `/date/${id}/dokumentasi?filename=${encodeURIComponent(filename)}`
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
      const updatedFiles = [...form.link_laporan_pdf];
      updatedFiles.splice(index, 1);
      setForm((prev) => ({
        ...prev,
        link_laporan_pdf: updatedFiles,
      }));
    }
    setFileError('');
  };

  console.log(defaultFile);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Input Data DATE" />
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
                        <option key={index} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Selection>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Tanggal Mulai
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      type="date"
                      name="tanggal_mulai"
                      value={form.tanggal_mulai?.slice(0, 10) || ''}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Tanggal Selesai
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      type="date"
                      name="tanggal_selesai"
                      value={form.tanggal_selesai?.slice(0, 10) || ''}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Dokumen Laporan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="link_laporan_pdf"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      multiple
                      // disabled={defaultFile?.length <= 3}
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
                      //       link_laporan_pdf: processedFiles,
                      //     }));
                      //   }
                      // }}
                      onChange={handleFileChange}
                      // required
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

                    {(form.link_laporan_pdf?.length > 0 ||
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
                          {form.link_laporan_pdf?.length > 0 &&
                            form.link_laporan_pdf.map((file, index) => (
                              <FilePreviewCard
                                key={index}
                                file={file}
                                onRemove={() => {
                                  const updatedFiles = [
                                    ...form.link_laporan_pdf,
                                  ];
                                  updatedFiles.splice(index, 1);
                                  setForm((prev) => ({
                                    ...prev,
                                    link_laporan_pdf: updatedFiles,
                                  }));
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Status
                  </Form.Label>
                  <Col md={9}>
                    <Form.Select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Status</option>
                      {sumberDanaOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Select>
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
                          href="/program/date"
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
