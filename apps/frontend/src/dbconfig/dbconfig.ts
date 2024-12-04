import mongoose from "mongoose";

export async function connectDB() {
  try {
    // await mongoose.connect(process.env.MONGO_URI!);
    await mongoose.connect(
      "mongodb+srv://akashsikakou:p%2Am%40.F98jrG%40LNn@cluster0.avscl.mongodb.net/",
    );
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });
    connection.on("error", (error) => {
      console.log("MongoDB connection failed", error);
      process.exit(1);
    });
  } catch (error) {
    console.log("MongoDB connection failed");
  }
}
