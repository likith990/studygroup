
import express from "express";
import User from "../models/user.js";
import Room from "../models/room.js";
import mongoose from "mongoose";
import { requireAuth } from "../middlewares/requireAuth.js";

const router=express.Router();

router.post("/check",requireAuth, async (req, res) => {
  // console.log("im here to check if user is old or new");
  
  const userId = req.authUserId;
  const db = mongoose.connection.db;

  const isuser = await db.collection("users").findOne({
    authUserId:userId
  });
  if (isuser == null) {
    // console.log("user doesnt exist");

    const authuser = await db.collection("user").findOne({
      _id: new ObjectId(userId),
    });

    const newuser = new User({
      name: authuser.name,
      email: authuser.email,
      authUserId: authuser._id,
    });
    await newuser.save();
    // console.log("new user was saved");
    res.json(newuser);

  } else {
    // console.log("user exists");
    res.json(isuser);
  }
});

export default router;