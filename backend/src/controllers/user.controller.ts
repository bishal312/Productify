import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "unauthorized user!" });

    const { email, name, imageUrl } = req.body;

    if (!email || !name || !imageUrl) {
      return res.status(400).json("Email, Name and image are required!");
    }
    const user = await queries.createUser({
      id: userId,
      email,
      name,
      imageUrl,
    });
    return res
      .status(200)
      .json({ message: "user synced successfully, ", user });
  } catch (error) {
    console.error("Error occured while syncing user: ", error);
    return res.status(500).json({ error: "Failed to sync user from clerk!" });
  }
};
