import express from "express";
import AWS from "aws-sdk";

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

export default emailsRouter;