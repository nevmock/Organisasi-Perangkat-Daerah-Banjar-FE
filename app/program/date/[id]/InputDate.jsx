'use client';

import FilePreviewCard from 'components/bootstrap/FilePreviewCard';
import Selection from 'components/form/selection';
import useMounted from 'hooks/useMounted';
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
  status_laporan: '',
};

const MAX_FILE_COUNT = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const sumberDanaOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'final', label: 'Final' },
  { value: 'revisi', label: 'Revisi' },
];

export default function DateForm({ id }) {
  const hasMounted = useMounted();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [programNames, setProgramNames] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [defaultFile, setDefaultFile] = useState([]);
  const [fileError, setFileError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    tanggal_mulai: '',
    tanggal_selesai: '',
  });

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
          status_laporan: status_laporan,
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

    if (!validateBeforeSubmit()) {
      return;
    }

    // Validasi total file
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
        status_laporan: form.status_laporan,
      };

      const response = await request.put(`/date/${id}`, newData);
      const doId = response.data._id;

      // Upload file hanya jika ada file baru
      if (uploadedFiles.length > 0) {
        await uploadFiles(doId);
      }

      alert('Data berhasil disimpan!');
      window.location.href = '/program/date';
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || 'Gagal menyimpan data.');
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');

    // Hitung total file yang akan ada
    const totalFiles = defaultFile.length + uploadedFiles.length + files.length;

    if (totalFiles > MAX_FILE_COUNT) {
      // const availableSlots =
      //   MAX_FILE_COUNT - defaultFile.length - uploadedFiles.length;
      setFileError(`Anda hanya dapat menambahkan maksimal 3 file`);
      e.target.value = '';
      return;
    }

    const invalidFiles = files.filter(
      (file) =>
        !file.type.startsWith('image/') && file.type !== 'application/pdf'
    );

    if (invalidFiles.length > 0) {
      setFileError(
        `File berikut bukan gambar (jpg, jpeg, png)/PDF: ${invalidFiles
          .map((f) => f.name)
          .join(', ')}`
      );
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    // Update form
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validasi tanggal selesai >= tanggal mulai
    if (name === 'tanggal_mulai' && form.tanggal_selesai) {
      const startDate = new Date(value);
      const endDate = new Date(form.tanggal_selesai);

      if (endDate < startDate) {
        setValidationErrors((prev) => ({
          ...prev,
          tanggal_selesai:
            'Tanggal selesai harus setelah atau sama dengan tanggal mulai',
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          tanggal_selesai: '',
        }));
      }
    }

    if (name === 'tanggal_selesai' && form.tanggal_mulai) {
      const startDate = new Date(form.tanggal_mulai);
      const endDate = new Date(value);

      if (endDate < startDate) {
        setValidationErrors((prev) => ({
          ...prev,
          tanggal_selesai:
            'Tanggal selesai harus setelah atau sama dengan tanggal mulai',
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          tanggal_selesai: '',
        }));
      }
    }
  };

  // Validasi sebelum submit
  const validateBeforeSubmit = () => {
    let isValid = true;
    const newErrors = { ...validationErrors };

    if (!form.tanggal_mulai) {
      newErrors.tanggal_mulai = 'Tanggal mulai harus diisi';
      isValid = false;
    }

    if (!form.tanggal_selesai) {
      newErrors.tanggal_selesai = 'Tanggal selesai harus diisi';
      isValid = false;
    }

    if (form.tanggal_mulai && form.tanggal_selesai) {
      const startDate = new Date(form.tanggal_mulai);
      const endDate = new Date(form.tanggal_selesai);

      if (endDate < startDate) {
        newErrors.tanggal_selesai =
          'Tanggal selesai harus setelah atau sama dengan tanggal mulai';
        isValid = false;
      }
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  console.log(defaultFile);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Update Data DATE" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              {hasMounted && (
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
                        value={form.nama_program} // Pastikan ini adalah ID (misal "68513aab5f4d5cf4feeb87fb")
                        onChange={handleChange}
                        options={programNames}
                        optionLabel="nama_program"
                        optionValue="id"
                        placeholder="Pilih Nama Program"
                      />
                    </Col>
                  </Row>
                  {/* <Row className="mb-3">
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
                  </Row> */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Tanggal Mulai
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="date"
                        name="tanggal_mulai"
                        value={form.tanggal_mulai?.slice(0, 10) || ''}
                        onChange={handleDateChange}
                        required
                      />
                      {validationErrors.tanggal_mulai && (
                        <Form.Text className="text-danger">
                          {validationErrors.tanggal_mulai}
                        </Form.Text>
                      )}
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
                        onChange={handleDateChange}
                        min={form.tanggal_mulai} // Otomatis membatasi tanggal minimum
                        required
                      />
                      {validationErrors.tanggal_selesai && (
                        <Form.Text className="text-danger">
                          {validationErrors.tanggal_selesai}
                        </Form.Text>
                      )}
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
                      <div className="text-muted small mt-1">
                        {defaultFile.length + uploadedFiles.length}/
                        {MAX_FILE_COUNT} file terisi. Maksimal {MAX_FILE_COUNT}{' '}
                        file (5MB/file)
                      </div>
                      <div className="text-muted small mt-1">
                        Hanya file gambar (jpg, jpeg, png) dan PDF yang
                        diizinkan!
                      </div>
                      {fileError && (
                        <Alert variant="danger" className="mt-2">
                          {fileError}
                        </Alert>
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
                                  onRemove={() => removeFile(file, index, true)}
                                />
                              ))}
                            {form.link_laporan_pdf?.length > 0 &&
                              form.link_laporan_pdf.map((file, index) => (
                                <FilePreviewCard
                                  key={index}
                                  file={file}
                                  onRemove={() =>
                                    removeFile(file, index, false)
                                  } // perhatikan argumennya
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
                        name="status_laporan"
                        value={form.status_laporan}
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
                            className="me-2 text-white"
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
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
