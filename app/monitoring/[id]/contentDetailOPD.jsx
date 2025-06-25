'use client';
// import node module libraries
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';

// import sub components
import ActiveProjectsByOpd from 'sub-components/dashboard/ActiveProjectsByOpd';

const ContentDetailOpd = ({ id }) => {
  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <ActiveProjectsByOpd id={id} />
      </Container>
    </Fragment>
  );
};
export default ContentDetailOpd;
