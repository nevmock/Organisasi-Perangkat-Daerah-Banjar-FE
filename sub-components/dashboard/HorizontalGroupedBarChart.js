'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import request from 'utils/request';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Utility untuk ambil username dari email
const getUsernameFromEmail = (email) => {
  return email ? email.split('@')[0] : '';
};

const HorizontalGroupedBarChart = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await request.get('/how/dashboard/programSummary'); // Fetch data
        const apiData = res.data.data;

        // Ambil kategori (username dari email)
        const cat = apiData.map((item) => getUsernameFromEmail(item.email));
        setCategories(cat);

        // Bentuk series
        const belumMulaiData = apiData.map((item) => item.belum_mulai || 0);
        const progressData = apiData.map((item) => item.progress || 0);
        const selesaiData = apiData.map((item) => item.selesai || 0);

        setSeriesData([
          { name: 'Belum Mulai', data: belumMulaiData },
          { name: 'Progress', data: progressData },
          { name: 'Selesai', data: selesaiData },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const options = {
    chart: {
      type: 'bar',
      height: 430,
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: { fontSize: '14px', colors: ['#fff'] },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff'],
    },
    tooltip: { shared: true, intersect: false },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '14px', // bisa Anda ubah sesuai kebutuhan
          colors: ['#333'], // opsional untuk warna
          fontWeight: 500, // opsional untuk ketebalan
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          colors: ['#333'],
          fontWeight: 500,
        },
      },
    },
    colors: ['#dc3545', '#F59E0B', '#7bc043'], // Biru, Oranye, Hijau
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: { height: 300 },
          dataLabels: { style: { fontSize: '16px' } },
        },
      },
    ],
  };

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">Data Inputan OPD</h5>
        <Chart
          options={options}
          series={seriesData}
          type="bar"
          width="100%"
          height={1000}
        />
      </div>
    </div>
  );
};

export default HorizontalGroupedBarChart;
