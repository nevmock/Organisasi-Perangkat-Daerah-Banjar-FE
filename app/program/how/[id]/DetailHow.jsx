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
import { PageHeading } from 'widgets';

const sumberDanaOptions = [
  { value: 'APBD Murni', label: 'APBD Murni' },
  { value: 'CSR Swasta', label: 'CSR Swasta' },
  { value: 'Lainnya', label: 'Lainnya' },
];

const InputProgram = ({ id }) => {
  const hasMounted = useMounted();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const getPrograms = async () => {
      const data = await fetchHows();

      const filtered = data
        .filter((item) => item.id === id)
        .map((item) => {
          const indikator = item.target_indikator_kinerja || {};
          return {
            nama_program: item.nama_program || '',
            tujuan_program: item.tujuan_program || '',
            sasaran_program: item.sasaran_program || '',
            rencana_output_kuantitatif: item?.rencana_output?.kuantitatif || [
              '',
            ],
            rencana_output_kualitatif: item?.rencana_output?.kualitatif || [''],
            jumlah_peserta: indikator.jumlah_peserta || '',
            jumlah_pelatihan: indikator.jumlah_pelatihan || '',
            tingkat_kepuasan: indikator.tingkat_kepuasan || '',
            lokasi_kelurahan: item?.rencana_lokasi?.kelurahan || '',
            lokasi_kecamatan: item?.rencana_lokasi?.kecamatan || '',
            lokasi_kota: item?.rencana_lokasi?.kota || '',
            anggaran_jumlah: item?.rencana_anggaran?.jumlah || '',
            anggaran_sumber_dana: item?.rencana_anggaran?.sumber_dana || [
              { jenis: '', persentase: '' },
            ],
            opd_pengusul_utama: item.opd_pengusul_utama || '',
            opd_kolaborator: item.opd_kolaborator || [''],
          };
        });

      if (filtered.length > 0) {
        setForm(filtered[0]);
      }

      setLoading(false);
    };

    getPrograms();
  }, [id]);

  console.log(form);

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk array (output, kolaborator, sumber dana)
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

  // Handler tambah/hapus item array
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

  const addSumberDana = () => {
    setForm((prev) => ({
      ...prev,
      anggaran_sumber_dana: [
        ...prev.anggaran_sumber_dana,
        { jenis: '', persentase: '' },
      ],
    }));
  };
  const removeSumberDana = (idx) => {
    setForm((prev) => {
      const arr = [...prev.anggaran_sumber_dana];
      arr.splice(idx, 1);
      return { ...prev, anggaran_sumber_dana: arr };
    });
  };

  // Handler submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Kirim data ke backend
    alert('Data program berhasil disimpan!\n' + JSON.stringify(form, null, 2));
  };

  if (loading) return <p>Loading...</p>;

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
                      {/* {form.opd_kolaborator.map((val, idx) => (
                        <InputGroup className="mb-2" key={idx}>
                          <Form.Control
                            value={val}
                            onChange={(e) =>
                              handleArrayChange(
                                "opd_kolaborator",
                                idx,
                                e.target.value
                              )
                            }
                            required
                          />
                          <Button
                            variant="outline-danger"
                            onClick={() =>
                              removeArrayItem("opd_kolaborator", idx)
                            }
                            disabled={form.opd_kolaborator.length === 1}
                          >
                            -
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => addArrayItem("opd_kolaborator")}
                            disabled={idx !== form.opd_kolaborator.length - 1}
                          >
                            +
                          </Button>
                        </InputGroup>
                      ))} */}
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
