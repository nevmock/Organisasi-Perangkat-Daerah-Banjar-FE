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
} from 'react-bootstrap';
import { HighlightCode } from 'widgets';
import { ResponsiveTableCode } from 'data/code/TablesCode';
import { useEffect, useState } from 'react';
import request from 'utils/request';
import Pagination from 'sub-components/Pagination';
import useMounted from 'hooks/useMounted';

const HowPage = () => {
  const hasMounted = useMounted();
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
        `/how/search?q=${searchQuery}&page=${page}&limit=${limit}`
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
        `/how?page=${pageNumber}&limit=${limitNumber}`
      );

      // const dataArray = Array.isArray(res.data) ? res.data : [];
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
      console.error('Gagal fetch data how:', err);
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus program ini?');

    if (!confirmed) return;

    try {
      setLoading(true);
      await request.delete(`/how/${id}`);
      // Fetch ulang data setelah hapus
      if (searchQuery.trim() !== '') {
        await handleSearch();
      } else {
        await fetchData();
      }
    } catch (err) {
      console.error('Gagal menghapus program:', err);
      alert(err.response?.data?.message || 'Gagal menghapus program. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };


  // if (loading) return <p>Loading...</p>;

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
                      disabled={!hasMounted}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-white"
                    disabled={!hasMounted}
                    href="/program/how/tambah"
                  >
                    Tambah
                  </Button>
                </Form>
              </Card.Header>
              <Card.Body className="p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="design" className="pb-4 p-4">
                    <Table responsive className="text-nowrap">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nama Program</th>
                          <th style={{ minWidth: '400px', maxWidth: '400px' }}>
                            Tujuan
                          </th>
                          <th style={{ minWidth: '400px', maxWidth: '400px' }}>
                            Sasaran
                          </th>
                          <th>Kelurahan</th>
                          <th>Kecamatan</th>
                          <th>Kota</th>
                          <th>OPD</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      {hasMounted && (
                        <tbody>
                          {programs.map((program, index) => (
                            <tr key={program._id || index}>
                              <td>
                                {(paginationData.page - 1) *
                                  paginationData.limit +
                                  index +
                                  1}
                              </td>
                              <td>{program.nama_program || '-'}</td>
                              <td
                                className="text-wrap"
                                style={{
                                  minWidth: '400px',
                                  maxWidth: '400px',
                                  whiteSpace: 'normal',
                                  wordBreak: 'break-word',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {program.tujuan_program.length > 100
                                  ? `${program.tujuan_program.substring(
                                    0,
                                    100
                                  )}...`
                                  : program.tujuan_program}
                              </td>
                              <td
                                className="text-wrap"
                                style={{
                                  minWidth: '400px',
                                  maxWidth: '400px',
                                  whiteSpace: 'normal',
                                  wordBreak: 'break-word',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {program.sasaran_program.length > 100
                                  ? `${program.sasaran_program.substring(
                                    0,
                                    100
                                  )}...`
                                  : program.sasaran_program}
                              </td>
                              <td>
                                {program.rencana_lokasi?.kelurahan || '-'}
                              </td>
                              <td>
                                {program.rencana_lokasi?.kecamatan || '-'}
                              </td>
                              <td>{program.rencana_lokasi?.kota || '-'}</td>
                              <td>{program.opd_pengusul_utama || '-'}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    style={{ '--bs-btn-hover-color': 'white' }}
                                    href={`/program/how/${program._id}`}
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
                      )}
                    </Table>
                    {paginationData.totalPages > 1 && (
                      <Pagination
                        currentPage={paginationData.page}
                        totalPages={paginationData.totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
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
    </Container>
  );
};

export default HowPage;
