import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const readFile = async (filePath: string): Promise<Buffer> => {
  return fs.promises.readFile(filePath);
};

export const writeFile = async (
  filePath: string,
  data: string,
): Promise<void> => {
  return fs.promises.writeFile(filePath, data);
};

export const deleteFile = async (filePath: string): Promise<void> => {
  return fs.promises.unlink(filePath);
};

export const joinPaths = (file: string): string => {
  const publicFolder = isProduction
    ? '../../address-book/public/images'
    : '../../public/images';
  return path.resolve(__dirname, publicFolder, file);
};

export const deleteFileIfExists = async (filePath: string): Promise<void> => {
  await fs.promises.access(filePath);
  await fs.promises.unlink(filePath);
};
