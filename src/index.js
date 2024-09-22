const express = require('express');
const morgan = require('morgan');
const { engine, create } = require('express-handlebars');
const path = require('path');
const route = require('./routes/index');
const bodyParse = require('body-parser');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
const session = require('express-session');

const db = require('./config/db');
//connect to DB
db.connect();

const app = express();
//không lấy đc cái index này
const port = 3000;

const hbs = create({
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        }
    }
});

//cart
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }
}));

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => {
                return a + b;
            },
            percent: (a, b) => {
                return Math.round(((a - b) / a) * 100);
            },
            getUserNameComment: (userId, users)=>{
                var result
                for (var user in users) {
                    if(userId.includes(user._id)){
                        result = user.name;
                    }
                }
                // var result = users.find(function(user){
                //     var a = userId.includes(user._id)
                //     return a.name
                // });
                return result;
            },
            multi: (a, b)=>{
                return a*b;
            },
            json: a => {
                return JSON.stringify(a);
            },
            compare: (a, b)=>{
                if(a > b) return true;
                return false;
            },
            range: (start, end)=>{
              let arr = [];
              for (let i = start; i <= end; i++) {
                  arr.push(i);
              }
              return arr;
            },
            eq: (a, b)=>{
              return a===b;
            },
            decrement: (value)=>{
              return parseInt(value) - 1; 
            },
            increment: (value)=>{
              return parseInt(value) + 1;
            },
            gt: (a, b)=>{
              return a > b;
            },
            lt: (a, b)=>{
              return a < b;
            }
        },
    }),
);
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
});

app.use(morgan('combined'));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(bodyParse.urlencoded());
app.use(bodyParse.json());

//Route init

route(app);

app.listen(port, () => {
    console.log(`App listening at  http://localhost:${port}`);
});
