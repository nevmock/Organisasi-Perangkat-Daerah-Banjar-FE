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
  InputGroup,
  Badge,
} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { HighlightCode } from 'widgets';
import { ResponsiveTableCode } from 'data/code/TablesCode';
import request from 'utils/request';
import Pagination from 'sub-components/Pagination';

const DatePage = () => {
  const [programs, setPrograms] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      setPage(1);
      const res = await request.get(
        `/date/search?q=${searchQuery}&page=${page}&limit=${limit}`
      );

      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];

      setPrograms(dataArray);
      setPaginationData({
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit,
        totalPages: res.data.totalPages,
      });
      setLoading(false);
    } catch (err) {
      console.error('Gagal melakukan pencarian:', err);
      setLoading(false);
    }
  };

  const fetchData = async (pageNumber = page, limitNumber = limit) => {
    try {
      setLoading(true);
      const res = await request.get(
        `/date/populated?page=${pageNumber}&limit=${limitNumber}`
      );

      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];

      setPrograms(dataArray);
      setPaginationData({
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit,
        totalPages: res.data.totalPages,
      });
      setLoading(false);
    } catch (err) {
      console.error('Gagal fetch data date:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Gunakan debounce untuk menghindari terlalu banyak request
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        handleSearch();
      } else {
        fetchData();
      }
    }, 500); // Delay 500ms setelah user berhenti mengetik

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // if (loading) return <p>Loading...</p>;

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Daftar Date</h1>
            </div>
          </div>
        </Col>
      </Row>

      {/* responsive-tables */}
      <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
          <Tab.Container id="tab-container-11" defaultActiveKey="design">
            <Card>
              <Card.Header className="border-bottom-0 p-3 bg-white">
                <Form className="d-flex align-items-center gap-2">
                  <InputGroup style={{ maxWidth: '300px' }}>
                    <InputGroup.Text>
                      <i className="nav-icon fe fe-search me-2"></i>
                    </InputGroup.Text>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Cari program..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  <Button
                    size="sm"
                    variant="primary"
                    href="/program/date/tambah"
                  >
                    Tambah
                  </Button>
                </Form>
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
                          <tr key={program._id || index}>
                            <td>
                              {(paginationData.page - 1) *
                                paginationData.limit +
                                index +
                                1}
                            </td>
                            <td>{program.nama_program.nama_program}</td>
                            <td>{program.tanggal_mulai?.slice(0, 10) || ''}</td>
                            <td>
                              {program.tanggal_selesai?.slice(0, 10) || ''}
                            </td>
                            <td>
                              {program.status_laporan == 'revisi' ? (
                                <Badge pill bg="primary" className="me-1">
                                  REVISI
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
                    {paginationData.totalPages > 1 && (
                      <Pagination
                        currentPage={paginationData.page}
                        totalPages={paginationData.totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
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
