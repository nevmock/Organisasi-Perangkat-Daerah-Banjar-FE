import ContentDetailOpd from './contentDetailOPD';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;

  return <ContentDetailOpd id={id} />;
};

export default DynamicRoutePage;
