import { Suspense } from 'react';
import ContentDetailOpd from './contentDetailOPD';
import ProgressDemo from 'components/bootstrap/ProgressDemo';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;
  return (
    <Suspense fallback={<ProgressDemo isLoading={true} />}>
      <ContentDetailOpd id={id} />
    </Suspense>
  );
};

export default DynamicRoutePage;
