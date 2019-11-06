const express = require('express');
const router = express.Router();
const uploadImg = require('../public/javascripts/upload');

/* 上传图片 */
router.post('/', (req, res) => {
    uploadImg(req, res);
});

module.exports = router;