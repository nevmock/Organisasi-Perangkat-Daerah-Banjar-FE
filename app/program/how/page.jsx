'use client';

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

import { HighlightCode } from 'widgets';

import { ResponsiveTableCode } from 'data/code/TablesCode';

import { useEffect, useState } from 'react';

import { fetchHows } from 'app/api/get-all-how';
import request from 'utils/request';

const HowPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const res = await request.get(`/how/search?q=${searchQuery}`);
      setPrograms(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Gagal fetch data pencarian:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`/how`);
        setPrograms(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Gagal fetch data how:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //   useEffect(() => {
  //     const getPrograms = async () => {
  //       const data = await fetchHows();
  //       setPrograms(data);
  //       setLoading(false);
  //     };

  //     getPrograms();
  //   }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Daftar How</h1>
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
                      style={{ minWidth: '200px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="secondary" type="submit">
                      Cari
                    </Button>
                    <Button variant="primary" href="/program/how/tambah">
                      Tambah
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
                          <th>#</th>
                          <th>Nama Program</th>
                          <th>Tujuan</th>
                          <th>Sasaran</th>
                          <th>Kelurahan</th>
                          <th>Kecamatan</th>
                          <th>Kota</th>
                          <th>OPD</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programs.map((program, index) => (
                          <tr key={program._id}>
                            <td>{index + 1}</td>
                            <td>{program.nama_program}</td>
                            <td>
                              <div
                                className="text-wrap"
                                style={{ minWidth: '300px' }}
                              >
                                {program.tujuan_program}
                              </div>
                            </td>
                            <td>
                              <div
                                className="text-wrap"
                                style={{ minWidth: '300px' }}
                              >
                                {program.sasaran_program}
                              </div>
                            </td>
                            <td>{program.rencana_lokasi.kelurahan}</td>
                            <td>{program.rencana_lokasi.kecamatan}</td>
                            <td>{program.rencana_lokasi.kota}</td>
                            <td>{program.opd_pengusul_utama}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                href={`/program/how/${program._id}`}
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

export default HowPage;
