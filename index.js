const express = require("express");
require("dotenv").config();
const cors = require("cors") 

const {connection} = require("./db.js")
const {userrouter} = require("./controller/users.route.js");
const {businessrouter} = require("./controller/business.route.js")

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",userrouter);
app.use("/business",businessrouter);

app.get("/",(req,res)=>{
    res.send("HOME PAGE");
})

app.listen(process.env.port,async ()=>{
    try{
        await connection;
        console.log({"msg":"Server connected to Mongo DB"});
    }catch(error){
        console.log({"msg":error});
    }
})