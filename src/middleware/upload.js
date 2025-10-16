const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.csv';
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedMimes = ['text/csv', 'application/vnd.ms-excel'];
  const isCsvMime = allowedMimes.includes(file.mimetype);
  const isCsvExt = file.originalname.toLowerCase().endsWith('.csv');
  if (isCsvMime || isCsvExt) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'));
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = upload;
