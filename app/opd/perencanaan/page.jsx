'use client';
// import node module libraries
import { Fragment } from 'react';
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

// import widget/custom components
import { HighlightCode } from 'widgets';

// import react code data file
import {
  BasicTableCode,
  DarkTableCode,
  TableHeadCode,
  StripedTableCode,
  TableVariantCode,
  BorderedTableCode,
  BorderlessTableCode,
  HoverableRowsCode,
  SmallTableCode,
  ContextualClassesCode,
  ResponsiveTableCode,
} from 'data/code/TablesCode';

import { useEffect, useState } from 'react';
import axios from 'axios';

const Perencanaan = () => {

  const [perencanaans, setPerencanaans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/perencanaan`);
        setPerencanaans(res.data);
      } catch (err) {
        console.error('Gagal fetch data perencanaan:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <Container fluid className="p-6">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">
                Daftar Perancanaan Program OPD
              </h1>
              <p className="mb-0 ">
                Perencanaan OPD (Organisasi Perangkat Daerah) merujuk pada
                proses penyusunan dokumen perencanaan yang memuat visi, misi,
                tujuan, strategi, kebijakan, program, dan kegiatan pembangunan
                yang akan dilaksanakan oleh OPD selama periode tertentu.
              </p>
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
                  <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                    <Form.Control
                      type="text"
                      placeholder="Cari program..."
                      className="me-2"
                      style={{ minWidth: '200px' }}
                    />
                    <Button variant="primary" href="/opd/perencanaan/tambah">
                      Tambah
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="design" className="pb-4 p-4">
                    {/* code started */}
                    <Table responsive className="text-nowrap">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nama Program</th>
                          <th scope="col">Pelaksana</th>
                          <th scope="col">Tgl Mulai</th>
                          {/* <th scope="col">Target</th>
                          <th scope="col">Status</th> */}
                          <th scope="col">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {perencanaans.map((program, index) => (
                          <tr key={program._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{program.nama_program}</td>
                            <td>{program.opd_pelaksana}</td>
                            <td>Pekan 1 | {new Date(program.tgl_mulai).toLocaleDateString()}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  href={`/opd/perencanaan/${program._id}`}
                                >
                                  Ubah
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  href={`/opd/perencanaan/${program._id}`}
                                >
                                  Hapus
                                </Button>
                              </div>
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

export default Perencanaan;
