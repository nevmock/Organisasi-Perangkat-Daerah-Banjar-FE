"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import useMounted from "hooks/useMounted";
import { PageHeading } from "widgets";
import { getISOWeek } from "utils/getISOWeek";
import request from "utils/request";

const DetailPerencanaan = ({ id }) => {
  const hasMounted = useMounted();

  const [dataProgram, setDataProgram] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`/perencanaan/getById/${id}`);
        console.log("Data dari API:", res.data);
        setDataProgram(res.data);
      } catch (err) {
        console.error("Gagal fetch data perencanaan:", err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Detail Program OPD" />

      <Row className="mb-8">
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <div>
                <div className="mb-6">
                  <h4 className="mb-1">Informasi Program</h4>
                </div>
                {hasMounted && (
                  <Form>
                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="namaProgram"
                      >
                        Nama Program
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          id="namaProgram"
                          type="text"
                          placeholder="Masukkan nama program"
                          value={dataProgram?.nama_program || ""}
                          readOnly
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label form-label"
                        htmlFor="namaPelaksana"
                      >
                        Nama Pelaksana
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          id="namaPelaksana"
                          type="text"
                          placeholder="Masukkan nama pelaksana"
                          value={dataProgram?.opd_pelaksana || ""}
                          readOnly
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label"
                        htmlFor="tglPelaksanaan"
                      >
                        Tanggal Pelaksanaan
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          id="tglPelaksanaan"
                          type="week"
                          value={getISOWeek(dataProgram?.tgl_mulai || "")}
                          readOnly
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label
                        className="col-sm-4 col-form-label"
                        htmlFor="target"
                      >
                        Target
                      </Form.Label>
                      <Col md={8} xs={12}>
                        <Form.Control
                          id="target"
                          as="textarea"
                          rows={3}
                          placeholder="Masukkan target"
                          value={dataProgram?.target || ""}
                          readOnly
                        />
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Form.Label className="col-sm-4" htmlFor="indikator">
                        Indikator
                      </Form.Label>
                      <Col md={8} xs={12}>
                        {(dataProgram?.id_indikator || []).map(
                          (item, index) => (
                            <Form.Control
                              key={index}
                              type="text"
                              value={`${index + 1}. ${item.indikator_label}`}
                              readOnly
                              className="mb-3"
                            />
                          )
                        )}
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col className="text-end">
                        <Button
                          variant="outline-white"
                          type="link"
                          href="/opd/perencanaan"
                        >
                          Kembali
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailPerencanaan;
