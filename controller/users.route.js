const express = require("express");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel} = require("../model/users.model.js");

const cors = require("cors") 

const userrouter = express.Router();
userrouter.use(cors())
userrouter.use(express.json());

userrouter.get("/",async (req,res)=>{
    try {
        let allusers = await UserModel.find();
        res.send(allusers)
    } catch (error) {
        res.send({"msg":error.message});
    }
})

userrouter.post("/register",async (req,res)=>{
    try {
        let email = req.body.email;
        let password = req.body.password;
        let ifexists = await UserModel.find({email:email});
        
        if(!req.body.name){
            res.send({"msg":"Please provide the information about name"})
        }else if(ifexists.length){
            res.send({"msg":"User already exist, please login"});
        }else{
            bcrypt.hash(password, 5, (err, hash)=>{
                // Store hash in your password DB.
                if(err){
                    res.send({"msg":"something Went wrong",error:err});
                }else{
                    req.body.password = hash;
                    req.body.admin = false;
                    req.body.services = [];
                    const newuser = new UserModel(req.body);
                    // console.log(newuser);
                    newuser.save()
                    res.send({"msg":"User registered successfully"});
                }
            });
        }

    } catch (error) {
         res.send({"msg":error.message});
    }
})

userrouter.post("/newadmin",async (req,res)=>{
    try {
        let email = req.body.email;
        let password = req.body.password;
        let ifexists = await UserModel.find({email:email});

        if(ifexists.length){
            res.send({"msg":"Admin already exist, please login"});
        }else{
            bcrypt.hash(password, 5, (err, hash)=>{
                // Store hash in your password DB.
                if(err){
                    res.send({"msg":"something Went wrong",error:err});
                }else{
                    req.body.password = hash;
                    req.body.admin = true;
                    req.body.services = [];
                    const newuser = new UserModel(req.body);
                    // console.log(newuser);
                    newuser.save()
                    res.send({"msg":"Admin registered successfully"});
                }
            });
        }

    } catch (error) {
         res.send({"msg":error.message});
    }
})

userrouter.post("/login",async (req,res)=>{
    try {
        let email = req.body.email;
        let password = req.body.password;
        let ifexists = await UserModel.find({email:email});

        if(ifexists.length){
            bcrypt.compare(password, ifexists[0].password, (err, result)=>{
                // result == true
                if(err){
                    res.send({"msg":"something Went wrong",error:err});
                }else{
                    if(result){
                        let token = jwt.sign({userID:ifexists[0]._id,admin:ifexists[0].admin},process.env.secretkey);
                        res.send({"msg":"User Logged In successfully",token:token});
                    }else{
                        res.send({"msg":"Wrong Credentials"});
                    }
                }
            });
        }else{
            res.send({"msg":"Wrong Credentials"});
        }

    } catch (error) {
        res.send({"msg":error.message});
    }
})


module.exports = {userrouter};