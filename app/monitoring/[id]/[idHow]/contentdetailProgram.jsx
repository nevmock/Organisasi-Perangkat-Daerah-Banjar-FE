'use client';
import HowForm from 'components/form/howForm';
import useMounted from 'hooks/useMounted';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import request from 'utils/request';
import { PageHeading } from 'widgets';
import DoForm from 'components/form/doForm';
import DateForm from 'components/form/dateForm';
import { useRouter } from 'next/navigation';

const initialForm = {
  nama_program: '',
  tujuan_program: '',
  sasaran_program: '',
  rencana_output_kuantitatif: [''],
  rencana_output_kualitatif: [''],
  jumlah_peserta: '',
  jumlah_pelatihan: '',
  tingkat_kepuasan: '',
  lokasi_kelurahan: '',
  lokasi_kecamatan: '',
  lokasi_kota: '',
  anggaran_jumlah: '',
  anggaran_sumber_dana: [{ jenis: '', persentase: '' }],
  opd_pengusul_utama: '',
  opd_kolaborator: [''],
  status: '',
};

const ContentDetailProgram = ({ id }) => {
  const hasMounted = useMounted();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [doData, setDoData] = useState([]); // Changed to array to handle multiple Do entries
  const [dateData, setDateData] = useState([]);
  const [programNames, setProgramNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get(`/how/admin/doDateDetails/${id}`);

        const dataHow = res.data.how;
        const dataDo = res.data.doDetails; // Now getting all Do details
        const dataDate = res.data.dateDetails;

        // Prepare program names for selection
        setProgramNames([
          {
            id: dataHow._id,
            nama_program: dataHow.nama_program,
          },
        ]);

        setForm({
          nama_program: dataHow.nama_program || '',
          tujuan_program: dataHow.tujuan_program || '',
          sasaran_program: dataHow.sasaran_program || '',
          rencana_output_kuantitatif: dataHow.rencana_output?.kuantitatif || [
            '',
          ],
          rencana_output_kualitatif: dataHow.rencana_output?.kualitatif || [''],
          jumlah_peserta:
            dataHow.target_indikator_kinerja?.jumlah_peserta || '',
          jumlah_pelatihan:
            dataHow.target_indikator_kinerja?.jumlah_pelatihan || '',
          tingkat_kepuasan:
            dataHow.target_indikator_kinerja?.tingkat_kepuasan || '',
          lokasi_kelurahan: dataHow.rencana_lokasi?.kelurahan || '',
          lokasi_kecamatan: dataHow.rencana_lokasi?.kecamatan || '',
          lokasi_kota: dataHow.rencana_lokasi?.kota || '',
          anggaran_jumlah: dataHow.rencana_anggaran?.jumlah || '',
          anggaran_sumber_dana: dataHow.rencana_anggaran?.sumber_dana || [
            { jenis: '', persentase: '' },
          ],
          opd_pengusul_utama: dataHow.opd_pengusul_utama || '',
          opd_kolaborator: dataHow.opd_kolaborator || [''],
          status: dataHow.status || '',
        });

        // Prepare Do data - now handling array of Do entries
        if (dataDo && dataDo.length > 0) {
          setDoData(
            dataDo.map((doItem) => ({
              nama_program: doItem.nama_program?.nama_program || '',
              kolaborator: doItem.kolaborator || [],
              rincian_kegiatan: doItem.rincian_kegiatan || '',
              capaian_output: doItem.capaian_output || '',
              dokumentasi_kegiatan: doItem.dokumentasi_kegiatan || [],
              kendala: doItem.kendala || '',
              rekomendasi: doItem.rekomendasi || '',
              createdAt: doItem.createdAt || '', // Added to show creation date if needed
            }))
          );
        }

        // Prepare Date data
        if (dataDate && dataDate.length > 0) {
          setDateData(
            dataDate.map((date) => ({
              nama_program: date.nama_program?.nama_program || '',
              tanggal_mulai: date.tanggal_mulai || '',
              tanggal_selesai: date.tanggal_selesai || '',
              link_laporan_pdf: date.link_laporan_pdf || [],
              status_laporan: date.status_laporan || '',
            }))
          );
        }
      } catch (err) {
        console.error('Gagal fetch data:', err);
      }
    };
    if (id) fetchData();
  }, [id]);

  return (
    <Container fluid className="p-6">
      <div className="mb-4">
        <Button variant="secondary" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
      {/* How Section */}
      <PageHeading heading="Data How" />
      <Row className="mb-8">
        <Col>
          <Card>
            <Card.Body>{hasMounted && <HowForm form={form} />}</Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Do Section - Now shows all Do entries */}
      <PageHeading heading="Data Do" />
      {doData.length > 0 ? (
        doData.map((doItem, index) => (
          <Row className="mb-8" key={index}>
            <Col>
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    Do #{index + 1} -{' '}
                    {new Date(doItem.createdAt).toLocaleDateString()}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <DoForm
                    form={doItem}
                    programNames={programNames}
                    defaultFile={doItem.dokumentasi_kegiatan}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <Row className="mb-8">
          <Col>
            <Card>
              <Card.Body>
                <p className="text-muted">Tidak ada data Do</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Date Section */}
      <PageHeading heading="Data Date" />
      {dateData.length > 0 ? (
        dateData.map((date, index) => (
          <Row className="mb-8" key={index}>
            <Col>
              <Card>
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    Date #{index + 1} - {date.tanggal_mulai?.slice(0, 10)} to{' '}
                    {date.tanggal_selesai?.slice(0, 10)}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <DateForm form={date} defaultFile={date.link_laporan_pdf} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <Row className="mb-8">
          <Col>
            <Card>
              <Card.Body>
                <p className="text-muted">Tidak ada data Date</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ContentDetailProgram;
