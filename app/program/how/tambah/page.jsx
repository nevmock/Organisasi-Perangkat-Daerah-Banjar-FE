'use client';
import { fetchHows } from 'app/api/get-all-how';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
} from 'react-bootstrap';
import request from 'utils/request';
import { PageHeading } from 'widgets';

const sumberDanaOptions = [
  { value: 'APBD Murni', label: 'APBD Murni' },
  { value: 'CSR Swasta', label: 'CSR Swasta' },
  { value: 'Lainnya', label: 'Lainnya' },
];

const InputProgram = ({ id }) => {
  const hasMounted = useMounted();
  const [form, setForm] = useState({
    nama_program: '',
    tujuan_program: '',
    sasaran_program: '',
    rencana_output: {
      kuantitatif: [''],
      kualitatif: [''],
    },
    target_indikator_kinerja: {
      jumlah_peserta: null,
      jumlah_pelatihan: null,
      tingkat_kepuasan: '',
    },
    rencana_lokasi: {
      kelurahan: '',
      kecamatan: '',
      kota: '',
    },
    opd_pengusul_utama: '',
    opd_kolaborator: [''],
  });

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk nested object
  const handleNestedChange = (parent, name, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  // Handler untuk array dalam nested object
  const handleArrayChange = (parent, name, idx, val) => {
    setForm((prev) => {
      const arr = [...prev[parent][name]];
      arr[idx] = val;
      return {
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: arr,
        },
      };
    });
  };

  const addArrayItem = (parent, name) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: [...prev[parent][name], ''],
      },
    }));
  };

  const removeArrayItem = (parent, name, idx) => {
    setForm((prev) => {
      const arr = [...prev[parent][name]];
      arr.splice(idx, 1);
      return {
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: arr,
        },
      };
    });
  };

  // Handler untuk opd_kolaborator (array di root)
  const handleKolaboratorChange = (idx, val) => {
    setForm((prev) => {
      const arr = [...prev.opd_kolaborator];
      arr[idx] = val;
      return { ...prev, opd_kolaborator: arr };
    });
  };
  const addKolaborator = () => {
    setForm((prev) => ({
      ...prev,
      opd_kolaborator: [...prev.opd_kolaborator, ''],
    }));
  };
  const removeKolaborator = (idx) => {
    setForm((prev) => {
      const arr = [...prev.opd_kolaborator];
      arr.splice(idx, 1);
      return { ...prev, opd_kolaborator: arr };
    });
  };

  // Handler untuk target_indikator_kinerja (number)
  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      target_indikator_kinerja: {
        ...prev.target_indikator_kinerja,
        [name]:
          name === 'jumlah_peserta' || name === 'jumlah_pelatihan'
            ? value === ''
              ? null
              : Number(value)
            : value,
      },
    }));
  };

  // Handler submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await request.post(`/how`, form);
      alert('Data berhasil disimpan!');
      window.location.href = '/produk/how';
    } catch (err) {
      alert('Gagal menyimpan data.');
    }
  };

  console.log(form);

  return (
    <Container fluid className="p-6">
      <PageHeading heading="Program" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              <h3 className="mb-4">Input Program Baru</h3>
              {hasMounted && (
                <Form onSubmit={handleSubmit}>
                  {/* Nama, Tujuan, Sasaran */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Nama Program
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        name="nama_program"
                        value={form.nama_program}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Tujuan Program
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        as="textarea"
                        name="tujuan_program"
                        value={form.tujuan_program}
                        onChange={handleChange}
                        required
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
                        name="sasaran_program"
                        value={form.sasaran_program}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  {/* Rencana Output Kuantitatif */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Rencana Output Kuantitatif
                    </Form.Label>
                    <Col md={9}>
                      {form.rencana_output.kuantitatif.map((val, idx) => (
                        <Row className="mb-2" key={idx}>
                          <Col xs={8} md={10}>
                            <Form.Control
                              value={val}
                              onChange={(e) =>
                                handleArrayChange(
                                  'rencana_output',
                                  'kuantitatif',
                                  idx,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Col>
                          <Col xs={4} md={2} className="d-flex gap-2">
                            <Button
                              variant="outline-danger"
                              onClick={() =>
                                removeArrayItem(
                                  'rencana_output',
                                  'kuantitatif',
                                  idx
                                )
                              }
                              disabled={
                                form.rencana_output.kuantitatif.length === 1
                              }
                            >
                              -
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                addArrayItem('rencana_output', 'kuantitatif')
                              }
                              disabled={
                                idx !==
                                form.rencana_output.kuantitatif.length - 1
                              }
                            >
                              +
                            </Button>
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
                      {form.rencana_output.kualitatif.map((val, idx) => (
                        <Row className="mb-2" key={idx}>
                          <Col xs={8} md={10}>
                            <Form.Control
                              value={val}
                              onChange={(e) =>
                                handleArrayChange(
                                  'rencana_output',
                                  'kualitatif',
                                  idx,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Col>
                          <Col xs={4} md={2} className="d-flex gap-2">
                            <Button
                              variant="outline-danger"
                              onClick={() =>
                                removeArrayItem(
                                  'rencana_output',
                                  'kualitatif',
                                  idx
                                )
                              }
                              disabled={
                                form.rencana_output.kualitatif.length === 1
                              }
                            >
                              -
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                addArrayItem('rencana_output', 'kualitatif')
                              }
                              disabled={
                                idx !==
                                form.rencana_output.kualitatif.length - 1
                              }
                            >
                              +
                            </Button>
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
                          <Form.Control
                            type="number"
                            name="jumlah_peserta"
                            placeholder="Jumlah Peserta"
                            value={form.target_indikator_kinerja.jumlah_peserta}
                            onChange={handleTargetChange}
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            type="number"
                            name="jumlah_pelatihan"
                            placeholder="Jumlah Sesi Pelatihan"
                            value={
                              form.target_indikator_kinerja.jumlah_pelatihan
                            }
                            onChange={handleTargetChange}
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col md={6}>
                          <Form.Control
                            name="tingkat_kepuasan"
                            placeholder="Tingkat Kepuasan Minimum (%)"
                            value={
                              form.target_indikator_kinerja.tingkat_kepuasan
                            }
                            onChange={handleTargetChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* Rencana Lokasi */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Rencana Lokasi
                    </Form.Label>
                    <Col md={9}>
                      <Row className="mb-2">
                        <Col md={4}>
                          <Form.Control
                            name="kelurahan"
                            placeholder="Kelurahan"
                            value={form.rencana_lokasi.kelurahan}
                            onChange={(e) =>
                              handleNestedChange(
                                'rencana_lokasi',
                                'kelurahan',
                                e.target.value
                              )
                            }
                            required
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            name="kecamatan"
                            placeholder="Kecamatan"
                            value={form.rencana_lokasi.kecamatan}
                            onChange={(e) =>
                              handleNestedChange(
                                'rencana_lokasi',
                                'kecamatan',
                                e.target.value
                              )
                            }
                            required
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            name="kota"
                            placeholder="Kota"
                            value={form.rencana_lokasi.kota}
                            onChange={(e) =>
                              handleNestedChange(
                                'rencana_lokasi',
                                'kota',
                                e.target.value
                              )
                            }
                            required
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* OPD Pengusul Utama */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      OPD Pengusul Utama
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        name="opd_pengusul_utama"
                        value={form.opd_pengusul_utama}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  {/* OPD Kolaborator */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      OPD Kolaborator
                    </Form.Label>
                    <Col md={9}>
                      {form.opd_kolaborator.map((val, idx) => (
                        <Row className="mb-2" key={idx}>
                          <Col xs={8} md={10}>
                            <Form.Control
                              value={val}
                              onChange={(e) =>
                                handleKolaboratorChange(idx, e.target.value)
                              }
                              required
                            />
                          </Col>
                          <Col xs={4} md={2} className="d-flex gap-2">
                            <Button
                              variant="outline-danger"
                              onClick={() => removeKolaborator(idx)}
                              disabled={form.opd_kolaborator.length === 1}
                            >
                              -
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={addKolaborator}
                              disabled={idx !== form.opd_kolaborator.length - 1}
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col className="text-end">
                      <Button type="submit" variant="primary">
                        Simpan Program
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InputProgram;
