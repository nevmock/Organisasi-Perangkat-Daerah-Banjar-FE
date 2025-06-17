'use client';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import { getISOWeek } from 'utils/getISOWeek';
import { PageHeading } from 'widgets';
import useMounted from 'hooks/useMounted';
import request from 'utils/request';

const DetailLaporan = ({ id }) => {
  const hasMounted = useMounted();
  const [dataProgram, setDataProgram] = useState({});
  const [openIndexes, setOpenIndexes] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const baseURL = 'http://localhost:5050/';

  const fetchData = useCallback(async () => {
    try {
      const res = await request.get(`/perencanaan/getById/${id}`);
      setDataProgram(res.data);
    } catch (err) {
      console.error('Gagal fetch data perencanaan:', err);
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

  const handleSubmit = async (e, index, indikatorId) => {
    e.preventDefault();
    const form = e.target;

    const sudahSelesai = form[`finish[${index}]`]?.checked;
    const kendala = form[`kendala[${index}]`]?.value;
    const tindakan = form[`tindakan[${index}]`]?.value;

    // Ambil input file langsung via querySelector
    const evidenceInput = form.querySelector(`[name="evidence[${index}][]"]`);
    const evidenceFiles = evidenceInput?.files;
    console.log(evidenceFiles);

    const payload = {
      sudah_selesai: !!sudahSelesai,
      kendala,
      kesimpulan_tindakan: tindakan,
    };

    try {
      await request.put(`/indikator/${indikatorId}`, payload);
    } catch (err) {
      console.error('Gagal update indikator:', err);
      alert('Gagal update indikator.');
      return;
    }

    if (evidenceFiles && evidenceFiles.length > 0) {
      try {
        await request.postMultipart(
          `/indikator/${indikatorId}/upload-evidence`,
          {
            id_perencanaan: dataProgram._id,
            evidence: Array.from(evidenceFiles),
          }
        );
      } catch (err) {
        console.error('Gagal upload evidence:', err?.response?.data || err);
        alert('Gagal upload evidence.');
        return;
      }
    }

    alert('Laporan berhasil disimpan!');
    fetchData();
  };

  const handleDeleteEvidence = async (indikatorId, urlEvidence) => {
    try {
      await request.delete(`/indikator/${indikatorId}/remove-evidence`, {
        url: urlEvidence,
      });
      alert('Evidence berhasil dihapus!');
      fetchData(); // Refresh data setelah hapus
    } catch (error) {
      console.error(
        'Gagal menghapus evidence:',
        error?.response?.data || error
      );
      alert('Gagal menghapus evidence.');
    }
  };

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Laporan Program OPD" />

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
                        value={dataProgram?.nama_program || ''}
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
                        value={dataProgram?.opd_pelaksana || ''}
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
                        value={getISOWeek(dataProgram?.tgl_mulai || '')}
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
                        value={dataProgram?.target || ''}
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
              <h4 className="mb-3">Laporan Indikator</h4>

              {hasMounted &&
                (dataProgram?.id_indikator || []).map((item, index) => {
                  const isOpen = openIndexes.includes(index);
                  return (
                    <Form
                      key={index}
                      onSubmit={(e) => handleSubmit(e, index, item._id)}
                    >
                      <div className="mb-4 border rounded p-3">
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleDropdown(index)}
                        >
                          <h5 className="mb-0">
                            {index + 1}. {item.indikator_label}
                          </h5>
                          <span>{isOpen ? '▲ Tutup' : '▼ Lihat'}</span>
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

                                {item.evidence?.length > 0 && (
                                  <div className="mt-2 d-flex flex-wrap gap-2">
                                    {item.evidence.map((imgPath, i) => {
                                      const fixedUrl = imgPath.replace(
                                        /\\/g,
                                        '/'
                                      );

                                      return (
                                        <div
                                          key={i}
                                          style={{
                                            position: 'relative',
                                            display: 'inline-block',
                                          }}
                                        >
                                          <img
                                            src={fixedUrl}
                                            alt={`evidence-${i}`}
                                            style={{
                                              width: 80,
                                              height: 80,
                                              objectFit: 'cover',
                                              cursor: 'pointer',
                                              borderRadius: 4,
                                            }}
                                            onClick={() =>
                                              handlePreview(fixedUrl)
                                            }
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteEvidence(
                                                item._id,
                                                fixedUrl
                                              )
                                            }
                                            style={{
                                              position: 'absolute',
                                              top: 2,
                                              right: 2,
                                              backgroundColor:
                                                'rgba(255,0,0,0.7)',
                                              border: 'none',
                                              borderRadius: '50%',
                                              width: 20,
                                              height: 20,
                                              color: 'white',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                            }}
                                            title="Hapus gambar"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
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
                                  defaultValue={item.kendala || ''}
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
                                  defaultValue={item.kesimpulan_tindakan || ''}
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
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DetailLaporan;
