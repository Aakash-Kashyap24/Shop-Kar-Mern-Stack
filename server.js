import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import connectDB from "./config/connectDB.js";
import uncaughtExceptionHandler from "./middleware/uncaughtExceptionHandler.js";
import unhandledRejectionHandler from "./middleware/uncaughtRejectionHandler.js";

if (process.env.NODE_ENV !== "production") {
  
  dotenv.config({ path: "config/config.env" });
  
}

connectDB();
cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }
)
const server = app.listen(process.env.PORT||5000, () => {
  console.log(
    `server is listening on port  http://localhost:/${process.env.PORT||5000}`
  );
});

process.on("uncaughtException", (error) => {
  uncaughtExceptionHandler(error, server);
});

app.get("/", (req, res) => {
  res.json({
    message: "working fine",
  });

  process.on("unhandledRejection", (error) => {
    unhandledRejectionHandler(error);
  });
});
