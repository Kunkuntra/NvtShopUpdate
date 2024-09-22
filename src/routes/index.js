const newsRouter = require('./news.route');
const siteRouter = require('./site.route');
const productRouter = require('./product.route');
const storedRouter = require('./stored.route');
const trashRouter = require('./trash.route');
const userRouter = require('./user.route');
const authRoute = require('./auth.route');
const cartRoute = require('./cart.route');
const meRoute = require('./me.route');
const orderRoute = require('./order.route');
const statisticRouter = require('./statistic.route');
const jwt = require("jsonwebtoken");

module.exports = (app) => {
    app.use('/news', (req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    }, newsRouter);
    app.use('/product', productRouter);
    app.use('/stored', (req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    }, (req, res, next)=>{
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        if (!result.admin){
            res.json('Bạn không đủ quyền' )
        }
        next();

    },storedRouter);
    app.use('/trash', (req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    }, (req, res, next)=>{
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        if (!result.admin){
            res.json('Bạn không đủ quyền' )
        }
        next();

    }, trashRouter);
    app.use('/user', userRouter);
    app.use('/auth', authRoute);
    app.use('/cart', (req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    }, cartRoute);
    app.use('/me', (req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    }, meRoute);
    app.use('/order',(req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    },orderRoute);
    app.use('/statistic', (req, res, next)=>{
        var token = req.cookies.token;
        try{
            var result = jwt.verify(token, 'mk');
            if (result){
                next();
            }
        }
        catch(err){
            res.redirect('/auth/signin')
        }

    }, (req, res, next)=>{
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        if (!result.admin){
            res.json('Bạn không đủ quyền' )
        }
        next();

    }, statisticRouter);
    app.use('/', siteRouter);
    
};
