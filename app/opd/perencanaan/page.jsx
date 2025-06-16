'use client';
import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
} from 'react-bootstrap';
import Pagination from 'sub-components/Pagination';
import request from 'utils/request';

const Perencanaan = () => {
  const [programOpd, setProgramOpd] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]); // Data setelah search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Bisa disesuaikan

  // Fetch data (tanpa pagination parameter)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get('/perencanaan');
        setProgramOpd(res.data);
        setFilteredData(res.data); // Initialize filtered data
      } catch (err) {
        console.error('Gagal fetch data:', err);
      }
    };
    fetchData();
  }, []);

  // Handle search (client-side)
  const handleSearch = () => {
    const filtered = programOpd.filter(
      (item) =>
        item.nama_program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.opd_pelaksana.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman 1 saat search
  };

  // Hitung data yang ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Container fluid className="p-6">
      {/* Search Form */}
      <Form
        className="d-flex align-items-center gap-2 mb-4"
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
        <Button variant="primary" href="/opd/perencanaan/tambah">
          Tambah
        </Button>
      </Form>

      {/* Table */}
      <Table responsive className="text-nowrap">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Program</th>
            <th>Pelaksana</th>
            <th>Tgl Pelaksanaan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((program, index) => (
            <tr key={program._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{program.nama_program}</td>
              <td>{program.opd_pelaksana}</td>
              <td>{program.tgl_mulai}</td>
              <td>
                <Button
                  variant="outline-primary"
                  href={`/opd/perencanaan/${program._id}`}
                >
                  Detail
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default Perencanaan;
