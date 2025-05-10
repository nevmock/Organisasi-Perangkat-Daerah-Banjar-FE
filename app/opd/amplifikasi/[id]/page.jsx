import DeatailAmplifikasi from './detailAmplifikasi';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;

  return <DeatailAmplifikasi id={id} />;
};

export default DynamicRoutePage;
