import Router from "express";
import upload from "../config/multer";
import {
  closeProfile,
  getUserInfo,
  resetImage,
  uploadImage,
  changePassword,
} from "../controllers/profile.controller";
import { requireAuth, validation } from "../middleware";
import { changePasswordSchema, uploadSchema } from "../validation";

const router = Router();

router.use(requireAuth);

router
  .get("/", getUserInfo)
  .patch("/", upload.single("image"), validation(uploadSchema), uploadImage)
  .patch("/reset-image", resetImage)
  .patch("/change-password", validation(changePasswordSchema), changePassword)
  .delete("/", closeProfile);

export default router;
