const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/NvtShop_sport_dev');
        console.log('Connect successfuly !!!');
    } catch (err) {
        console.log('Connect fail !!!. Error: ' + err);
    }
}

module.exports = { connect };
