import DateForm from './InputDate';

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;

  return <DateForm id={id} />;
};

export default DynamicRoutePage;
