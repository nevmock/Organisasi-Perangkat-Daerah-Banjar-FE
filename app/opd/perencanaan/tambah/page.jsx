'use client';
import {
  Col,
  Row,
  Card,
  Table,
  Nav,
  Tab,
  Container,
  Form,
  Button,
} from 'react-bootstrap';
import React, { useState } from 'react';

const TambahPerancanaan = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submit here
  };

  const [indikators, setIndikators] = useState(['']); // Awal 1 input

  const handleChange = (index, value) => {
    const updated = [...indikators];
    updated[index] = value;
    setIndikators(updated);
  };

  const handleAddField = () => {
    setIndikators([...indikators, '']);
  };

  const handleRemoveField = (index) => {
    const updated = [...indikators];
    updated.splice(index, 1);
    setIndikators(updated);
  };

  return (
    <Container fluid className="p-6">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Tambah Perencanaan Program</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Col className="mb-3">
              <Form.Group controlId="namaProgram">
                <Form.Label>Nama Program</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama program"
                  required
                />
              </Form.Group>
            </Col>
            <Col className="mb-3">
              <Form.Group controlId="pelaksana">
                <Form.Label>Pelaksana</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan pelaksana"
                  required
                />
              </Form.Group>
            </Col>

            <Col className="mb-3">
              <Form.Group controlId="tglMulai">
                <Form.Label>Tanggal Mulai</Form.Label>
                <Form.Control type="date" required />
              </Form.Group>
            </Col>

            <Col className="mb-3">
              <Form.Group controlId="target">
                <Form.Label>Target</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Masukkan target"
                  required
                />
              </Form.Group>
            </Col>

            <Col className="mb-3">
              <Form.Label>Indikator</Form.Label>
              {indikators.map((indikator, index) => (
                <Row key={index} className="mb-2">
                  <Col md={10}>
                    <Form.Control
                      type="text"
                      placeholder={`Indikator ${index + 1}`}
                      value={indikator}
                      onChange={(e) => handleChange(index, e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={2}>
                    {index > 0 && (
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveField(index)}
                      >
                        Hapus
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}

              <Button variant="secondary" onClick={handleAddField}>
                Tambah Indikator
              </Button>
            </Col>

            <Col md={9}>
              <div className="d-flex align-items-center">
                <div>
                  <Button variant="primary" className="me-2" type="submit">
                    Simpan
                  </Button>
                  <Button
                    variant="outline-white"
                    type="link"
                    href="/opd/perencanaan"
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            </Col>
          </Form>
        </Card.Body>
      </Card>
      {/* end of responsive-tables */}
    </Container>
  );
};

export default TambahPerancanaan;
