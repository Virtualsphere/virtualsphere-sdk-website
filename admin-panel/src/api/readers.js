import client from './client';

export async function fetchReaders() {
  const { data } = await client.get('/admin/readers');
  return data;
}

export async function fetchReader(id) {
  const { data } = await client.get(`/admin/readers/${id}`);
  return data;
}

function buildFormData(fields) {
  const formData = new FormData();
  const { photos, videos, sdkFiles, demoFiles, features, ...rest } = fields;

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (features !== undefined) {
    formData.append('features', JSON.stringify(features));
  }
  (photos || []).forEach((file) => formData.append('photos', file));
  (videos || []).forEach((file) => formData.append('videos', file));
  (sdkFiles || []).forEach((file) => formData.append('sdkFiles', file));
  (demoFiles || []).forEach((file) => formData.append('demoFiles', file));

  return formData;
}

export async function createReader(fields) {
  const { data } = await client.post('/admin/readers', buildFormData(fields), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateReader(id, fields) {
  const { data } = await client.put(`/admin/readers/${id}`, buildFormData(fields), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteReader(id) {
  await client.delete(`/admin/readers/${id}`);
}

export async function deleteReaderImage(readerId, imageId) {
  await client.delete(`/admin/readers/${readerId}/images/${imageId}`);
}

export async function deleteReaderVideo(readerId, videoId) {
  await client.delete(`/admin/readers/${readerId}/videos/${videoId}`);
}

export async function deleteReaderFile(readerId, fileId) {
  await client.delete(`/admin/readers/${readerId}/files/${fileId}`);
}
