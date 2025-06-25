'use client';

import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { PageHeading } from 'widgets';
import FilePreviewCard from 'components/bootstrap/FilePreviewCard';

export default function DateForm({ form, defaultFile }) {
  return (
    <Container fluid className="p-6">
      <PageHeading heading="Detail Data DATE" />

      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              {/* Nama Program */}
              <Row className="mb-3">
                <Form.Label column md={3}>
                  Nama Program
                </Form.Label>
                <Col md={9}>
                  <Form.Control value={form.nama_program} readOnly disabled />
                </Col>
              </Row>

              {/* Tanggal Mulai */}
              <Row className="mb-3">
                <Form.Label column md={3}>
                  Tanggal Mulai
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    value={form.tanggal_mulai?.slice(0, 10)}
                    readOnly
                    disabled
                  />
                </Col>
              </Row>

              {/* Tanggal Selesai */}
              <Row className="mb-3">
                <Form.Label column md={3}>
                  Tanggal Selesai
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    value={form.tanggal_selesai?.slice(0, 10)}
                    readOnly
                    disabled
                  />
                </Col>
              </Row>

              {/* Dokumen */}
              <Row className="mb-3">
                <Form.Label column md={3}>
                  Dokumen Laporan
                </Form.Label>
                <Col md={9}>
                  {defaultFile.length === 0 &&
                  form.link_laporan_pdf.length === 0 ? (
                    <span className="text-muted small">Tidak ada file.</span>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {defaultFile.map((file, index) => (
                        <FilePreviewCard
                          key={index}
                          file={file}
                          readOnly
                          disabled
                        />
                      ))}
                      {form.link_laporan_pdf?.map((file, index) => (
                        <FilePreviewCard
                          key={index}
                          file={file}
                          readOnly
                          disabled
                        />
                      ))}
                    </div>
                  )}
                </Col>
              </Row>

              {/* Status */}
              <Row className="mb-3">
                <Form.Label column md={3}>
                  Status Laporan
                </Form.Label>
                <Col md={9}>
                  <Form.Control value={form.status_laporan} readOnly disabled />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
