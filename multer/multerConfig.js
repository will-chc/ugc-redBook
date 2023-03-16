const multer = require('multer');

const path = require('path');

const resolve = (dir) => {
    return path.join(__dirname, './', dir);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resolve('../public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const multerConfig = multer({
    storage: storage,
});

module.exports = multerConfig;
