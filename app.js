import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { ProductRouter } from "./routes/ProductRoutes.js";
import errorMiddleware from "./middleware/error.js";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import cookieParser from "cookie-parser";
import { OrderRouter } from "./routes/orderRoutes.js";
import fileUpload from "express-fileupload";

import { PaymentRouter } from "./routes/paymentRoutes.js";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "config/config.env" });
}
// dotenv.config({ path: "config/config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());

app.use("/api/v1", ProductRouter);
app.use("/api/v1", userRoutes);
app.use("/api/v1", OrderRouter);
app.use("/api/v1", PaymentRouter);
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
})


app.use(errorMiddleware);


export default app;
