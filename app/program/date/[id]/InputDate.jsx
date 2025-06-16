'use client';

import { getAllHowByNamaProgram } from 'app/api/getAllHowByNamaProgram';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import request from 'utils/request';
import { PageHeading } from 'widgets';

const initialForm = {
  nama_program: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  link_laporan_pdf: '',
  status_laporan: '',
};

const sumberDanaOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'final', label: 'Final' },
  { value: 'revisi', label: 'Revisi' },
];

export default function DateForm({ id }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programNames, setProgramNames] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
      nama_program: form.nama_program,
      tanggal_mulai: form.tanggal_mulai,
      tanggal_selesai: form.tanggal_selesai,
      link_laporan_pdf: form.link_laporan_pdf,
      status_laporan: form.status_laporan,
    };
    try {
      await request.put(`/date/${id}`, newData);
      alert('Data berhasil diperbarui!');
      window.location.href = '/program/date';
    } catch (err) {
      console.error('Gagal memperbarui data:', err);
      alert('Terjadi kesalahan saat memperbarui.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`/date/getById/${id}`);
        // Menyaring hanya field yang dibutuhkan
        const {
          nama_program,
          tanggal_mulai,
          tanggal_selesai,
          // link_laporan_pdf,
          status_laporan,
        } = res.data;

        setForm({
          nama_program,
          tanggal_mulai,
          tanggal_selesai,
          // link_laporan_pdf,
          status_laporan,
        });
      } catch (err) {
        console.error('Gagal fetch data:', err);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const names = await getAllHowByNamaProgram();
        setProgramNames(names);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data program');
        setProgramNames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Update Data DATE" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
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
                <Row className="mb-3">
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
                <Row className="mb-3">
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
                    />
                    {form.link_laporan_pdf && (
                      <div className="mt-2">
                        <small>File terpilih: {form.link_laporan_pdf}</small>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    status_laporan
                  </Form.Label>
                  <Col md={9}>
                    <Form.Select
                      name="status_laporan"
                      value={form.status_laporan}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Status Laporan</option>
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
                          Update
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
