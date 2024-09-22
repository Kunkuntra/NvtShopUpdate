const express = require('express');
const meController = require('../app/controllers/MeController');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/') 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Đặt tên file để tránh trùng lặp
    }
});

const upload = multer({ storage: storage });


router.get('/update', meController.update);
router.put('/:id', meController.handleUpdate);
router.patch('/update-image', upload.single('image'), meController.handleUpdateImage);
router.get('/', meController.index);

module.exports = router;
