// import node module libraries
import Link from 'next/link';
import { Col, Row, Card, Table, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import request from 'utils/request';
import Pagination from 'sub-components/Pagination';

const ActiveProjectsByOpd = ({ id }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const searchParams = useSearchParams();
  const opdName = searchParams.get('opdName') || 'OPD';

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    const fetchDataMonitoring = async () => {
      try {
        const res = await request.get(
          `/how/admin/${id}?page=${page}&limit=${limit}`
        );
        const dataArray = Array.isArray(res.data.data) ? res.data.data : [];
        setData(dataArray);
        setPaginationData({
          total: res.data.total,
          page: res.data.page,
          limit: res.data.limit,
          totalPages: res.data.totalPages,
        });
      } catch (err) {
        console.error('Gagal fetch data sumary:', err);
        console.log('Detail error:', err.response?.data || err.message);
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
            <Link href="/monitoring" passHref>
              <Button variant="outline-secondary">← Kembali</Button>
            </Link>
          </Card.Header>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
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
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    {(paginationData.page - 1) * paginationData.limit +
                      index +
                      1}
                  </td>
                  <td>{item.nama_program}</td>
                  <td style={{ minWidth: '200px' }}>{item.tujuan_program}</td>
                  <td style={{ minWidth: '200px' }}>{item.sasaran_program}</td>
                  <td>{item.rencana_lokasi?.kelurahan}</td>
                  <td>{item.rencana_lokasi?.kecamatan}</td>
                  <td>{item.rencana_lokasi?.kota}</td>
                  <td>{item.opd_pengusul_utama}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      href={`/monitoring/${id}/${item._id}`}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {paginationData.totalPages > 1 && (
            <Card.Footer className="bg-white text-center">
              <Pagination
                currentPage={paginationData.page}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
              />
            </Card.Footer>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ActiveProjectsByOpd;
