"use client";
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
} from "react-bootstrap";

import React, { useState } from "react";
import axios from "axios";
import weekToDate from "utils/weekToDate";
import request from "utils/request";

const TambahPerancanaan = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newData = {
      nama_program: e.target.namaProgram.value,
      opd_pelaksana: e.target.pelaksana.value,
      tgl_mulai: weekToDate(e.target.tglMulai.value),
      target: e.target.target.value,
      indikator_labels: indikators,
    };
    console.log(e.target.tglMulai.value);

    try {
      await request.post(`/perencanaan`, newData);
      alert("Data berhasil disimpan!");
      window.location.href = "/opd/perencanaan"; // Redirect ke list
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    }
  };

  const [indikators, setIndikators] = useState([""]); // Awal 1 input

  const handleChange = (index, value) => {
    const updated = [...indikators];
    updated[index] = value;
    setIndikators(updated);
  };

  const handleAddField = () => {
    setIndikators([...indikators, ""]);
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
                <Form.Label>Tanggal Pelaksanaan</Form.Label>
                <Form.Control type="week" required />
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
