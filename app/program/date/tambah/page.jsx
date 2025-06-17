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

const sumberDanaOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'final', label: 'Final' },
  { value: 'revisi', label: 'Revisi' },
];

export default function DateForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [programNames, setProgramNames] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  const uploadFiles = async () => {
    if (!form.nama_program) {
      throw new Error('Pilih program terlebih dahulu');
    }

    const uploadedUrls = [];

    for (const file of form.link_laporan_pdf) {
      const formData = new FormData();
      formData.append('files', file.fileObject);

      try {
        const res = await request.postMultipart(
          `/date/${form.nama_program}/dokumentasi`,
          { files: file.fileObject }
        );
        uploadedUrls.push(res.data.url); // Asumsi response berupa { url: "https://example.com/foto1.jpg" }
      } catch (err) {
        console.error('Gagal mengunggah file:', err);
        throw err;
      }
    }

    return uploadedUrls;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(form);
    try {
      // 1. Upload files terlebih dahulu
      const dokumentasiUrls = await uploadFiles();

      // 2. Kirim data utama
      const newData = {
        nama_program: form.nama_program,
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai,
        link_laporan_pdf: dokumentasiUrls,
        status: form.status,
      };

      await request.post(`/date`, newData);
      alert('Data berhasil disimpan!');
      window.location.href = '/program/date';
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

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
                {/* <Row className="mb-3">
                  <Form.Label column md={3}>
                    Nama Program
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="nama_program"
                      placeholder="Masukkan nama program"
                      value={form.nama_program}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row> */}
                {/* <Row className="mb-3">
                  <Form.Label column md={3}>
                    Nama Program
                  </Form.Label>
                  <Col md={9}>
                    <Form.Select
                      name="nama_program"
                      value={form.nama_program}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Nama Program</option>
                      {programNames.map((opt, index) => (
                        <option key={index} value={opt.nama_program}>
                          {opt.nama_program}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row> */}
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
                    Tanggal Mulai
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      type="date"
                      name="tanggal_mulai"
                      value={form.tanggal_mulai}
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
                      value={form.tanggal_selesai}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>
                {/* <Row className="mb-3">
                  <Form.Label column md={3}>
                    Link Laporan PDF
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="link_laporan_pdf"
                      placeholder="Masukkan link laporan PDF"
                      value={form.link_laporan_pdf}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row> */}
                {/* <Row className="mb-3">
                  <Form.Label column md={3}>
                    Laporan PDF
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="link_laporan_pdf"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Simpan nama file atau path relatif ke state
                          setForm((prev) => ({
                            ...prev,
                            link_laporan_pdf: `uploads/${file.name}`, // atau format path lain yang Anda butuhkan
                          }));
                        }
                      }}
                      required
                    />
                    {form.link_laporan_pdf && (
                      <div className="mt-2">
                        <small>File terpilih: {form.link_laporan_pdf}</small>
                      </div>
                    )}
                  </Col>
                </Row> */}
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Dokumentasi Kegiatan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="link_laporan_pdf"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const processedFiles = files.map((file) => ({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            url: URL.createObjectURL(file),
                            fileObject: file,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            link_laporan_pdf: processedFiles,
                          }));
                        }
                      }}
                      required
                    />

                    {form.link_laporan_pdf?.length > 0 && (
                      <div className="mt-3">
                        <h6>File Terpilih:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {form.link_laporan_pdf.map((file, index) => (
                            <FilePreviewCard
                              key={index}
                              file={file}
                              onRemove={() => {
                                const updatedFiles = [...form.link_laporan_pdf];
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
                        >
                          Simpan
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
