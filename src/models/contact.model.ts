import { Model, model, ObjectId, Schema } from 'mongoose';
import {
  ContactModel,
  IContact,
  IQuery,
  PaginationOptions,
  Query,
  SearchOptions,
} from '../types/contact';
import { getHighestNumber } from '../utils';

const contactSchema = new Schema<IContact, ContactModel>({
  contact: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    telephoneNumber: String,
    mobileNumber: String,
    fax: String,
    email: {
      type: String,
      required: true,
    },
    image: String,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: Number, required: true },
  },
  additionalInfo: {
    birthDate: Date,
    companyName: String,
    position: String,
    companyAddress: String,
    additionalDetails: String,
  },
  social: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    slack: String,
    skype: String,
  },
  addedBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  favorite: { type: Boolean, default: false },
});

class ContactClass extends Model {
  static async isEmailExists(
    email: string,
    addedBy: ObjectId,
  ): Promise<boolean> {
    const query: Query = {
      'contact.email': email,
      addedBy,
    };

    return !!(await this.findOne(query));
  }

  static async add(data: IContact): Promise<IContact> {
    return await this.create(data);
  }

  static async update(
    addedBy: ObjectId,
    contactId: ObjectId,
    data: Partial<IContact>,
  ) {
    return await this.findByIdAndUpdate({ _id: contactId, addedBy }, data);
  }

  static async delete(query: IQuery): Promise<boolean> {
    const result = await this.findByIdAndDelete(query);
    return !!result;
  }

  static async getById(contactId: ObjectId): Promise<IContact | null> {
    return await this.findById(contactId);
  }

  static async getContacts(
    addedBy: ObjectId,
    options: PaginationOptions,
    search?: SearchOptions,
  ): Promise<IContact[]> {
    const { page, limit } = options;

    const currentPage = getHighestNumber(page);
    const contactsPerPage = getHighestNumber(limit);
    const skip = (currentPage - 1) * contactsPerPage;

    let query = { addedBy };

    if (search) {
      Object.keys(search).forEach((key: string) => {
        const value = search[key];
        const k = `contact.${key}`;
        if (typeof value === 'string') {
          query[k] = new RegExp(value, 'i');
        } else {
          query[k] = value;
        }
      });
    }

    return await this.find(query).skip(skip).limit(contactsPerPage);
  }

  static async countContacts(query: any): Promise<number> {
    return await this.countDocuments(query);
  }
}

contactSchema.loadClass(ContactClass);

const Contact = model<IContact, ContactModel>('Contact', contactSchema);

export default Contact;
