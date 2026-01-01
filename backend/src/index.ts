import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware()); //auth check
app.use(express.json()); //parses JSON request bodies
app.use(express.urlencoded({ extended: true })); //parses form data (like HTML forms).
app.get("/", (req, res) => {
  res.json({ success: true, message: "hello" });
});

app.listen(ENV.PORT, () => {
  console.log("server running at port no: 3000");
});
