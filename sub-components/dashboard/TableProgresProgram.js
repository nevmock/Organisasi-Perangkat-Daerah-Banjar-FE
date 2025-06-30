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

const TableProgresProgram = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    page: 1,
    limit: 7,
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
          `/how/progressSummary?page=${page}&limit=${limit}`
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
    <Row className="">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="bg-white  py-4">
            <h4 className="mb-0">Progress Program OPD </h4>
          </Card.Header>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nama Program</th>
                <th>Do</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {(paginationData.page - 1) * paginationData.limit +
                        index +
                        1}
                    </td>
                    <td className="">
                      <div className="d-flex align-items-center">
                        <div className="">
                          <h5 className=" mb-1">
                            <Link href="#" className="text-inherit">
                              {item.nama_program}
                            </Link>
                          </h5>
                        </div>
                      </div>
                    </td>
                    <td className="">{item.jumlah_do}</td>
                    <td className="">
                      <div
                        className="d-flex align-items-center w-100"
                        style={{ maxWidth: '250px' }}
                      >
                        {/* Persentase */}
                        <span className="me-3 fw-bold">{item.progress}%</span>

                        {/* Progress */}
                        <ProgressBar
                          now={item.progress}
                          style={{ flex: 1, height: '0.5rem' }}
                          variant="primary"
                        />
                      </div>
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

export default TableProgresProgram;
