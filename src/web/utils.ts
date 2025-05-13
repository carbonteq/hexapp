import { Buffer } from "node:buffer";

/* For data URI like `data:image/png;base64,...`
 */
export const dataURIToBuffer = async (uri: string): Promise<Buffer> => {
  const res = await fetch(uri);
  const arr = await res.arrayBuffer();

  return Buffer.from(arr);
};
