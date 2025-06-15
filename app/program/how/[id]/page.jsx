import DetailHow from "./DetailHow";

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;

  return <DetailHow id={id} />;
};

export default DynamicRoutePage;
