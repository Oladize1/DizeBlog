import mongoose from "mongoose";

export const connectDB = async (URI) => {
    try {
        const conn = await mongoose.connect(URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error);
        
    }
}