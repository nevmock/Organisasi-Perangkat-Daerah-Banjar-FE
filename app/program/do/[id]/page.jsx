import InputDo from "./Detaildo";

export async function generateStaticParams() {
    return [];
}

const DynamicRoutePage = ({ params }) => {
    const { id } = params;

    return <InputDo id={id} />;
};

export default DynamicRoutePage;
