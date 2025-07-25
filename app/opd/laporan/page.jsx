"use client";
// import node module libraries
import { Fragment } from "react";
import {
  Col,
  Row,
  Card,
  Table,
  Tab,
  Container,
  Form,
  Button,
} from "react-bootstrap";

// import widget/custom components
import { HighlightCode } from "widgets";

// import react code data file
import { ResponsiveTableCode } from "data/code/TablesCode";

import { useEffect, useState } from "react";
import getElapsedTimeFromWeek from "utils/getElapsedTime";
import getWeekFromDate from "utils/getWeekFromDate";
import request from "utils/request";

const Laporan = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [laporans, setLaporans] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await request.get(`/perencanaan/search?q=${searchQuery}`);
      setLaporans(res.data);
    } catch (err) {
      console.error("Gagal fetch data pencarian:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`/perencanaan`);
        setLaporans(res.data);
      } catch (err) {
        console.error("Gagal fetch data perencanaan:", err);
      }
    };

    fetchData();
  }, []);

  const [waktuPelaksanaan, setWaktuPelaksanaan] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {};
      laporans.forEach((p) => {
        newTimes[p._id] = getElapsedTime(p.tgl_mulai);
      });
      setWaktuPelaksanaan(newTimes);
    }, 60000); // update tiap 1 menit

    // initial update
    const initTimes = {};
    laporans.forEach((p) => {
      initTimes[p._id] = getElapsedTimeFromWeek(p.tgl_mulai);
    });
    setWaktuPelaksanaan(initTimes);

    return () => clearInterval(interval);
  }, [laporans]);

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Laporan Program OPD</h1>
              <p className="mb-0 ">
                Laporan OPD (Organisasi Perangkat Daerah) adalah laporan yang
                menyajikan informasi mengenai kinerja dan kegiatan OPD, termasuk
                laporan keuangan dan laporan realisasi anggaran.
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
                  <Form
                    className="d-flex align-items-center gap-2 mt-2 mt-md-0"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Cari program..."
                      className="me-2"
                      style={{ minWidth: "200px" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="secondary" type="submit">
                      Cari
                    </Button>
                  </Form>
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
                          <th scope="col">Tgl Pelaksanaan</th>
                          <th scope="col">Waktu Penyelesaian</th>
                          <th scope="col">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporans.map((program, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{program.nama_program}</td>
                            <td>{program.opd_pelaksana}</td>
                            <td>{getWeekFromDate(program.tgl_mulai)}</td>
                            <td>
                              {waktuPelaksanaan[program._id] || "Memuat..."}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                href={`/opd/laporan/${program._id}`}
                              >
                                Detail
                              </Button>
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

export default Laporan;
