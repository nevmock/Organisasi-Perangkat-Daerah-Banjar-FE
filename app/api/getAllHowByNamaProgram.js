import request from 'utils/request';

export const getAllHowByNamaProgram = async () => {
  try {
    const response = await request.get(`/how`);
    // Ekstrak hanya nama_program dari setiap item
    return response.data.map((item) => ({
      nama_program: item.nama_program,
      id: item._id,
    }));
  } catch (error) {
    console.error('Error fetching programs:', error);
    return [];
  }
};
