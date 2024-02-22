import Router from "express";
import upload from "../config/multer";
import {
  closeProfile,
  getUserInfo,
  resetImage,
  uploadImage,
} from "../controllers/profile.controller";
import { requireAuth, validation } from "../middleware";
import { uploadSchema } from "../validation";

const router = Router();

router.use(requireAuth);

router
  .get("/", getUserInfo)
  .patch("/", upload.single("image"), validation(uploadSchema), uploadImage)
  .patch("/reset-image", resetImage)
  .delete("/", closeProfile);

export default router;
