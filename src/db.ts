import { Db, MongoClient } from "mongodb";

let db: Db;

export default async function getDb() {
    if (!db) {
        try {
            db = (await new MongoClient(process.env.MONGO_URI).connect()).db();
        } catch (e) {
            console.error(e);
        }
    }
    return db;
}