'use client'

import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { PageHeading } from "widgets";

const initialForm = {
    nama_program: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    link_laporan_pdf: "",
};

export default function DateForm({ onSubmit }) {
    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    };

    return (
        <Container fluid className="p-6">
            <PageHeading heading="Input Data Date" />
            <Row className="mb-8">
                <Col>
                    <Card>
                        <Card.Body>
                            <h3 className="mb-4">Input Data Date</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Form.Label column md={3}>Nama Program</Form.Label>
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
                                    <Form.Label column md={3}>Tanggal Mulai</Form.Label>
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
                                    <Form.Label column md={3}>Tanggal Selesai</Form.Label>
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
                                    <Form.Label column md={3}>Link Laporan PDF</Form.Label>
                                    <Col md={9}>
                                        <Form.Control
                                            name="link_laporan_pdf"
                                            placeholder="Masukan link laporan PDF"
                                            value={form.link_laporan_pdf}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col className="text-end">
                                        <Button type="submit" variant="primary">
                                            Simpan Data Date
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