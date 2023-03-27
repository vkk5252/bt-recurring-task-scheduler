import express from "express";

import { User } from "../../../models/index.js";

const emailsRouter = new express.Router();

emailsRouter.get("/test", async (req, res) => {
  const currentUserId = req.user?.id;
  const currentUser = await User.query().findById(currentUserId);

  currentUser.sendBTVerificationEmail();

  return res.status(200).json({ message: "test" });
});

emailsRouter.get("/verify/:verificationCode", async (req, res) => {
  const currentUserId = req.user?.id;
  const { verificationCode } = req.params;

  try {
    const currentUser = await User.query().findById(currentUserId);
    console.log(currentUser);
    if (verificationCode.toString() === currentUser.verificationCode) {
      const updatedUser = await currentUser.$query().patch({ verifiedEmail: true });
      res.status(200).json({ message: "success" });
    } else {
      res.status(200).json({ message: "wrong code" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed" });
  }
});

export default emailsRouter;