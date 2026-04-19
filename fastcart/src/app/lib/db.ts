import { error } from "console";
import mongoose  from "mongoose";

const mongouri=process.env.MONGO_URI;

if(!mongouri){
    throw error ("Mongo uri not found")
}

let cached=global.mongoose

if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}
const connectDb=async()=>{
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise=mongoose.connect(mongouri).then((conn)=>conn.connection)
    }
    try{
        const conn=await cached.promise;  
        return conn;  

    }
    catch(error){
        console.log(error)

    }

}
export default connectDb;