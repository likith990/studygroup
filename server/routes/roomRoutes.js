import express from "express";
import Room from "../models/room.js";
import User from "../models/user.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // console.log("im here to get rooms");

  const rooms = await Room.find();
  res.json(rooms);
});

router.post("/",requireAuth, async (req, res) => {
  // console.log("im in the api to create room");
  const { data} = req.body; //the userId i get here is the object id of a doc inside user collection made by betterauth
  const user = await User.find({
    authUserId: req.authUserId
  });

  if (!data?.starttime || new Date(data.starttime).getTime() <= Date.now()) {
    return res.status(400).json({ error: "Start time has to be in the future." });
  }

  const newroom = { ...data, owner: user[0]._id, ownername: user[0].name };
  const newRoom = new Room(newroom);

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  newRoom.meetlink = `${clientUrl}/${newRoom._id}`;

  await newRoom.save();
  res.json(newRoom);
});

router.post("/myroom",requireAuth,async(req,res)=>{
  // console.log("get my rooms");
  const authid=req.authUserId;
  const user=await User.findOne({authUserId:authid});
  const userId=user._id;

  const posted=await Room.find({owner:userId});
  const requested=await Room.find({"requests.user":userId});
  

  res.json({posted,requested});

})

router.post("/request",requireAuth,async(req,res)=>{
  // console.log("here to modify roomSchema");
  const{roomid}=req.body;
  const authid=req.authUserId
  const user=await User.findOne({authUserId:authid});
  const userId=user._id;

  const room=await Room.findById(roomid);

  if (room.owner.toString() === userId.toString()) {
    return res.status(400).json({ error: "Can't apply to your own room" });
  }

  // Covers both a still-pending/accepted request AND the edge case where a
  // user is somehow in `booked` without a matching `requests` entry -
  // either way they shouldn't be able to send a second request.
  const alreadyApplied = room.requests.some(r => r.user.toString() === userId.toString());
  const alreadyBooked = room.booked.some(b => b.user.toString() === userId.toString());
  if (alreadyApplied || alreadyBooked) {
    return res.status(400).json({ error: "Already applied" });
  }

  room.requests.push({user:userId,status:"pending",requsername:user.name,authid:authid});
  await room.save();

  res.json({ message: "Request sent", requests: room.requests });


});


router.post("/accept",requireAuth, async(req,res)=>{
  const{roomid,reqid}=req.body;
  const authid=req.authUserId;

  const user=await User.findOne({authUserId:authid});
  const room=await Room.findById(roomid);
  const userid=user._id;
  if (!room.owner.equals(userid)) {
    return res.status(403).json({ error: "Not authorized to manage this room" });
  }

  const request = room.requests.find((r) => r.user.equals(reqid));
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  if (request.status === "accepted") {
    return res.status(400).json({ error: "Already accepted" });
  }

  const bookedCount = room.booked.length;
  if (bookedCount >= room.capacity) {
    return res.status(400).json({ error: "Room is already full" });
  }

  const requser=await User.findOne({_id:reqid});

  request.status = "accepted";
  // NOTE: this used to push the host's own userid instead of the
  // requester's - fixed so `booked` actually reflects who is coming.
  room.booked.push({
    user: reqid,
    bookedname: requser.name,
  });

  await room.save();
  res.status(200).json(room);

})

router.post("/deny",requireAuth, async(req,res)=>{
  const{roomid,reqid}=req.body;
  const authid=req.authUserId;

  const user=await User.findOne({authUserId:authid});
  const room=await Room.findById(roomid);
  const userid=user._id;
  if (!room.owner.equals(userid)) {
    return res.status(403).json({ error: "Not authorized to manage this room" });
  }

  const request = room.requests.find((r) => r.user.equals(reqid));
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  // If they'd already been accepted (and are in `booked`), free their seat.
  room.booked = room.booked.filter((b) => b.user.toString() !== reqid.toString());
  request.status = "rejected";

  await room.save();
  res.status(200).json(room);

})

router.post("/cancel-request",requireAuth, async(req,res)=>{
  // Lets an attendee withdraw their own pending request.
  const{roomid}=req.body;
  const authid=req.authUserId;

  const room=await Room.findById(roomid);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const request = room.requests.find((r) => r.authid === authid);
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  if (request.status === "accepted") {
    return res.status(400).json({ error: "Already accepted - use leave instead" });
  }

  room.requests = room.requests.filter((r) => r.authid !== authid);
  await room.save();
  res.status(200).json(room);

})

router.post("/leave",requireAuth, async(req,res)=>{
  // Lets an accepted attendee give up their seat, freeing it back up.
  const{roomid}=req.body;
  const authid=req.authUserId;

  const user=await User.findOne({authUserId:authid});
  const room=await Room.findById(roomid);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  const userid=user._id;

  room.booked = room.booked.filter((b) => b.user.toString() !== userid.toString());
  room.requests = room.requests.filter((r) => r.authid !== authid);

  await room.save();
  res.status(200).json(room);

})

router.post("/delete",requireAuth, async(req,res)=>{
  // Lets a host cancel/delete a room they created. Unlike hiding ended
  // rooms in the UI, this is an explicit destructive action the host asked
  // for, so an actual delete is appropriate here.
  const{roomid}=req.body;
  const authid=req.authUserId;

  const user=await User.findOne({authUserId:authid});
  const room=await Room.findById(roomid);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  if (!room.owner.equals(user._id)) {
    return res.status(403).json({ error: "Not authorized to delete this room" });
  }

  await Room.findByIdAndDelete(roomid);
  res.status(200).json({ message: "Room deleted" });

})

router.get("/:roomid/access", requireAuth, async(req,res)=>{
  // Used by the video-call page to decide whether the visitor is actually
  // allowed in - the host or an accepted attendee - instead of anyone with
  // the link being able to join.
  const { roomid } = req.params;
  const authid = req.authUserId;

  try {
    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ authorized: false, error: "Room not found" });
    }

    const user = await User.findOne({ authUserId: authid });
    if (!user) {
      return res.status(404).json({ authorized: false, error: "User not found" });
    }

    const isHost = room.owner.equals(user._id);
    const isBooked = room.booked.some((b) => b.user.toString() === user._id.toString());

    return res.json({
      authorized: isHost || isBooked,
      isHost,
      room: { title: room.title, topic: room.topic, starttime: room.starttime, duration: room.duration },
    });
  } catch (err) {
    console.error("Access check failed:", err);
    return res.status(400).json({ authorized: false, error: "Invalid room" });
  }
})

export default router;
