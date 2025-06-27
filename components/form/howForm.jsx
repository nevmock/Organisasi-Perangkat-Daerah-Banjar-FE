import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';

const HowForm = ({ form }) => {
  return (
    <Form>
      <Row className="mb-3">
        <Form.Label column md={3}>
          Nama Program
        </Form.Label>
        <Col md={9}>
          <Form.Control value={form.nama_program} readOnly disabled />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column md={3}>
          Tujuan Program
        </Form.Label>
        <Col md={9}>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.tujuan_program}
            readOnly
            disabled
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column md={3}>
          Sasaran Program
        </Form.Label>
        <Col md={9}>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.sasaran_program}
            readOnly
            disabled
          />
        </Col>
      </Row>

      {/* Rencana Output Kuantitatif */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Rencana Output Kuantitatif
        </Form.Label>
        <Col md={9}>
          {form.rencana_output_kuantitatif.map((val, idx) => (
            <Row className="mb-2" key={idx}>
              <Col xs={12}>
                <Form.Control value={val} readOnly disabled />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      {/* Rencana Output Kualitatif */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Rencana Output Kualitatif
        </Form.Label>
        <Col md={9}>
          {form.rencana_output_kualitatif.map((val, idx) => (
            <Row className="mb-2" key={idx}>
              <Col xs={12}>
                <Form.Control value={val} readOnly disabled />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      {/* Target Indikator Kinerja */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Target Indikator Kinerja
        </Form.Label>
        <Col md={9}>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Label column>Jumlah peserta</Form.Label>
              <Form.Control value={form.jumlah_peserta} readOnly disabled />
            </Col>
            <Col md={6}>
              <Form.Label column>Jumlah pelatihan</Form.Label>
              <Form.Control value={form.jumlah_pelatihan} readOnly disabled />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Label column>Tingkat kepuasan</Form.Label>
              <InputGroup>
                <Form.Control value={form.tingkat_kepuasan} readOnly disabled />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Lokasi */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Rencana Lokasi
        </Form.Label>
        <Col md={9}>
          <Row className="mb-2">
            <Col md={4}>
              <Form.Label column>Kelurahan</Form.Label>
              <Form.Control value={form.lokasi_kelurahan} readOnly disabled />
            </Col>
            <Col md={4}>
              <Form.Label column>Kecamatan</Form.Label>
              <Form.Control value={form.lokasi_kecamatan} readOnly disabled />
            </Col>
            <Col md={4}>
              <Form.Label column>Kota</Form.Label>
              <Form.Control value={form.lokasi_kota} readOnly disabled />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* OPD */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          OPD Pengusul Utama
        </Form.Label>
        <Col md={9}>
          <Form.Control value={form.opd_pengusul_utama} readOnly disabled />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Label column md={3}>
          OPD Kolaborator
        </Form.Label>
        <Col md={9}>
          {form.opd_kolaborator.map((val, idx) => (
            <Row className="mb-2" key={idx}>
              <Col xs={12}>
                <Form.Control value={val} readOnly disabled />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </Form>
  );
};

export default HowForm;
