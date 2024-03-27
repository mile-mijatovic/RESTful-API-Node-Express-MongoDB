import { Document, Model, ObjectId } from 'mongoose';

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
  addedBy: ObjectId;
  favorite: Boolean;
}

export interface PaginationOptions {
  page: string;
  limit: string;
}

export interface SearchOptions {
  contact: {
    firstName?: string;
    lastName?: string;
    telephoneNumber?: string;
    mobileNumber?: string;
    email?: string;
  };
}

export interface ContactsResult {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  contacts: IContact[];
}

export interface IQuery {
  _id?: ObjectId;
  addedBy: ObjectId;
}

export interface Query {
  'contact.email': string;
  addedBy?: ObjectId;
}

export interface ContactModel extends Model<IContact> {
  isEmailExists(email: string, addedBy?: ObjectId): Promise<boolean>;
  getContacts(
    addedBy: ObjectId,
    options: PaginationOptions,
    search?: SearchOptions
  ): Promise<ContactsResult>;
  getById(contactId: ObjectId, addedBy: ObjectId): Promise<IContact | null>;
  add(data: IContact, addedBy: ObjectId): Promise<IContact>;
  update(
    addedBy: ObjectId,
    contactId: ObjectId,
    data: Partial<IContact>
  ): Promise<IContact | null>;
  delete(query: IQuery): Promise<boolean>;
  countContacts(addedBy: ObjectId): Promise<number>;
}
