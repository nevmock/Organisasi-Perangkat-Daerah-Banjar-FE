// import node module libraries
import Link from 'next/link';
import { ProgressBar, Col, Row, Card, Table, Image } from 'react-bootstrap';

// import required data files
import ActiveProjectsData from 'data/dashboard/ActiveProjectsData';
import { programOpd } from 'data/opd/ProgramOpd';

const ActiveProjects = () => {
  return (
    <Row className="mt-6">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="bg-white  py-4">
            <h4 className="mb-0">Program Aktif OPD </h4>
          </Card.Header>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Nama Program</th>
                <th>Pelaksana</th>
                <th>Tanggal Mulai</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {programOpd.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="align-middle">
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
                    <td className="align-middle">{item.nama_pelaksana}</td>
                    <td className="align-middle">{item.tgl_mulai}</td>

                    <td className="align-middle text-dark">
                      <div className="float-start me-3">{item.progress}%</div>
                      <div className="mt-2">
                        <ProgressBar
                          now={item.progress}
                          style={{ height: '5px' }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Card.Footer className="bg-white text-center">
            <Link href="/opd/laporan" className="link-primary">
              View All Projects
            </Link>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default ActiveProjects;
