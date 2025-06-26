'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import request from 'utils/request';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ProgressPieChart = () => {
  const [series, setSeries] = useState([0, 0, 0]);
  const [dataProgress, setDataProgress] = useState({
    belum_mulai: 0,
    progress: 0,
    selesai: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const labels = ['Belum Mulai', 'Progress', 'Selesai'];
  const colors = ['#dc3545', '#F59E0B', '#7bc043'];

  const options = {
    chart: { type: 'pie', width: 250, height: 250 },
    labels,
    colors,
    legend: { show: false },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 250, height: 250 },
          legend: { show: false },
        },
      },
    ],
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await request.get('/how/summary');
        const { persentase, belum_mulai, progress, selesai } = res.data || {};

        setDataProgress({
          belum_mulai: belum_mulai || 0,
          progress: progress || 0,
          selesai: selesai || 0,
        });

        if (persentase) {
          setSeries([
            persentase.belum_mulai || 0,
            persentase.progress || 0,
            persentase.selesai || 0,
          ]);
        } else {
          setError('Data persentase tidak tersedia.');
        }
      } catch (err) {
        setError('Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Card className="h-100 p-4 text-center">
        <p>Memuat data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-100 p-4 text-center text-danger">
        <p>{error}</p>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="mb-0">Presentasi Program OPD</h4>
        </div>
        <div className="mb-4 position-relative">
          <Chart
            options={options}
            series={series}
            type="pie"
            width="100%"
            height={300}
          />
        </div>
        <div className="d-flex align-items-center justify-content-around">
          <div className="text-center">
            <i className="fe fe-check-circle text-success fs-3"></i>
            <h1 className="mt-3 mb-1 fw-bold">{dataProgress.selesai}</h1>
            <p>Selesai</p>
          </div>
          <div className="text-center">
            <i className="fe fe-trending-up text-warning fs-3"></i>
            <h1 className="mt-3 mb-1 fw-bold">{dataProgress.progress}</h1>
            <p>Progress</p>
          </div>
          <div className="text-center">
            <i className="fe fe-stop-circle text-danger fs-3"></i>
            <h1 className="mt-3 mb-1 fw-bold">{dataProgress.belum_mulai}</h1>
            <p>Belum Mulai</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProgressPieChart;
