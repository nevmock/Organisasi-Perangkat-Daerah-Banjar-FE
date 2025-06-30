'use client';
// import node module libraries
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';

// import widget/custom components
import { StatRightTopIcon } from 'widgets';

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from 'sub-components';

// import required data files
import ProjectsStatsData from 'data/dashboard/ProjectsStatsData';
import LineChart from 'sub-components/dashboard/ProgressProgramOpd';
import HorizontalGroupedBarChart from 'sub-components/dashboard/HorizontalGroupedBarChart';
import Cookies from 'js-cookie';
import { parseJwt } from 'lib/decodeToken';
import ProgressPieChart from 'sub-components/dashboard/PieChart';
import TableProgresProgram from 'sub-components/dashboard/TableProgresProgram';

const Home = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log(token);
    if (token) {
      const decoded = parseJwt(token);
      setUserData(decoded);
    }
  }, []);

  console.log(userData);

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        {/* Active Projects  */}
        {/* <ActiveProjects /> */}
        {userData && userData.role == 'admin' && (
          <Row className="my-6">
            <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
              {/* Tasks Performance  */}
              <ProgressPieChart />
            </Col>
            {/* card  */}
            <Col xl={8} lg={12} md={12} xs={12}>
              {/* Teams  */}
              <TableProgresProgram />
            </Col>
          </Row>
        )}
        {userData && userData.role == 'superadmin' && (
          <Row className="my-6">
            {/* card  */}
            <Col xs={12}>
              {/* Teams  */}
              <HorizontalGroupedBarChart />
            </Col>
          </Row>
        )}
        {/* <ActiveProjects /> */}
      </Container>
    </Fragment>
  );
};
export default Home;
