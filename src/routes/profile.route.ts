import Router from 'express';
import upload from '../config/multer';
import {
  getUserInfo,
  resetImage,
  uploadImage,
  changePassword,
  deleteProfile,
} from '../controllers/profile.controller';
import { requireAuth, validation } from '../middleware';
import { changePasswordSchema } from '../validation';

const router = Router();

router.use(requireAuth);

router
  .get('/', getUserInfo)
  .patch('/', upload, uploadImage)
  .patch('/reset-image', resetImage)
  .patch('/change-password', validation(changePasswordSchema), changePassword)
  .delete('/', deleteProfile);

export default router;
