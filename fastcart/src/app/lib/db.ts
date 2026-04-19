import mongoose from "mongoose";

const mongouri = process.env.MONGO_URI;

if (!mongouri) {
    throw new Error("Mongo uri not found");
}

let cached=global.mongoose

if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}
const connectDb = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        console.log("LOG: Initiating MongoDB connection...");
        cached.promise = mongoose.connect(mongouri, opts).then((mongoose) => {
            console.log("LOG: MongoDB connected successfully!");
            return mongoose.connection;
        });
    }
    try {
        const conn = await cached.promise;
        return conn;
    }
    catch (error: any) {
        cached.promise = null;
        console.error("DB CONNECTION ERROR:", error.message);
        if (error.message.includes("ENOTFOUND")) {
            console.error("CRITICAL: DNS Resolution failed. Consider switching to a non-SRV connection string.");
        }
        throw error;
    }
};
export default connectDb;