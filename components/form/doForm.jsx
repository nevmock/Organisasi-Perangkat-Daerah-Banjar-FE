'use client';
import { Form, Row, Col } from 'react-bootstrap';
import Selection from 'components/form/selection';
import FilePreviewCard from 'components/bootstrap/FilePreviewCard';

export default function DoForm({ form, programNames, defaultFile = [] }) {
  return (
    <Form>
      {/* Nama Program */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Nama Program
        </Form.Label>
        <Col md={9}>
          <Selection
            name="nama_program"
            value={form.nama_program}
            options={programNames}
            optionLabel="nama_program"
            optionValue="id"
            disabled
          />
        </Col>
      </Row>

      {/* Kolaborator */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Kolaborator
        </Form.Label>
        <Col md={9}>
          {form.kolaborator.map((item, idx) => (
            <Row className="mb-2" key={idx}>
              <Col sm={6}>
                <Form.Label>Nama Kolaborator</Form.Label>
                <Form.Control
                  disabled
                  placeholder="Nama Kolaborator"
                  value={item.nama}
                  readOnly
                />
              </Col>
              <Col sm={6}>
                <Form.Label>Peran Kolaborator</Form.Label>
                <Form.Control
                  disabled
                  placeholder="Peran Kolaborator"
                  value={item.peran}
                  readOnly
                />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>

      {/* Rincian Kegiatan */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Rincian Kegiatan
        </Form.Label>
        <Col md={9}>
          <Form.Control
            disabled
            as="textarea"
            name="rincian_kegiatan"
            value={form.rincian_kegiatan}
            readOnly
          />
        </Col>
      </Row>

      {/* Capaian Output */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Capaian Output
        </Form.Label>
        <Col md={9}>
          <Form.Control
            disabled
            as="textarea"
            name="capaian_output"
            value={form.capaian_output}
            readOnly
          />
        </Col>
      </Row>

      {/* Dokumentasi */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Dokumentasi Kegiatan
        </Form.Label>
        <Col md={9}>
          {defaultFile.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {defaultFile.map((file, index) => (
                <FilePreviewCard key={index} file={file} readOnly={true} />
              ))}
            </div>
          ) : (
            <div className="text-muted small">Tidak ada file</div>
          )}
        </Col>
      </Row>

      {/* Kendala */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Kendala
        </Form.Label>
        <Col md={9}>
          <Form.Control
            disabled
            as="textarea"
            name="kendala"
            value={form.kendala}
            readOnly
          />
        </Col>
      </Row>

      {/* Rekomendasi */}
      <Row className="mb-3">
        <Form.Label column md={3}>
          Rekomendasi
        </Form.Label>
        <Col md={9}>
          <Form.Control
            disabled
            as="textarea"
            name="rekomendasi"
            value={form.rekomendasi}
            readOnly
          />
        </Col>
      </Row>
    </Form>
  );
}
