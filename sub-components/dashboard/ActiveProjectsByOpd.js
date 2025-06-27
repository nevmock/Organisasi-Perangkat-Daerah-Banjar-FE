'use client';
import Link from 'next/link';
import { Col, Row, Card, Table, Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import request from 'utils/request';
import Pagination from 'sub-components/Pagination';

const ActiveProjectsByOpd = ({ id, opdName }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    const fetchDataMonitoring = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await request.get(
          `/how/admin/${id}?page=${page}&limit=${limit}`
        );

        if (!res.data) {
          throw new Error('No data received');
        }

        const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
        setData(dataArray);
        setPaginationData({
          total: res.data.total,
          page: res.data.page,
          limit: res.data.limit,
          totalPages: res.data.totalPages,
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(
          err.response?.data?.message || err.message || 'Failed to load data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDataMonitoring();
  }, [page, limit, id]);

  return (
    <Row className="mt-6">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Program Aktif OPD {opdName}</h4>
            <Link href="/monitoring" passHref legacyBehavior>
              <Button variant="outline-secondary" as="a">
                Kembali
              </Button>
            </Link>
          </Card.Header>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
              <Button
                variant="outline-primary"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-5">
              <p>Tidak ada data program aktif</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table className="text-nowrap mb-0">
                  <thead className="table-light">
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
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>
                          {(paginationData.page - 1) * paginationData.limit +
                            index +
                            1}
                        </td>
                        <td>{item.nama_program || '-'}</td>
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
                          {item.tujuan_program.length > 100
                            ? `${item.tujuan_program.substring(0, 100)}...`
                            : item.tujuan_program}
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
                          {item.sasaran_program.length > 100
                            ? `${item.sasaran_program.substring(0, 100)}...`
                            : item.sasaran_program}
                        </td>
                        <td>{item.rencana_lokasi?.kelurahan || '-'}</td>
                        <td>{item.rencana_lokasi?.kecamatan || '-'}</td>
                        <td>{item.rencana_lokasi?.kota || '-'}</td>
                        <td>{item.opd_pengusul_utama || '-'}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/monitoring/${id}/${item._id}`}
                            as={Link}
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {paginationData.totalPages > 1 && (
                <Card.Footer className="bg-white text-center">
                  <Pagination
                    currentPage={paginationData.page}
                    totalPages={paginationData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </Card.Footer>
              )}
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ActiveProjectsByOpd;
