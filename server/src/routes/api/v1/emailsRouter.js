import express from "express";

import { User } from "../../../models/index.js";

const emailsRouter = new express.Router();

emailsRouter.get("/verify/:verificationCode", async (req, res) => {
  const currentUserId = req.user?.id;
  const { verificationCode } = req.params;

  try {
    const currentUser = await User.query().findById(currentUserId);
    if (currentUser.verifiedEmail) {
      return res.status(200).json({message: "already verified"});
    }
    if (verificationCode.toString() === currentUser.verificationCode) {
      const updatedUser = await currentUser.$query().patch({ verifiedEmail: true });
      return res.status(200).json({ message: "success" });
    } else {
      return res.status(200).json({ message: "wrong code" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "failed" });
  }
});

export default emailsRouter;