/* For data URI like `data:image/png;base64,...`
 */
export const dataURIToBuffer = async (uri: string) => {
  const res = await fetch(uri);
  const arr = await res.arrayBuffer();

  return Buffer.from(arr);
};
