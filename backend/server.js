import express, { json } from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.routes.js";
import protectRoute from "./middleware/protectRoute.js";
import messegeRoutes from  "./routes/messege.routes.js";
import userRoutes from  "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongdb.js";

dotenv.config();
 
const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
}));

app.use(express.json()); // to parse incoming requists with json payload from req.bady
app.use(cookieParser());


app.use("/api/auth", authRoutes);  ///api/auth/logout

app.use("/api/messeges", protectRoute, messegeRoutes);

app.use("/api/users", protectRoute, userRoutes);


app.get("/" , (req, res)=>{
    res.send("hello word")
})


 

app.listen(PORT, ()=>{
    connectToMongoDB();
    console.log("server listining at port "+`${PORT}`)
})