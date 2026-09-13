import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  authUserId: {
    type: String,
    required: true,
    unique: true,
  },
  educationlevel: {
    type:String,
    
  },
  bio: {
    type:String,
    
  },
  targetexams: {
    type:String,
    
  },
});

const User= mongoose.model("User",userSchema);
export default User;
