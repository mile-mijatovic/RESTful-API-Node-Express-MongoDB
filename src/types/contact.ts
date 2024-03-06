import { Document, Model, ObjectId, Types } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  contact: {
    telephoneNumber: string;
    mobileNumber: string;
    fax: string;
    email: string;
  };
  address: { street: string; city: string; zipCode: number };
  additionalInfo: {
    birthDate: Date;
    companyName: string;
    position: string;
    companyAddress: string;
    additionalDetails: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    slack: string;
    skype: string;
  };
  addedBy: Types.ObjectId;
  favorite: Boolean;
}

export interface PaginationOptions {
  addedBy: ObjectId;
  page: string;
  limit: string;
}

export interface FilterOptions {
  firstName?: string;
  lastName?: string;
  contact?: {
    telephoneNumber?: string;
    email?: string;
  };
}

export interface QueryResult {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  contacts: IContact[];
}

export interface IQuery {
  _id?: string;
  addedBy: ObjectId;
}

export interface Query {
  "contact.email": string;
  addedBy?: ObjectId;
}

export interface ContactModel extends Model<IContact> {
  isEmailExists(email: string, addedBy?: string): Promise<boolean>;
  getAll(
    options: PaginationOptions,
    filter?: Record<string, any>
  ): Promise<QueryResult>;
  getById(contactId: string, addedBy: ObjectId): Promise<IContact>;
  add(body: IContact, contactId: ObjectId): Promise<void>;
  update(body: IContact, contactId: string, addedBy: ObjectId): Promise<void>;
  delete(contactId: string, addedBy: ObjectId): Promise<void>;
}
