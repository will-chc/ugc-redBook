const multerConfig = require('./multerConfig');

const filename = "file";

const uploadBaseUrl = 'http://localhost:5000';

const imgpath = '/images/';

function upload(req, res) {
    return new Promise((reslove, reject) => {

        multerConfig.single(filename)(req, res, (err) => {
            if (err) {
                reject(err);
            }
            else {
                reslove(uploadBaseUrl + imgpath + req.file.filename);
            }
        })
    });
}
module.exports = upload;