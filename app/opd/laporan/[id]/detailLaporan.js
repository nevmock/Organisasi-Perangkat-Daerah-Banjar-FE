"use client";
import { useEffect, useState } from "react";
import axios from "axios"; // perbaikan impor axios
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { getISOWeek } from "utils/getISOWeek";
import { PageHeading } from "widgets";
import useMounted from "hooks/useMounted";

const DetailLaporan = ({ id }) => {
  const hasMounted = useMounted();
  const [dataProgram, setDataProgram] = useState({});
  const [openIndexes, setOpenIndexes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/perencanaan/${id}`
        );
        console.log("Data dari API:", res.data);
        setDataProgram(res.data);
      } catch (err) {
        console.error("Gagal fetch data perencanaan:", err);
      }
    };

    fetchData();
  }, [id]);

  const toggleDropdown = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = async (e, index, id) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    const sudahSelesai = form[`finish[${index}]`]?.checked;
    const kendala = form[`kendala[${index}]`]?.value;
    const tindakan = form[`tindakan[${index}]`]?.value;
    const evidences = form[`evidence[${index}][]`]?.files;

    formData.append("sudah_selesai", sudahSelesai ? "true" : "false");
    formData.append("kendala", kendala);
    formData.append("kesimpulan_tindakan", tindakan);

    // Multiple file evidence
    if (evidences && evidences.length > 0) {
      for (let i = 0; i < evidences.length; i++) {
        formData.append("evidence[]", evidences[i]);
      }
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/indikator/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Data laporan berhasil disimpan!");
      window.location.href = `/opd/laporan/${dataProgram?._id}`;
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    }
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Laporan Program OPD" />

      <Row className="mb-8">
        <Col>
          {/* Informasi Program */}
          <Card className="mb-4">
            <Card.Body>
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
                    <Col md={8}>
                      <Form.Control
                        id="namaProgram"
                        type="text"
                        value={dataProgram?.nama_program || ""}
                        readOnly
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Form.Label
                      className="col-sm-4 col-form-label"
                      htmlFor="namaPelaksana"
                    >
                      Nama Pelaksana
                    </Form.Label>
                    <Col md={8}>
                      <Form.Control
                        id="namaPelaksana"
                        type="text"
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
                    <Col md={8}>
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
                    <Col md={8}>
                      <Form.Control
                        id="target"
                        as="textarea"
                        rows={3}
                        value={dataProgram?.target || ""}
                        readOnly
                      />
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>

          {/* Laporan Indikator */}
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Laporan Indikator</h4>

              {hasMounted &&
                (dataProgram?.indikators || []).map((item, index) => {
                  const isOpen = openIndexes.includes(index);

                  return (
                    <Form
                      key={index}
                      onSubmit={(e) => handleSubmit(e, index, item._id)}
                    >
                      <div className="mb-4 border rounded p-3">
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleDropdown(index)}
                        >
                          <h5 className="mb-0">
                            {index + 1}. {item.indikator_label}
                          </h5>
                          <span>{isOpen ? "▲ Tutup" : "▼ Lihat"}</span>
                        </div>

                        {isOpen && (
                          <div className="mt-3">
                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Sudah Dilakukan
                              </Form.Label>
                              <Col md={8}>
                                <Form.Check
                                  type="checkbox"
                                  name={`finish[${index}]`}
                                  style={{
                                    transform: "scale(1.5)",
                                    transformOrigin: "top left",
                                  }}
                                  defaultChecked={item.sudah_selesai === true}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Evidence (gambar)
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  name={`evidence[${index}][]`}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Kendala
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name={`kendala[${index}]`}
                                  placeholder="Masukkan kendala yang dihadapi"
                                  defaultValue={item.kendala || ""}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Kesimpulan Tindakan
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name={`tindakan[${index}]`}
                                  placeholder="Tindakan/solusi yang diambil"
                                  defaultValue={item.kesimpulan_tindakan || ""}
                                />
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col className="text-end">
                                <Button type="submit" variant="primary">
                                  Simpan Perubahan
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </div>
                    </Form>
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailLaporan;
