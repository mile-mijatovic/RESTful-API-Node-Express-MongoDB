import { NextFunction, Request, Response } from "express";
import Contact from "../models/contact.model";
import { IContact, PaginationOptions } from "../types/contact";
import { asyncHandler } from "../utils";
import messages from "../utils/messages.json";

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;

  const { page = 1, limit = 5, ...filter } = req.query;

  const options = {
    addedBy: id,
    page,
    limit,
  } as PaginationOptions;

  const contacts = await Contact.getAll(options, filter);

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

    const contact = await Contact.getById(contactId, id);

    return res.status(200).json({ success: true, contact });
  }
);

export const addNewContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const contactData = req.body as IContact;

    await Contact.add(contactData, id);

    return res.status(201).json({
      success: true,
      message: messages.contact.added,
    });
  }
);

export const updateContact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const contactData = req.body as IContact;
    const { contactId } = req.params;

    await Contact.update(contactData, contactId, id);

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

    await Contact.delete(contactId, id);

    return res
      .status(200)
      .json({ success: true, message: messages.contact.deleted });
  }
);
