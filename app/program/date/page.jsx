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
  Badge,
} from 'react-bootstrap';

import { HighlightCode } from 'widgets';

import { ResponsiveTableCode } from 'data/code/TablesCode';

import { useEffect, useState } from 'react';

import request from 'utils/request';

const DatePage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const res = await request.get(`/date/search?q=${searchQuery}`);
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
        const res = await request.get(`/date`);
        setPrograms(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Gagal fetch data how:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Daftar DATE</h1>
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
                    <Button variant="primary" href="/program/date/tambah">
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
                          <th>Tanggal Mulai</th>
                          <th>Tanggal Selesai</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programs.map((program, index) => (
                          <tr key={program._id}>
                            <td>{index + 1}</td>
                            <td>{program.nama_program}</td>
                            <td>{program.tanggal_mulai?.slice(0, 10) || ''}</td>
                            <td>
                              {program.tanggal_selesai?.slice(0, 10) || ''}
                            </td>
                            <td>
                              {program.status_laporan == 'sudah diperiksa' ? (
                                <Badge pill bg="primary" className="me-1">
                                  SUDAH DIPERIKSA
                                </Badge>
                              ) : program.status_laporan == 'final' ? (
                                <Badge pill bg="info" className="me-1">
                                  FINAL
                                </Badge>
                              ) : (
                                <Badge pill bg="secondary" className="me-1">
                                  DRAFT
                                </Badge>
                              )}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                href={`/program/date/${program._id}`}
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

export default DatePage;
