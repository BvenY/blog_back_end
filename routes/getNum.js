let express = require('express');
let router = express.Router();
const connection = require('../public/javascripts/database');
const returnValue = require('../public/javascripts/return');
let token = require('../public/javascripts/token');

router.get('/', token,(req, res) => {
    if (req.userType != 1 && req.userType != 520) {
        let permission = new returnValue.Permission(null);
        return res.json(permission);
    }
    // 定义SQL语句
    const sqlBlog = `SELECT COUNT(*) FROM blog`;
    connection.query(sqlBlog,(err, results) => {
        try{
            let blogNum = JSON.parse(JSON.stringify(results))[0]['COUNT(*)'];
            const sqlUser = `SELECT COUNT(*) FROM user`;
            connection.query(sqlUser, (err, results) => {
                try {
                    let userNum = JSON.parse(JSON.stringify(results))[0]['COUNT(*)'];
                    const sqlComment = `SELECT COUNT(*) FROM comments`;
                    connection.query(sqlComment, (err, results) => {
                        try {
                            let commentNum = JSON.parse(JSON.stringify(results))[0]['COUNT(*)'];
                            class number{
                                constructor(blogNum, userNum, commentNum) {
                                    this.blogNum = blogNum;
                                    this.userNum = userNum;
                                    this.commentNum = commentNum;
                                }
                            }
                            let num = new number(blogNum, userNum, commentNum);
                            let success = new returnValue.Success(num);
                            res.json(success);
                        }
                        catch{
                            let error = new returnValue.Error(err);
                            console.log(err);
                            return res.json(error);
                        }
                    });
                }
                catch{
                    let error = new returnValue.Error(err);
                    console.log("11");
                    return res.json(error);
                }
            });
        }
        catch{
            let error = new returnValue.Error(err);
            console.log("1111");
            return res.json(error);
        }
    });
});

module.exports = router;


