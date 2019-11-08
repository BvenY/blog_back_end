const express = require('express');
const router = express.Router();
const returnValue = require('../public/javascripts/return');
const uploadImg = require('../public/javascripts/upload');
let token = require('../public/javascripts/token');

/* 上传图片 */
router.post('/', token,(req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    uploadImg(req, res);
});

module.exports = router;