'use client';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import request from 'utils/request';
import { PageHeading } from 'widgets';

const InputProgram = ({ id }) => {
  const hasMounted = useMounted();
  const [form, setForm] = useState({
    nama_program: '',
    tujuan_program: '',
    sasaran_program: '',
    rencana_output_kuantitatif: [''],
    rencana_output_kualitatif: [''],
    jumlah_peserta: '',
    jumlah_pelatihan: '',
    tingkat_kepuasan: '',
    lokasi_kelurahan: '',
    lokasi_kecamatan: '',
    lokasi_kota: '',
    anggaran_jumlah: '',
    anggaran_sumber_dana: [{ jenis: '', persentase: '' }],
    opd_pengusul_utama: '',
    opd_kolaborator: [''],
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, idx, val) => {
    setForm((prev) => {
      const arr = [...prev[name]];
      arr[idx] = val;
      return { ...prev, [name]: arr };
    });
  };

  const handleSumberDanaChange = (idx, field, val) => {
    setForm((prev) => {
      const arr = [...prev.anggaran_sumber_dana];
      arr[idx][field] = val;
      return { ...prev, anggaran_sumber_dana: arr };
    });
  };

  const addArrayItem = (name) => {
    setForm((prev) => ({
      ...prev,
      [name]: [...prev[name], ''],
    }));
  };
  const removeArrayItem = (name, idx) => {
    setForm((prev) => {
      const arr = [...prev[name]];
      arr.splice(idx, 1);
      return { ...prev, [name]: arr };
    });
  };

  const removeSumberDana = (idx) => {
    setForm((prev) => {
      const arr = [...prev.anggaran_sumber_dana];
      arr.splice(idx, 1);
      return { ...prev, anggaran_sumber_dana: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nama_program: form.nama_program,
      tujuan_program: form.tujuan_program,
      sasaran_program: form.sasaran_program,
      rencana_output: {
        kuantitatif: form.rencana_output_kuantitatif.filter(
          (item) => item.trim() !== ''
        ),
        kualitatif: form.rencana_output_kualitatif.filter(
          (item) => item.trim() !== ''
        ),
      },
      target_indikator_kinerja: {
        jumlah_peserta: parseInt(form.jumlah_peserta) || 0,
        jumlah_pelatihan: parseInt(form.jumlah_pelatihan) || 0,
        tingkat_kepuasan: form.tingkat_kepuasan,
      },
      rencana_lokasi: {
        kelurahan: form.lokasi_kelurahan,
        kecamatan: form.lokasi_kecamatan,
        kota: form.lokasi_kota,
      },
      opd_pengusul_utama: form.opd_pengusul_utama,
      opd_kolaborator: form.opd_kolaborator.filter(
        (item) => item.trim() !== ''
      ),
    };

    try {
      const response = await request.post('/how', payload);
      console.log('Response:', response);
      alert('Program berhasil disimpan!');
      window.location.href = '/program/how';
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Gagal menyimpan program. Silakan coba lagi.');
    }
  };
  return (
    <Container fluid className="p-6">
      <PageHeading heading="Input Data HOW" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>
              {hasMounted && (
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Nama Program
                    </Form.Label>
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
                    <Form.Label column md={3}>
                      Tujuan Program
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="tujuan_program"
                        placeholder="Masukan tujuan program"
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
                        rows={2}
                        name="sasaran_program"
                        placeholder="Masukan sasaran program"
                        value={form.sasaran_program}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  {/* Rencana Output */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Rencana Output Kuantitatif
                    </Form.Label>
                    <Col md={9}>
                      {form.rencana_output_kuantitatif.map((val, idx) => (
                        <Row className="mb-2" key={idx}>
                          <Col xs={8} md={10} className="mb-2 mb-md-0">
                            <Form.Control
                              value={val}
                              placeholder="Masukan rencana output kuantitatif"
                              onChange={(e) =>
                                handleArrayChange(
                                  'rencana_output_kuantitatif',
                                  idx,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Col>

                          <Col
                            xs={4}
                            md={2}
                            className="d-flex gap-2 align-items-start justify-content-start"
                          >
                            <Button
                              variant="outline-danger"
                              onClick={() =>
                                removeArrayItem(
                                  'rencana_output_kuantitatif',
                                  idx
                                )
                              }
                              disabled={
                                form.rencana_output_kuantitatif.length === 1
                              }
                            >
                              -
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                addArrayItem('rencana_output_kuantitatif')
                              }
                              disabled={
                                idx !==
                                form.rencana_output_kuantitatif.length - 1
                              }
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      Rencana Output Kualitatif
                    </Form.Label>
                    <Col md={9}>
                      {form.rencana_output_kualitatif.map((val, idx) => (
                        <Row className="mb-2" key={idx}>
                          <Col xs={8} md={10} className="mb-2 mb-md-0">
                            <Form.Control
                              value={val}
                              placeholder="Masukan rencana output kualitatif"
                              onChange={(e) =>
                                handleArrayChange(
                                  'rencana_output_kualitatif',
                                  idx,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Col>

                          <Col
                            xs={4}
                            md={2}
                            className="d-flex gap-2 align-items-start justify-content-start"
                          >
                            <Button
                              variant="outline-danger"
                              onClick={() =>
                                removeArrayItem(
                                  'rencana_output_kualitatif',
                                  idx
                                )
                              }
                              disabled={
                                form.rencana_output_kualitatif.length === 1
                              }
                            >
                              -
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                addArrayItem('rencana_output_kualitatif')
                              }
                              disabled={
                                idx !==
                                form.rencana_output_kualitatif.length - 1
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
                            value={form.jumlah_peserta}
                            onChange={handleChange}
                            required
                            className="mb-2"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            type="number"
                            name="jumlah_pelatihan"
                            placeholder="Jumlah Sesi Pelatihan"
                            value={form.jumlah_pelatihan}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col md={6}>
                          <Form.Control
                            name="tingkat_kepuasan"
                            placeholder="Tingkat Kepuasan Minimum (%)"
                            value={form.tingkat_kepuasan}
                            onChange={handleChange}
                            required
                            className="mb-2"
                          />
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
                          <Form.Control
                            name="lokasi_kelurahan"
                            placeholder="Kelurahan"
                            value={form.lokasi_kelurahan}
                            onChange={handleChange}
                            required
                            className="mb-2"
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            name="lokasi_kecamatan"
                            placeholder="Kecamatan"
                            value={form.lokasi_kecamatan}
                            onChange={handleChange}
                            required
                            className="mb-2"
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            name="lokasi_kota"
                            placeholder="Kota"
                            value={form.lokasi_kota}
                            onChange={handleChange}
                            required
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* Anggaran */}
                  {/* <Row className="mb-3">
                    <Form.Label column md={3}>
                      Rencana Anggaran
                    </Form.Label>
                    <Col md={9}>
                      <Row className="mb-2">
                        <Col md={6}>
                          <InputGroup>
                            <InputGroup.Text>Rp</InputGroup.Text>
                            <Form.Control
                              type="number"
                              name="anggaran_jumlah"
                              placeholder="Jumlah Anggaran"
                              value={form.anggaran_jumlah}
                              onChange={handleChange}
                              required
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="align-items-start">
                        <Col>
                          {form.anggaran_sumber_dana.map((item, idx) => (
                            <Row className="mb-2" key={idx}>
                              <Col md={6}>
                                <Form.Select
                                  value={item.jenis}
                                  onChange={(e) =>
                                    handleSumberDanaChange(
                                      idx,
                                      'jenis',
                                      e.target.value
                                    )
                                  }
                                  required
                                  className="mb-2"
                                >
                                  <option value="">Pilih Sumber Dana</option>
                                  {sumberDanaOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <Col md={4} className="mb-2">
                                <InputGroup>
                                  <Form.Control
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={item.persentase}
                                    placeholder="Jumlah persentase"
                                    onChange={(e) =>
                                      handleSumberDanaChange(
                                        idx,
                                        'persentase',
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                  <InputGroup.Text>%</InputGroup.Text>
                                </InputGroup>
                              </Col>
                              <Col
                                xs={4}
                                md={2}
                                className="d-flex gap-2 align-items-start justify-content-start"
                              >
                                <Button
                                  variant="outline-danger"
                                  onClick={() => removeSumberDana(idx)}
                                  disabled={
                                    form.anggaran_sumber_dana.length === 1
                                  }
                                >
                                  -
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  onClick={addSumberDana}
                                  disabled={
                                    idx !== form.anggaran_sumber_dana.length - 1
                                  }
                                >
                                  +
                                </Button>
                              </Col>
                            </Row>
                          ))}
                        </Col>
                      </Row>
                    </Col>
                  </Row> */}

                  {/* OPD */}
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      OPD Pengusul Utama
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        name="opd_pengusul_utama"
                        placeholder="Masukan OPD Pengusul Utama"
                        value={form.opd_pengusul_utama}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label column md={3}>
                      OPD Kolaborator
                    </Form.Label>
                    <Col md={9}>
                      {form.opd_kolaborator.map((val, idx) => (
                        <Row className="mb-2" key={idx}>
                          <Col xs={8} md={10} className="mb-2 mb-md-0">
                            <Form.Control
                              placeholder="Masukan OPD Kolaborator"
                              value={val}
                              onChange={(e) =>
                                handleArrayChange(
                                  'opd_kolaborator',
                                  idx,
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Col>

                          <Col
                            xs={4}
                            md={2}
                            className="d-flex gap-2 align-items-start justify-content-start"
                          >
                            <Button
                              variant="outline-danger"
                              onClick={() =>
                                removeArrayItem('opd_kolaborator', idx)
                              }
                              disabled={form.opd_kolaborator.length === 1}
                            >
                              -
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() => addArrayItem('opd_kolaborator')}
                              disabled={idx !== form.opd_kolaborator.length - 1}
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                  <Row className="mt-8">
                    <Col md={12}>
                      <div className="d-flex align-items-center justify-content-end">
                        <div>
                          <Button
                            variant="primary"
                            className="me-2"
                            type="submit"
                          >
                            Simpan
                          </Button>
                          <Button
                            variant="outline-white"
                            type="link"
                            href="/program/how"
                          >
                            Kembali
                          </Button>
                        </div>
                      </div>
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
