/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt");
const unique = require("objection-unique");
const Model = require("./Model");

const AWS = require("aws-sdk");

const saltRounds = 10;

const uniqueFunc = unique({
  fields: ["email"],
  identifiers: ["id"],
});

class User extends uniqueFunc(Model) {
  static get tableName() {
    return "users";
  }

  set password(newPassword) {
    this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds);
  }

  authenticate(password) {
    return Bcrypt.compareSync(password, this.cryptedPassword);
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email"],

      properties: {
        email: { type: "string" },
        cryptedPassword: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    const { Task } = require("./index.js");

    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: "users.id",
          to: "tasks.userId"
        }
      }
    };
  }

  $formatJson(json) {
    const serializedJson = super.$formatJson(json);

    if (serializedJson.cryptedPassword) {
      delete serializedJson.cryptedPassword;
    }

    return serializedJson;
  }

  sendSESVerificationEmail() {
    var verifyEmailPromise = new AWS.SES({ apiVersion: '2010-12-01' }).verifyEmailIdentity({ EmailAddress: this.email }).promise();

    verifyEmailPromise.then(
      function (data) {
        console.log("Email verification initiated");
      }).catch(
        function (err) {
          console.error(err, err.stack);
        });
  }

  sendBTVerificationEmail() {
    AWS.config.update({ region: 'us-east-2' });

    var params = {
      Destination: {
        ToAddresses: [this.email]
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test'
        },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: "Test"
          }
        }
      },
      Source: 'bt.recurring.task.scheduler@gmail.com',
      ReplyToAddresses: ['bt.recurring.task.scheduler@gmail.com']
    };

    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    sendPromise.then(
      function (data) {
        console.log(data.MessageId);
      }).catch(
        function (err) {
          console.error(err, err.stack);
        });
  }
}

module.exports = User;
