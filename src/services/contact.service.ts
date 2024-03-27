import { ObjectId } from 'mongoose';
import messages from '../assets/json/messages.json';
import { NotFoundError, ValidationError } from '../errors';
import Contact from '../models/contact.model';
import {
  ContactsResult,
  IContact,
  PaginationOptions,
  SearchOptions,
} from '../types/contact';
import { getHighestNumber } from '../utils';

class ContactService {
  /**
   * Get contacts
   * @param addedBy User ID of the currently logged-in user
   * @param options Pagination options (page, limit)
   * @param search Search options for filtering contacts
   * @returns Object containing paginated contacts and pagination information
   * @throws {NotFoundError} If the requested page does not exist
   */
  static async getContacts(
    addedBy: ObjectId,
    options: PaginationOptions,
    search?: SearchOptions
  ): Promise<ContactsResult> {
    const { page, limit } = options;
    const currentPage = getHighestNumber(page);
    const contactsPerPage = getHighestNumber(limit);
    const skip = (currentPage - 1) * contactsPerPage;

    let query = { addedBy };

    if (search) {
      Object.keys(search.contact).forEach((key: string) => {
        const value = search.contact[key];
        const k = `contact.${key}`;
        query[k] = { $regex: value, $options: 'i' };
      });
    }

    const contactPromise = Contact.find(query)
      .skip(skip)
      .limit(contactsPerPage)
      .sort({ createdAt: -1 });

    const countPromise = Contact.countDocuments(query);

    const [totalResults, contacts] = await Promise.all([
      countPromise,
      contactPromise,
    ]);

    const totalPages = Math.ceil(totalResults / contactsPerPage);

    if (totalResults && currentPage > totalPages) {
      throw new NotFoundError(`Page ${page} was not found.`);
    }

    const result: ContactsResult = {
      pagination: {
        page: currentPage,
        limit: contactsPerPage,
        total: totalResults,
      },
      contacts,
    };

    return result;
  }

  /**
   * Get contact by ID
   * @param addedBy User ID of the currently logged-in user
   * @param contactId Contact ID to be retrieved
   * @returns Retrieved contact
   * @throws {NotFoundError} If the contact is not found
   */
  static async getContactById(contactId: ObjectId, addedBy: ObjectId) {
    return await Contact.getById(contactId, addedBy);
  }

  /**
   * Add new contact with unique email address
   * @param addedBy User ID of the currently logged-in user
   * @param data Contact data to be added
   * @returns Newly added contact
   * @throws {ValidationError} If the email address already exists
   * @throws {NotFoundError} If the contact fails to be added
   */
  static async add(addedBy: ObjectId, data: IContact) {
    const exists = await Contact.isEmailExists(data.contact.email);

    if (exists) throw new ValidationError(messages.contact.exists);

    const savedContact: IContact = await Contact.add(data, addedBy);

    if (!savedContact) {
      throw new NotFoundError(messages.contact.failed);
    }

    return savedContact;
  }

  /**
   * Update contact data
   * @param addedBy User ID of the currently logged-in user
   * @param contactId Contact ID to be updated
   * @param data Partial contact data containing fields to be updated
   * @returns Updated contact
   * @throws {NotFoundError} If the contact is not found
   */
  static async update(
    addedBy: ObjectId,
    contactId: ObjectId,
    data: Partial<IContact>
  ) {
    const result = await Contact.update(addedBy, contactId, data);

    if (!result) {
      throw new NotFoundError(messages.contact.notFound);
    }

    return result;
  }

  /**
   * Delete contact
   * @param contactId Contact ID to be deleted
   * @param addedBy User ID of the currently logged-in user
   * @returns {boolean} True if the contact is successfully deleted
   * @throws {NotFoundError} If the contact is not found
   */
  static async delete(contactId: ObjectId, addedBy: ObjectId) {
    const result = await Contact.delete({ _id: contactId, addedBy });

    if (!result) {
      throw new NotFoundError(messages.contact.notFound);
    }

    return result;
  }
}

export default ContactService;
