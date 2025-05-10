'use client';
// import node module libraries
import { Fragment } from 'react';
import {
  Col,
  Row,
  Card,
  Table,
  Nav,
  Tab,
  Container,
  Form,
  Button,
} from 'react-bootstrap';

// import widget/custom components
import { HighlightCode } from 'widgets';

// import react code data file
import { ResponsiveTableCode } from 'data/code/TablesCode';

import { useEffect, useState } from 'react';
import axios from 'axios';
// import { programOpd } from "data/opd/ProgramOpd";
import { formatWeekLabel } from 'utils/formatWeekLabel';
import getElapsedTime from 'utils/getElapsedTime';
import getWeekFromDate from 'utils/getWeekFromDate';

const Amplifikasi = () => {
  const [programOpd, setProgramOpd] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/perencanaan`
        );
        setProgramOpd(res.data);
      } catch (err) {
        console.error('Gagal fetch data perencanaan:', err);
      }
    };

    fetchData();
  }, []);
  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {};
      programOpd.forEach((p) => {
        newTimes[p._id] = getElapsedTime(p.tgl_mulai);
      });
      setWaktuPelaksanaan(newTimes);
    }, 60000); // update tiap 1 menit

    // initial update
    const initTimes = {};
    programOpd.forEach((p) => {
      initTimes[p._id] = getElapsedTime(p.tgl_mulai);
    });
    setWaktuPelaksanaan(initTimes);

    return () => clearInterval(interval);
  }, [programOpd]);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      'Apakah Anda yakin ingin menghapus data ini?'
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/perencanaan/${id}`
      );
      // Hapus data dari state setelah berhasil
      setProgramOpd((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Gagal menghapus data:', err);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Amplifikasi Program OPD</h1>
              <p className="mb-0 ">
                Amplifikasi program OPD (Organisasi Perangkat Daerah) merujuk
                pada proses memperkuat dan memperluas pelaksanaan program yang
                telah ditetapkan oleh OPD.
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* responsive-tables */}
      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container id="tab-container-11" defaultActiveKey="design">
            <Card>
              <Card.Header className="border-bottom-0 p-0">
                <div className="d-flex justify-content-between align-items-center flex-wrap p-3">
                  {/* Search + Add Button */}
                  <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                    <Form.Control
                      type="text"
                      placeholder="Cari program..."
                      className="me-2"
                      style={{ minWidth: '200px' }}
                    />
                    <Button variant="primary" href="/opd/perencanaan/tambah">
                      Tambah
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="design" className="pb-4 p-4">
                    {/* code started */}
                    <Table responsive className="text-nowrap">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nama Program</th>
                          <th scope="col">Pelaksana</th>
                          <th scope="col">Jumlah Indikator</th>
                          <th scope="col">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programOpd.map((program, index) => (
                          <tr key={program._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{program.nama_program}</td>
                            <td>{program.opd_pelaksana}</td>
                            <td>{program.indikators.length} Indikator</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  href={`/opd/amplifikasi/${program._id}`}
                                >
                                  Detail
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() => handleDelete(program._id)}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* end of code */}
                  </Tab.Pane>
                  <Tab.Pane eventKey="react" className="pb-4 p-4 react-code">
                    <HighlightCode code={ResponsiveTableCode} />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
      {/* end of responsive-tables */}
    </Container>
  );
};

export default Amplifikasi;
