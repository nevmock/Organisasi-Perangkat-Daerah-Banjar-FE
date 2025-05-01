'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Dropdown, Form, Row, Col } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = () => {
  const [bulan, setBulan] = useState('Jan');
  const [tahun, setTahun] = useState('2024');

  const perfomanceChartSeries = [
    {
      name: 'Completed',
      data: [76, 80, 85, 90],
    },
    {
      name: 'In-Progress',
      data: [32, 40, 45, 50],
    },
    {
      name: 'Behind',
      data: [13, 15, 10, 8],
    },
  ];

  const perfomanceChartOptions = {
    chart: {
      type: 'line',
      height: 320,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#28a745', '#ffc107', '#dc3545'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'top',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="text-muted text-primary-hover"
    >
      {children}
    </Link>
  ));

  CustomToggle.displayName = 'CustomToggle';

  const ActionMenu = () => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-muted" />
      </Dropdown.Toggle>
      <Dropdown.Menu align={'end'}>
        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
        <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0">Tasks Performance</h4>
          <ActionMenu />
        </div>

        {/* Filter Section */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
            >
              {[
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            >
              {[2022, 2023, 2024, 2025].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Chart */}
        <Chart
          options={perfomanceChartOptions}
          series={perfomanceChartSeries}
          type="line"
          width="100%"
          height={320}
        />
      </Card.Body>
    </Card>
  );
};

export default LineChart;
