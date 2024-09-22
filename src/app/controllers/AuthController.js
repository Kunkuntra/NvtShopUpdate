const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user.model");
const bodyparser = require("body-parser");
dotenv.config();
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const mongoose = require("mongoose");
let refreshTokens = [];
const alert = require("alert");

class AuthController{
    //[GET] Sign up
    signup(req, res, next){
        res.render('user/signup')
    }
    //[GET] Sign in
    signin(req, res, next){
        res.render('user/signin')
    }
    // Register
    async registerUser(req, res){
        // res.json(req.body)
        try {
            var email = req.body.email;
            var name = req.body.name;
            var address = req.body.address;
            var password = req.body.password;
            var phonenumber = req.body.phonenumber;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res
                .status(409)
                .render('Notify/signupFail');
            }
            const user = User.create({
                email : email,
                password : password,
                name : name,
                phonenumber : phonenumber,
                address : address
            });
            return res.status(200).render('Notify/signupSuccess');
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    //[POST] /auth/login
    async loginUser(req, res) {
        try {
        // console.log(req.body);
        var email = req.body.email;
        var password = req.body.password;
        await User.findOne({ 
            email : email,
            password : password
        })
        .then(data=>{
            if(data){
                const token = jwt.sign(
                    {
                        _id: data._id,
                        admin: data.admin,
                        name: data.name,
                    },'mk');
                return res.json(token);
            }
        })
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Server error", detailed: error.message });
        }
    }
}

module.exports = new AuthController();