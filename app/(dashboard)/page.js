"use client";
// import node module libraries
import { Fragment } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import LineChart from "sub-components/dashboard/ProgressProgramOpd";

const Home = () => {
  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        {/* Active Projects  */}
        {/* <ActiveProjects /> */}

        <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            {/* Tasks Performance  */}
            <TasksPerformance />
          </Col>
          {/* card  */}
          <Col xl={8} lg={12} md={12} xs={12}>
            {/* Teams  */}
            <LineChart />
          </Col>
        </Row>
        <ActiveProjects />
      </Container>
    </Fragment>
  );
};
export default Home;
