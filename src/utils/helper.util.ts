import crypto from "crypto";
import { promisify } from "util";

export const generateRandomString = async () =>
  (await promisify(crypto.randomBytes)(25)).toString("hex");

export const formatToLocalDate = (date: Date) =>
  new Date(date).toLocaleDateString();

export const getHighestNumber = (number: string) =>
  Math.max(1, parseInt(number, 10));

export const roundNumberToNearestInteger = (
  firsNumber: number,
  secondNumber: number
) => Math.ceil(firsNumber / secondNumber);
