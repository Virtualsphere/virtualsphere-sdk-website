import client from './client';

export async function fetchVideos() {
  const { data } = await client.get('/admin/videos');
  return data;
}

export async function createVideo(fields) {
  const { data } = await client.post('/admin/videos', fields);
  return data;
}

export async function updateVideo(id, fields) {
  const { data } = await client.put(`/admin/videos/${id}`, fields);
  return data;
}

export async function deleteVideo(id) {
  await client.delete(`/admin/videos/${id}`);
}
