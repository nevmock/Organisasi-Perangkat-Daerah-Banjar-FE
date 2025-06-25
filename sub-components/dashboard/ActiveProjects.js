// import node module libraries
import Link from 'next/link';
import {
  ProgressBar,
  Col,
  Row,
  Card,
  Table,
  Image,
  Button,
} from 'react-bootstrap';

// import required data files
import { useEffect, useState } from 'react';
import request from 'utils/request';
import Pagination from 'sub-components/Pagination';

const ActiveProjects = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  function getUsernameFromEmail(email) {
    return email.split('@')[0]; // ambil bagian sebelum '@'
  }

  useEffect(() => {
    const fetchDataMonitoring = async () => {
      try {
        const res = await request.get(
          `/users/getUsersWithCount?page=${page}&limit=${limit}`
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
  }, [page, limit]); // Add page and limit to dependency array

  return (
    <Row className="mt-6">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="bg-white  py-4">
            <h4 className="mb-0">List Progress OPD </h4>
          </Card.Header>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Nama OPD</th>
                <th>Jumlah How</th>
                <th>Jumlah Do</th>
                <th>Jumlah Date</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <div className="">
                          <h5 className=" mb-1">
                            <Link href="#" className="text-inherit">
                              {getUsernameFromEmail(item.email)}
                            </Link>
                          </h5>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">{item.howCount}</td>
                    <td className="align-middle">{item.doCount}</td>
                    <td className="align-middle">{item.dateCount}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        style={{
                          '--bs-btn-hover-color': 'white',
                        }}
                        href={`/monitoring/${
                          item._id
                        }?opdName=${getUsernameFromEmail(item.email)}`}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })}
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

export default ActiveProjects;
