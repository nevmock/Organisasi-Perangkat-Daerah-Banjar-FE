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

export default function DateForm() {
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

  const validateFileCount = () => {
    const totalFiles =
      defaultFile.length + (form.link_laporan_pdf?.length || 0);
    return totalFiles <= MAX_FILE_COUNT;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi file sebelum submit
    const totalFiles = defaultFile.length + uploadedFiles.length;
    if (totalFiles > MAX_FILE_COUNT) {
      setFileError(`Maksimal ${MAX_FILE_COUNT} file`);
      setLoading(false);
      return;
    }

    try {
      const newData = {
        nama_program: form.nama_program,
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai,
        status: form.status,
      };

      const response = await request.post(`/date`, newData);
      const doId = response.data._id;

      if (uploadedFiles.length > 0) {
        await uploadFiles(doId);
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
    if (!doId || uploadedFiles.length === 0) return;

    try {
      const res = await request.postMultipart(`/date/${doId}/dokumentasi`, {
        files: Array.from(uploadedFiles),
      });
      return res.data?.urls || [];
    } catch (err) {
      console.error('Gagal upload file:', err);
      throw err;
    }
  };

  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFileError('');

  //   // Validasi jumlah file
  //   if (files.length > MAX_FILE_COUNT) {
  //     setFileError(`Maksimal ${MAX_FILE_COUNT} file yang dapat diunggah`);
  //     return;
  //   }

  //   // Validasi ukuran file
  //   const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
  //   if (oversizedFiles.length > 0) {
  //     setFileError(
  //       `Ukuran file melebihi batas maksimal 5MB: ${oversizedFiles
  //         .map((f) => f.name)
  //         .join(', ')}`
  //     );
  //     return;
  //   }

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
  // };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');

    // Hitung total file yang akan ada
    const totalFiles = defaultFile.length + uploadedFiles.length + files.length;

    if (totalFiles > MAX_FILE_COUNT) {
      const availableSlots =
        MAX_FILE_COUNT - defaultFile.length - uploadedFiles.length;
      setFileError(`Anda hanya dapat menambahkan ${availableSlots} file lagi`);
      e.target.value = '';
      return;
    }

    // Validasi ukuran file
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setFileError(
        `File melebihi 5MB: ${oversizedFiles.map((f) => f.name).join(', ')}`
      );
      e.target.value = '';
      return;
    }

    if (files.length > 0) {
      // Tambahkan ke state uploadedFiles (file asli)
      setUploadedFiles((prev) => [...prev, ...files]);

      // Tambahkan ke form.link_laporan_pdf (untuk preview)
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

    e.target.value = ''; // Reset input file setelah diproses
  };

  // const removeFile = (index) => {
  //   const updatedFiles = [...form.link_laporan_pdf];
  //   updatedFiles.splice(index, 1);
  //   setForm((prev) => ({
  //     ...prev,
  //     link_laporan_pdf: updatedFiles,
  //   }));
  //   setFileError('');
  // };

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

      // Juga hapus dari uploadedFiles state jika perlu
      const updatedUploaded = [...uploadedFiles];
      updatedUploaded.splice(index, 1);
      setUploadedFiles(updatedUploaded);
    }
    setFileError('');
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Input Data Date" />
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
                        <option key={index} value={opt.id}>
                          {opt.nama_program}
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
                      onChange={handleFileChange}
                      disabled={!validateFileCount()}
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

                    {form.link_laporan_pdf?.length > 0 && (
                      <div className="mt-3">
                        <h6>File Terpilih:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {form.link_laporan_pdf.map((file, index) => (
                            <FilePreviewCard
                              key={index}
                              file={file}
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
