import DetailPerencanaan from "./DetailPerencanaan";

export async function generateStaticParams() {
  return [];
}

const DynamicRoutePage = ({ params }) => {
  const { id } = params;

  return <DetailPerencanaan id={id} />;
};

export default DynamicRoutePage;
