"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Dropdown } from "react-bootstrap";
import { MoreVertical } from "react-feather";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import axios from "axios";

const Charts = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchDataSumary = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/monitoring/summary`;
        console.log("Requesting URL:", url);
        const res = await axios.get(url);
        console.log("Fetched data:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("Gagal fetch data sumary:", err);
        console.log("Detail error:", err.response?.data || err.message);
      }
    };

    fetchDataSumary();
  }, []);
  console.log(data);

  const perfomanceChartSeries = [data?.persen_selesai];
  const perfomanceChartOptions = {
    dataLabels: { enabled: !1 },
    labels: ["persen_selesai"],
    colors: ["#28a745"],
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: "55%",
        },
        track: {
          background: "transaprent",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    chart: { type: "radialBar" },
    stroke: { lineCap: "round" },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 5000,
        options: {
          chart: {
            height: 320,
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

  const ActionMenu = () => {
    return (
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
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="mb-0">Tasks Performance </h4>
          </div>
          <ActionMenu />
        </div>
        <div className="mb-4  position-relative">
          <Chart
            options={perfomanceChartOptions}
            series={perfomanceChartSeries}
            type="radialBar"
            width="100%"
          />
          <h1 className="position-absolute top-50 start-50 translate-middle fw-bold">
            {data?.persen_selesai}%
          </h1>
        </div>
        {/* icon with content  */}
        <div className="d-flex align-items-center justify-content-around">
          <div className="text-center">
            <i className="fe fe-check-circle text-success fs-3"></i>
            <h1 className="mt-3  mb-1 fw-bold">{data?.indikator_selesai}</h1>
            <p>Indikator Selesai</p>
          </div>
          <div className="text-center">
            <i className="fe fe-trending-up text-warning fs-3"></i>
            <h1 className="mt-3  mb-1 fw-bold">{data?.indikator_belum}</h1>
            <p>Indikator Belum</p>
          </div>
          <div className="text-center">
            <i
              className="fe fe-bar-chart-2 fs-3"
              style={{ color: "#007bff" }}
            ></i>
            <h1 className="mt-3  mb-1 fw-bold">{data?.total_indikator}</h1>
            <p>Total Indikator</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Charts;
