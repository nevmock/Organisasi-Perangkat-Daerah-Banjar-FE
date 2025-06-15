'use client';

import React, { useState } from 'react';
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
  kolaborator: [{ nama: '', peran: '' }],
  rincian_kegiatan: '',
  capaian_output: '',
  dokumentasi_kegiatan: '',
  kendala: '',
  rekomendasi: '',
};

export default function DoForm() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    const newData = {
      nama_program: form.nama_program,
      kolaborator: form.kolaborator,
      rincian_kegiatan: form.rincian_kegiatan,
      capaian_output: form.capaian_output,
      dokumentasi_kegiatan: form.dokumentasi_kegiatan,
      kendala: form.kendala,
      rekomendasi: form.rekomendasi,
    };

    try {
      await request.post(`/do`, newData);
      alert('Data berhasil disimpan!');
      window.location.href = '/program/do'; // Redirect ke list
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data.');
    }
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Input Data DO" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              <h3 className="mb-4">Input Data DO</h3>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Label column md={3}>
                    Nama Program
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control
                      name="nama_program"
                      placeholder="Masukan nama program"
                      value={form.nama_program}
                      onChange={handleChange}
                      required
                    />
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
                      placeholder="Link dokumentasi (Google Drive, dsb)"
                      value={form.dokumentasi_kegiatan}
                      onChange={handleChange}
                      required
                    />
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
                <Row className="mt-4">
                  <Col className="text-end">
                    <Button type="submit" variant="primary">
                      Simpan Data DO
                    </Button>
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
