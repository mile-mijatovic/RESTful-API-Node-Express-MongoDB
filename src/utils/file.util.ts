import fs from "fs";
import path from "path";

export const readFile = async (filePath: string): Promise<Buffer> => {
  return fs.promises.readFile(filePath);
};

export const writeFile = async (filePath: string, data: string): Promise<void> => {
  return fs.promises.writeFile(filePath, data);
};

export const deleteFile = async (filePath: string): Promise<void> => {
  return fs.promises.unlink(filePath);
};

export const joinPaths = (file: string): string => {
  return path.join(__dirname, "../../public/images", file);
};
