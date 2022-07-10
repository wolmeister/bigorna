export async function getImageFromUrl(url: string, defaultType = 'image/jpeg') {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], 'image', {
    type: data.type || defaultType,
  });
}

export const getFileFromUrl = getImageFromUrl;
