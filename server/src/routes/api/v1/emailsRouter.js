import express from "express";
import AWS from "aws-sdk";

import { User } from "../../../models/index.js";

const emailsRouter = new express.Router();

emailsRouter.get("/test", (req, res) => {
  AWS.config.update({ region: 'us-east-2' });

  // Create sendEmail params 
  var params = {
    Destination: { /* required */
      // CcAddresses: [
      //   'EMAIL_ADDRESS',
      //   /* more items */
      // ],
      ToAddresses: [
        'vkk5252@gmail.com',
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        // Html: {
        //   Charset: "UTF-8",
        //   Data: "HTML_FORMAT_BODY"
        // },
        Text: {
          Charset: "UTF-8",
          Data: "Hi"
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test'
      }
    },
    Source: 'bt.recurring.task.scheduler@gmail.com', /* required */
    ReplyToAddresses: [
      'bt.recurring.task.scheduler@gmail.com'
      /* more items */
    ]
  };

  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function (data) {
      console.log(data.MessageId);
    }).catch(
      function (err) {
        console.error(err, err.stack);
      });

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
    res.status(400).json({ message: "failed"});
  }
});

export default emailsRouter;