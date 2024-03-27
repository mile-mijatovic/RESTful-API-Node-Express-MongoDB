import multer from 'multer';
import { ValidationError } from '../errors';
import messages from '../assets/json/messages.json';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image')) {
      return cb(
        new ValidationError(messages.validation.contentType.onlyImagesAllowed),
      );
    }

    cb(null, true);
  },
}).single('image');

export default upload;
