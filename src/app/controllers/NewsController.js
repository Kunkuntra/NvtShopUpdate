const jwt = require("jsonwebtoken");

class NewsController {
    //[GET] /news
    index(req, res) {
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        res.json(result);
        res.render('news', {
            result: result
        });
    }

    //[GET] /news/:slug
    show(req, res) {
        res.send('NEWS DETAIL !!!!!');
    }
}

module.exports = new NewsController();
