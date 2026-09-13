import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

dotenv.config();

const client = new MongoClient(process.env.ATLASDB_URL);
await client.connect();
console.log("connected client for auth");

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  trustedOrigins: [
    "http://localhost:5173",
  ],
  socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
},
baseURL: process.env.BETTER_AUTH_URL,
});
