import client from './client';

export async function fetchVideos() {
  const { data } = await client.get('/videos');
  return data;
}
