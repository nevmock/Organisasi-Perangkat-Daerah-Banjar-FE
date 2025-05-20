"use client";
import React, { useEffect, useState } from "react";
import { parseISO, getMonth, getYear, getDate } from "date-fns";
import Link from "next/link";
import { Card, Dropdown, Form, Row, Col } from "react-bootstrap";
import { MoreVertical } from "react-feather";
import axios from "axios";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = () => {
  const today = new Date();

  // Ambil nama bulan dalam format "January", "February", dst.
  const defaultBulan = today.toLocaleString("en-US", { month: "long" });
  // Ambil tahun saat ini dalam format string
  const defaultTahun = today.getFullYear().toString();

  const [bulan, setBulan] = useState(defaultBulan);
  const [tahun, setTahun] = useState(defaultTahun);

  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    const fetchDataPerformance = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/monitoring/performance`;
        console.log("Requesting URL:", url);
        const res = await axios.get(url);
        console.log("Fetched data:", res.data);
        setSampleData(res.data);
      } catch (err) {
        console.error("Gagal fetch data sumary:", err);
        console.log("Detail error:", err.response?.data || err.message);
      }
    };

    fetchDataPerformance();
  }, []);

  const getWeekOfMonth = (date) => {
    const day = getDate(date);
    return Math.ceil(day / 7);
  };

  const groupDataByWeek = (data, selectedMonth, selectedYear) => {
    const filtered = data.filter((d) => {
      const date = parseISO(d.date);
      return (
        getMonth(date) === selectedMonth &&
        getYear(date) === parseInt(selectedYear)
      );
    });

    const weeklyData = Array(5)
      .fill(0)
      .map(() => ({
        completed: 0,
        inProgress: 0,
        behind: 0,
      }));

    filtered.forEach((item) => {
      const date = parseISO(item.date);
      const week = getWeekOfMonth(date) - 1;
      if (weeklyData[week]) {
        weeklyData[week].completed += item.completed;
        weeklyData[week].inProgress += item.inProgress;
        weeklyData[week].behind += item.behind;
      }
    });

    return weeklyData;
  };

  const monthIndex = new Date(`${bulan} 1, ${tahun}`).getMonth();
  const weeklyGrouped = groupDataByWeek(sampleData, monthIndex, tahun);

  const perfomanceChartSeries = [
    {
      name: "Completed",
      data: weeklyGrouped.map((item) => item.completed),
    },
    {
      name: "In-Progress",
      data: weeklyGrouped.map((item) => item.inProgress),
    },
    {
      name: "Behind",
      data: weeklyGrouped.map((item) => item.behind),
    },
  ];

  const perfomanceChartOptions = {
    chart: {
      type: "line",
      height: 320,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#28a745", "#ffc107", "#dc3545"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
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
  CustomToggle.displayName = "CustomToggle";

  const ActionMenu = () => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-muted" />
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"}>
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
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
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
