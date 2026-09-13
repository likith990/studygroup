import express from "express";
import cookieParser from "cookie-parser";

const app=express();
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("welcome to root");
    console.log(req.cookies);
})

app.get("/getcookie",(req,res)=>{
    res.cookie("hello","value");
    res.send("welcome to cookie");
})

app.listen(8090,(req,res)=>{
    console.log("listening from 8090");
})