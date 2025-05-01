'use client';
import { programOpd } from 'data/opd/ProgramOpd';
import useMounted from 'hooks/useMounted';
import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from 'react-bootstrap';
import { GeneralSetting } from 'sub-components';
import { DropFiles, PageHeading } from 'widgets';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;
  const hasMounted = useMounted();

  function getProgramById(id) {
    return programOpd.find((program) => program.id === Number(id));
  }

  const program = getProgramById(id);

  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleDropdown = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Laporan Program OPD" />

      {/* General Settings */}
      <Row className="mb-8">
        <Col>
          <Card className="mb-4">
            {/* card body */}
            <Card.Body>
              <div>
                <div className="mb-6">
                  <h4 className="mb-1">Informasi Umum</h4>
                </div>
                {hasMounted && (
                  <Form>
                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="fullName"
                      >
                        Nama Program
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="text"
                          placeholder="Masukkan nama program"
                          value={program.nama_program}
                          readOnly
                        />
                      </Col>
                    </Row>
                    {/* row */}
                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="email"
                      >
                        Nama Pelaksana
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="text"
                          placeholder="Masukan nama pelaksana"
                          value={program.nama_pelaksana}
                          readOnly
                        />
                      </Col>
                    </Row>
                    {/* row */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="phone">
                        Tanggal Mulai
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          type="date"
                          defaultValue={program.tgl_mulai}
                          readOnly
                        />
                      </Col>
                    </Row>

                    {/* Address Line One */}
                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="addressLine">
                        Target
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Masukkan target"
                          value={program.target}
                          readOnly
                        />
                      </Col>
                    </Row>
                  </Form>
                )}
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <div className="mb-6">
                <h4 className="mb-1">Laporan Indikator</h4>
              </div>
              {hasMounted && (
                <Form>
                  {program.indikator.map((indikator, index) => {
                    const isOpen = openIndexes.includes(index);
                    return (
                      <div key={index} className="mb-4 border rounded p-3">
                        <div
                          className="d-flex justify-content-between align-items-center cursor-pointer"
                          onClick={() => toggleDropdown(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <h5 className="mb-0">
                            {index + 1}. {indikator}
                          </h5>
                          <span>{isOpen ? '▲ Tutup' : '▼ Lihat'}</span>
                        </div>

                        {isOpen && (
                          <div className="mt-3">
                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Assessment Keberhasilan (%)
                              </Form.Label>
                              <Col md={8} xs={12}>
                                <Form.Control
                                  type="number"
                                  placeholder="Contoh: 80"
                                  min={0}
                                  max={100}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Checklist
                              </Form.Label>
                              <Col md={8} xs={12}>
                                <Form.Check
                                  type="checkbox"
                                  label="Sudah dilakukan"
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Evidence (gambar)
                              </Form.Label>
                              <Col md={8} xs={12}>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  required
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Kendala
                              </Form.Label>
                              <Col md={8} xs={12}>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Masukkan kendala yang dihadapi"
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Kesimpulan Tindakan
                              </Form.Label>
                              <Col md={8} xs={12}>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Tindakan/solusi yang diambil"
                                />
                              </Col>
                            </Row>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Row className="align-items-center">
                    <Col className="mt-4 text-end">
                      <Button variant="primary" type="submit">
                        Simpan Perubahan
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {id}
    </Container>
  );
};

export default DynamicRoutePage;
