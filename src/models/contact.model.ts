import { Model, model, ObjectId, Schema } from "mongoose";
import { NotFoundError, ValidationError } from "../errors";
import messages from "../utils/messages.json";
import {
  ContactModel,
  FilterOptions,
  IContact,
  IQuery,
  PaginationOptions,
  Query,
  QueryResult,
} from "../types/contact";
import { getHighestNumber, roundNumberToNearestInteger } from "../utils";

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
    ref: "User",
  },
  favorite: { type: Boolean, default: false },
});

class ContactClass extends Model {
  static async isEmailExists(
    email: string,
    addedBy: ObjectId
  ): Promise<boolean> {
    const query: Query = {
      "contact.email": email,
      addedBy,
    };

    const exist = await this.findOne(query);
    return !!exist;
  }

  static async getAll(
    options: PaginationOptions,
    filter?: FilterOptions
  ): Promise<QueryResult> {
    const { addedBy, page, limit } = options;

    const currentPage = getHighestNumber(page);
    const contactsPerPage = getHighestNumber(limit);
    const skip = (currentPage - 1) * contactsPerPage;

    let query = { addedBy };

    if (filter) {
      Object.keys(filter).forEach((key: string) => {
        const value = filter[key];
        if (typeof value === "string") {
          query[key] = { $regex: value, $options: "i" };
        } else {
          query[key] = value;
        }
      });
    }
    const contactPromise: IContact[] = await this.find(query)
      .skip(skip)
      .limit(contactsPerPage)
      .sort({ createdAt: -1 });

    const countPromise = await this.countDocuments({ addedBy });

    const [totalResults, contacts]: [number, IContact[]] = await Promise.all([
      countPromise,
      contactPromise,
    ]);

    const totalPages = roundNumberToNearestInteger(
      totalResults,
      contactsPerPage
    );

    if (totalResults && currentPage > totalPages)
      throw new NotFoundError(`Page ${page} was not found.`);

    const result: QueryResult = {
      pagination: {
        page: currentPage,
        limit: contactsPerPage,
        total: totalPages,
      },
      contacts,
    };

    return result;
  }

  static async getById(
    contactId: string,
    addedBy: ObjectId
  ): Promise<IContact | null> {
    const query: IQuery = { _id: contactId, addedBy };

    const contact = await this.findOne(query);

    if (!contact) {
      throw new NotFoundError(messages.contact.notFound);
    }

    return contact;
  }

  static async add(body: IContact, addedBy: ObjectId): Promise<IContact> {
    const exists = await this.isEmailExists(body.contact.email, addedBy);

    if (exists) throw new ValidationError(messages.contact.exists);

    const savedContact: IContact = await this.create({
      ...body,
      addedBy,
    });

    if (!savedContact) {
      throw new NotFoundError(messages.contact.failed);
    }

    return savedContact;
  }

  static async update(body: IContact, contactId: string, addedBy: ObjectId) {
    const result = await this.findOneAndUpdate(
      { _id: contactId, addedBy },
      body,
      {
        new: true,
      }
    );

    if (!result) {
      throw new NotFoundError(messages.contact.notFound);
    }

    return result;
  }

  static async delete(contactId: string, addedBy: ObjectId) {
    let query: IQuery = { _id: contactId, addedBy };

    const result = await this.findOneAndDelete(query);

    if (!result) {
      throw new NotFoundError(messages.contact.notFound);
    }

    return result;
  }
}

contactSchema.loadClass(ContactClass);

const Contact = model<IContact, ContactModel>("Contact", contactSchema);

export default Contact;
