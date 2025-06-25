// app/monitoring/[id]/contentDetailOPD.js
'use client';
import { Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';
import ActiveProjectsByOpd from 'sub-components/dashboard/ActiveProjectsByOpd';

const ContentDetailOpd = ({ id }) => {
  const searchParams = useSearchParams();
  const opdName = searchParams.get('opdName');

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <ActiveProjectsByOpd id={id} opdName={opdName} />
      </Container>
    </Fragment>
  );
};

export default ContentDetailOpd;
