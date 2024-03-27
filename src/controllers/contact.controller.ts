import { NextFunction, Request, Response } from 'express';
import { IContact, PaginationOptions } from '../types/contact';
import { asyncHandler, stringToObjectId } from '../utils';
import messages from '../assets/json/messages.json';
import { ContactService } from '../services';

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  const { page = 1, limit = 5, ...searchOptions } = req.query;

  const pagination = {
    page,
    limit,
  } as PaginationOptions;

  const contacts = await ContactService.getContacts(id, pagination, {
    contact: searchOptions,
  });

  if (contacts.contacts.length === 0) {
    return res.status(200).json({
      success: true,
      contacts: [],
    });
  }

  return res.status(200).json({
    success: true,
    pagination: contacts.pagination,
    contacts: contacts.contacts,
  });
});

export const getContactById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const { contactId } = req.params;

    const contact = stringToObjectId(contactId);

    // id - addedBy logged in user
    // contact - contact we want to fetch
    const foundContact = await ContactService.getContactById(contact, id);

    return res.status(200).json({ success: true, contact: foundContact });
  }
);

export const addNewContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const contactData = req.body as IContact;

    await ContactService.add(id, contactData);

    return res.status(201).json({
      success: true,
      message: messages.contact.added,
    });
  }
);

export const updateContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const contactData = req.body as Partial<IContact>;
    const { contactId } = req.params;

    const contact = stringToObjectId(contactId);

    // id - addedBy logged in user
    // contact - contact id which we want to update
    await ContactService.update(id, contact, contactData);

    let message = messages.contact.updated;

    if (req.body.favorite !== undefined) {
      message = req.body.favorite
        ? messages.contact.favorite.added
        : messages.contact.favorite.removed;
    }

    return res.status(200).json({ success: true, message });
  }
);

export const deleteContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const { contactId } = req.params;

    const contact = stringToObjectId(contactId);

    // contactId - contact id which we want to delete
    // id - addedBy logged in user
    await ContactService.delete(contact, id);

    return res
      .status(200)
      .json({ success: true, message: messages.contact.deleted });
  }
);
