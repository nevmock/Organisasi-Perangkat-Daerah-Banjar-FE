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
import Pagination from 'sub-components/Pagination';

const HowPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); // Data setelah search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSearch = () => {
    const filtered = programs.filter((item) =>
      item.nama_program.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman 1 saat search
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`/how`);
        setPrograms(res.data);
        setFilteredData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Gagal fetch data how:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
              <Card.Header className="border-bottom-0 p-3 bg-white">
                <Form
                  className="d-flex align-items-center gap-2 "
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Cari program..."
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
                        {currentItems.map((program, index) => (
                          <tr key={program._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
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
                    {filteredData.length > itemsPerPage && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
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

export default HowPage;
