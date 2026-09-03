import client from './client';

export async function fetchReaders() {
  const { data } = await client.get('/readers');
  return data;
}

export async function fetchReader(id) {
  const { data } = await client.get(`/readers/${id}`);
  return data;
}
