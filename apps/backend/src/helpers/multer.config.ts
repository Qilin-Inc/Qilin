// src/upload/multer.config.ts
import multer, { StorageEngine } from 'multer';

const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Specify the directory to save the uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    }
});

export const upload = multer({ storage });