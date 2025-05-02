import DetailLaporan from './detailLaporan';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;

  return <DetailLaporan id={id} />;
};

export default DynamicRoutePage;
