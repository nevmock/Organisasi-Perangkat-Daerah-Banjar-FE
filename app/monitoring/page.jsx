'use client';
// import node module libraries
import { Fragment } from 'react';
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';

// import widget/custom components
import { StatRightTopIcon } from 'widgets';

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from 'sub-components';

// import required data files
import ProjectsStatsData from 'data/dashboard/ProjectsStatsData';
import LineChart from 'sub-components/dashboard/ProgressProgramOpd';

const Monitoring = () => {
  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        {/* Active Projects  */}
        {/* <ActiveProjects /> */}

        <ActiveProjects />
      </Container>
    </Fragment>
  );
};
export default Monitoring;
