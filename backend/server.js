import path from "path";
import express, { json } from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoutes from "./routes/auth.routes.js";
import protectRoute from "./middleware/protectRoute.js";
import messegeRoutes from  "./routes/messege.routes.js";
import userRoutes from  "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongdb.js";

import { app, server } from "./socket/socket.js";
dotenv.config();
 

const __dirname = path.resolve();

const PORT = process.env.PORT || 5001;
 

var corsOptions = {
    origin: "http://localhost:3000"
  }
  app.use(cors(corsOptions));

app.use(express.json()); // to parse incoming requists with json payload from req.bady
app.use(cookieParser());


app.use("/api/auth", authRoutes);  ///api/auth/logout

app.use("/api/messeges", protectRoute, messegeRoutes);

app.use("/api/users", protectRoute, userRoutes);

 



app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

 

server.listen(PORT, ()=>{
    connectToMongoDB();
    console.log("server listining at port "+`${PORT}`)
})