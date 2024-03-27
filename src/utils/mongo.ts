import mongoose from 'mongoose';

export function stringToObjectId(str: string): mongoose.Schema.Types.ObjectId {
  return new mongoose.Schema.Types.ObjectId(str);
}
