import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  starttime: {
    type: Date,
    required: true,
  },
  topic: {
    type: String,
  },
  capacity: {
    type: Number,
    default: 2,
  },

  duration: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  meetlink: {
    type: String,
  },
  requests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      authid:String,
      requsername:String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      requestedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  booked: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      bookedname:String,
    },
  ],
  ownername:String,
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
