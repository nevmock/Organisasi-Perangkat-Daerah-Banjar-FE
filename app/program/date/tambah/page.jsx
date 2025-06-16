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
  status: '',
};

const sumberDanaOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'final', label: 'Final' },
  { value: 'revisi', label: 'Revisi' },
];

export default function DateForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programNames, setProgramNames] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newData = { ...form };

    console.log('Data to submit:', newData);

    try {
      await request.post(`/date`, newData);
      alert('Data berhasil disimpan!');
      window.location.href = '/program/date';
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data.');
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
                      required
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
