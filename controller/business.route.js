const express = require("express");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {BusinessModel} = require("../model/business.model.js");
const {authenticatorUser} = require("../middleware/authenticate.js");
const { UserModel } = require("../model/users.model.js");
const cors = require("cors") 
const businessrouter = express.Router();
businessrouter.use(express.json());
businessrouter.use(cors())

businessrouter.get("/",async (req,res)=>{
    try {
        let allbusiness = await BusinessModel.find();
        res.send(allbusiness);
    } catch (error) {
        res.send({"msg":error.message});
    }
})

businessrouter.get("/filtered",async(req,res)=>{
    let loc = req.query.location;
    let sort = req.query.sort ; 
    // res.send({loc,sort})
    if(loc && sort){
        let business = await BusinessModel.find({location:{$regex:loc,$options:"i"}}).sort({price:sort});
        res.send(business);
    }else if(loc){
        let business = await BusinessModel.find({location:{$regex:loc,$options:"i"}})
        res.send(business);
    }else if(sort){
        let business = await BusinessModel.find().sort({price:sort});
        res.send(business);
    }else{
        res.send("invalid request");
    }
})

businessrouter.use(authenticatorUser);

businessrouter.get("/myservices",async (req,res)=>{
    try {
        let userID = req.body.userID;
        // let ID = req.params.id;
        let user = await UserModel.find({_id:userID});
        let services = user[0].services;
        
        let myservices = await BusinessModel.find({
            '_id': { 
              $in: services
            }
          })
        res.send(myservices);
    } catch (error) {
        res.send({"msg":error.message});
    }
})

businessrouter.patch("/add/:id",async (req,res)=>{
    let admin = req.body.admin;
    let userID = req.body.userID;
    try{
        let ID = req.params.id;
        let user = await UserModel.find({_id:userID});
        let services = user[0].services;
        if(services.includes(ID)){
            res.send({"msg":"This service is already availed"});
        }else{
            services.push(ID);
            await UserModel.findByIdAndUpdate({_id:userID},user[0]);
            res.send({"msg":"Service has been added"});
        }
    }catch(error){
        res.send({"msg":error.message});
    }

})

businessrouter.patch("/remove/:id",async (req,res)=>{
    let admin = req.body.admin;
    let userID = req.body.userID;
    try{
        let ID = req.params.id;
        let user = await UserModel.find({_id:userID});
        let services = user[0].services;
        let int = services.indexOf(ID);
            services.splice(int,1);
        await UserModel.findByIdAndUpdate({_id:userID},user[0]);
        res.send({"msg":"Service has been removed"});
    }catch(error){
        res.send({"msg":error.message});
    }

})

businessrouter.patch("/removeall",async (req,res)=>{
    let admin = req.body.admin;
    let userID = req.body.userID;
    try{
        let ID = req.params.id;
        let user = await UserModel.find({_id:userID});
        user[0].services = [];
        await UserModel.findByIdAndUpdate({_id:userID},user[0]);
        res.send({"msg":"Service has been Cleared",email:user[0].email});
    }catch(error){
        res.send({"msg":error.message});
    }

})


businessrouter.post("/create",async (req,res)=>{
    let admin = req.body.admin;
    // let userID = req.body.userID;
    // console.log(admin,userID);
    if(admin){
        try {
            let payload = req.body;
            let business = new BusinessModel(payload);
            await business.save();
            res.send({"msg":"Business has been added to database"});
        } catch (error) {
            res.send({"msg":error.message});
        }
    }else{
        res.send({"msg":"Access Denied","admin":false})
    }
})

businessrouter.patch("/update/:id",async (req,res)=>{
    let admin = req.body.admin;
    // let userID = req.body.userID;
   if(admin){
    try {
        let ID = req.params.id;
        let payload = {};
        if(req.body.name){
            payload.name = req.body.name ; 
        }
        if(req.body.price){
           payload.price = req.body.price ;
        }
        if(req.body.type){
           payload.type = req.body.type ; 
        }
        if(req.body.location){
           payload.location = req.body.location ;
        }

        await BusinessModel.findByIdAndUpdate({_id:ID},payload);
        res.send({"msg":"Business has been updated"});
    } catch (error) {
        res.send({"msg":error.message});
    }
   }else{
        res.send({"msg":"Access Denied","admin":false})
   }
})

businessrouter.delete("/delete/:id",async (req,res)=>{
    let admin = req.body.admin;
    // let userID = req.body.userID;
   if(admin){
    try {
        let ID = req.params.id;
        await BusinessModel.findByIdAndDelete({_id:ID});
        res.send({"msg":"Business has been deleted"});
    } catch (error) {
        res.send({"msg":error.message});
    }
   }else{
        res.send({"msg":"Access Denied","admin":false})
   }
})

module.exports = {businessrouter};
