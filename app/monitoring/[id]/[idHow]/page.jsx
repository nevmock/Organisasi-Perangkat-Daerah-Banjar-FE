import ContentDetailProgram from './contentdetailProgram';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { idHow } = params;

  return <ContentDetailProgram id={idHow} />;
};

export default DynamicRoutePage;
