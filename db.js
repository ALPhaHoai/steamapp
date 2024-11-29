import { MongoClient } from "mongodb";

export const collection = {};

export async function connect() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db("SteamAppDatabase");
  collection.SteamApp = db.collection("SteamApp");
  await collection.SteamApp.createIndex({ appId: 1 }, { unique: true });

}
