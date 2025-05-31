"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { getISOWeek } from "utils/getISOWeek";
import { PageHeading } from "widgets";
import useMounted from "hooks/useMounted";
import { FormSelect, DropFiles } from "widgets";
import request from "utils/request";

const DeatailAmplifikasi = ({ id }) => {
  const hasMounted = useMounted();
  const [dataProgram, setDataProgram] = useState({});
  const [openIndexes, setOpenIndexes] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const platformsDatas = [
    { value: "Tiktok", label: "Tiktok" },
    { value: "Facebook", label: "Facebook" },
    { value: "X", label: "X" },
    { value: "Instagram", label: "Instagram" },
  ];
  const typeDatas = [
    { value: "singgle", label: "Singgle" },
    { value: "corousel", label: "Corousel" },
  ];

  const baseURL = "http://localhost:5050/";

  const fetchData = useCallback(async () => {
    try {
      const res = await request.get(`/perencanaan/getById/${id}`);
      setDataProgram(res.data);
    } catch (err) {
      console.error("Gagal fetch data perencanaan:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleDropdown = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePreview = (src) => {
    setPreviewImage(src);
    setShowPreview(true);
  };

  const handleSubmit = async (e, index, amplifikasiId) => {
    e.preventDefault();
    const form = e.target;

    const sudahPost = form[`finish[${index}]`]?.checked;
    const caption = form[`caption[${index}]`]?.value;
    const platform = form[`platform[${index}][]`]?.value;
    const type = form[`type[${index}]`]?.value;
    const thumbnailFile = form[`thumbnail[${index}][]`]?.files;
    const evidenceFiles = form[`evidence[${index}][]`]?.files;

    const payload = {
      sudah_dipost: !!sudahPost,
      caption: caption || "",
      platform: platform || "",
      type: type || "",
    };

    if (evidenceFiles && evidenceFiles.length > 0) {
      payload.evidence = [];
    }
    if (thumbnailFile && thumbnailFile.length > 0) {
      payload.thumbnail = [];
    }

    try {
      // 1. Update teks (PUT)
      await request.put(`/amplifikasi/${amplifikasiId}`, payload);
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Gagal menyimpan data.");
    }

    // 2. Upload thumbnail
    if (thumbnailFile && thumbnailFile.length > 0) {
      const thumbnailForm = new FormData();
      for (let i = 0; i < thumbnailFile.length; i++) {
        thumbnailForm.append("thumbnail", thumbnailFile[i]);
      }

      try {
        await request.postMultipart(
          `/amplifikasi/${amplifikasiId}/upload-thumbnail`,
          {
            thumbnail: Array.from(thumbnailFile),
          }
        );
      } catch (err) {
        console.error("Gagal upload thumbnail:", err);
        alert("Gagal upload thumbnail.");
        return;
      }
    }

    // 3. Upload evidence
    if (evidenceFiles && evidenceFiles.length > 0) {
      try {
        await request.postMultipart(
          `/amplifikasi/${amplifikasiId}/upload-evidence`,
          {
            evidence: Array.from(evidenceFiles),
          }
        );
      } catch (err) {
        console.error("Gagal upload evidence:", err);
        alert("Gagal upload evidence.");
        return;
      }
    }

    alert("Amplifikasi berhasil disimpan!");
    fetchData();
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Program OPD" />

      <Row className="mb-8">
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <div className="mb-6">
                <h4 className="mb-1">Informasi Program</h4>
              </div>
              {hasMounted && (
                <Form>
                  <Row className="mb-3">
                    <Form.Label
                      className="col-sm-4 col-form-label"
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

                  <Row className="mt-3">
                    <Col className="text-end">
                      <Button variant="outline-white" href="/opd/laporan">
                        Kembali
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>

          {/* Laporan Indikator */}
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Amplifikasi Indikator</h4>

              {hasMounted &&
                (dataProgram?.id_indikator || []).map((item, index) => {
                  const isOpen = openIndexes.includes(index);
                  return (
                    <Form
                      key={index}
                      onSubmit={(e) =>
                        handleSubmit(e, index, item.id_amplifikasi._id)
                      }
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
                                Sudah Posting
                              </Form.Label>
                              <Col md={8}>
                                <Form.Check
                                  type="checkbox"
                                  name={`finish[${index}]`}
                                  defaultChecked={
                                    item.id_amplifikasi.sudah_dipost === true
                                  }
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label
                                className="col-sm-4"
                                htmlFor="platform"
                              >
                                Platform
                              </Form.Label>
                              <Col md={8} xs={12}>
                                <Form.Control
                                  as={FormSelect}
                                  placeholder="Select Platform"
                                  id="platform"
                                  options={platformsDatas}
                                  name={`platform[${index}][]`}
                                  defaultselected={item.id_amplifikasi.platform}
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Thumbnail
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  name={`thumbnail[${index}][]`}
                                />

                                {item.id_amplifikasi.thumbnail?.length > 0 && (
                                  <div className="mt-2 d-flex flex-wrap gap-2">
                                    {item.id_amplifikasi.thumbnail
                                      .filter((imgPath) => imgPath !== "") // Menyaring imgPath yang kosong
                                      .map((imgPath, i) => (
                                        <img
                                          key={i}
                                          src={imgPath.replace(/\\/g, "/")}
                                          alt={`evidence-${i}`}
                                          style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            borderRadius: 4,
                                          }}
                                          onClick={() =>
                                            handlePreview(
                                              imgPath.replace(/\\/g, "/")
                                            )
                                          }
                                        />
                                      ))}
                                  </div>
                                )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Video / Gambar
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  type="file"
                                  multiple
                                  accept="image/*,video/*"
                                  name={`evidence[${index}][]`}
                                />

                                {item.id_amplifikasi.evidence?.length > 0 && (
                                  <div className="mt-2 d-flex flex-wrap gap-2">
                                    {item.id_amplifikasi.evidence.map(
                                      (filePath, i) => {
                                        const fixedPath = filePath.replace(
                                          /\\/g,
                                          "/"
                                        );
                                        const ext = fixedPath
                                          .split(".")
                                          .pop()
                                          ?.toLowerCase();
                                        const isVideo = [
                                          "mp4",
                                          "webm",
                                          "ogg",
                                          "mov",
                                        ].includes(ext);

                                        return (
                                          <div
                                            key={i}
                                            style={{ position: "relative" }}
                                          >
                                            {isVideo ? (
                                              <video
                                                controls
                                                src={fixedPath}
                                                style={{
                                                  width: 150,
                                                  height: 100,
                                                  objectFit: "cover",
                                                  borderRadius: 4,
                                                }}
                                              />
                                            ) : (
                                              <img
                                                src={fixedPath}
                                                alt={`evidence-${i}`}
                                                style={{
                                                  width: 100,
                                                  height: 100,
                                                  objectFit: "cover",
                                                  cursor: "pointer",
                                                  borderRadius: 4,
                                                }}
                                                onClick={() =>
                                                  handlePreview(fixedPath)
                                                }
                                              />
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Caption
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name={`caption[${index}]`}
                                  defaultValue={
                                    item.id_amplifikasi.caption || ""
                                  }
                                />
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label className="col-sm-4 col-form-label">
                                Type
                              </Form.Label>
                              <Col md={8}>
                                <Form.Control
                                  as={FormSelect}
                                  name={`type[${index}]`}
                                  placeholder="Select Type"
                                  options={typeDatas}
                                  defaultselected={item.id_amplifikasi.type}
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
      {/* Modal Preview */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
        <Modal.Body className="p-0">
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DeatailAmplifikasi;
