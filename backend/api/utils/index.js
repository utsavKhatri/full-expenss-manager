var jwt = require("jsonwebtoken");
const { faker } = require("@faker-js/faker");

const maxAge = 3 * 24 * 60 * 60;
/**
 * It takes an id as an argument and returns a token that expires in 24 hours
 * @param {Number} - The user's id
 * @returns A token is being returned.
 */
const createToken = (id) => {
  const payload = { id: id.toString() };
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: maxAge,
  });
};
/* A constant that holds the mailtrap credentials. */
const mailData = {
  service: "gmail",
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASS,
  },
};
async function generateData(numEntries, tID, currentUser) {
  const damta = await Category.find();
  const categories = damta.map((element) => {
    return element.id;
  });

  let data = { data: [] };

  for (let i = 0; i < numEntries; i++) {
    let category = await categories[
      Math.floor(Math.random() * categories.length)
    ];
    let entry = {
      text: faker.finance.transactionDescription(),
      amount: faker.finance.amount(),
      transfer: faker.name.fullName(),
      category: category,
      account: tID,
      by: currentUser,
      updatedBy: currentUser,
      isIncome: faker.datatype.boolean(),
      createdAt: faker.date.between(
        "2022-01-01T00:00:00.000Z",
        "2023-06-01T00:00:00.000Z"
      ),
    };
    data["data"].push(entry);
  }

  return data;
}
function generateRandomNames(numNames) {
  const allNames = new Array(numNames * 2)
    .fill()
    .map(() => faker.name.fullName());
  return allNames.slice(0, numNames);
}
/**
 * Generates an HTML email template for sharing an account.
 *
 * @param {string} currentUsername - The username of the current account holder.
 * @param {string} sharedUsername - The username of the account being shared.
 * @param {string} email - The email address of the recipient.
 * @return {string} - The HTML email template.
 */
function AccountShareMail(currentUsername, accName, email) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Shared Successfully</title>
    <style>
      /* Fonts */
      @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');
  
      /* Email styles */
      body {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background-color: #2672FF;
        padding: 20px;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .header h1 {
        margin: 0;
        font-size: 30px;
        color: #FFFFFF;
        font-weight: 700;
      }
      .content {
        padding: 30px;
        background-color: #FFFFFF;
        border: 1px solid #DDDDDD;
        border-radius: 5px;
      }
      .content p {
        margin: 0;
      }
      .content p b {
        font-weight: 700;
      }
      .footer {
        background-color: #F2F2F2;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Account Shared Successfully</h1>
      </div>
      <div class="content">
        <p><b>Hello ${currentUsername},</b></p>
        <p>You have successfully shared your account <b>${accName}</b> with ${email}.</p>
      </div>
      <div class="footer">
        <p>This email was sent by Expense Manager.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

function RevicerAccShareMail(sharedUserEmail, currentUseremail, accName, id) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Expense Manager - Account Shared</title>
    <style>
      /* Fonts */
      @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');
  
      /* Typography */
      body {
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      h1, h2, h3, h4, h5, h6 {
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 10px;
      }
      p {
        margin-top: 0;
        margin-bottom: 10px;
      }
      a {
        color: #fff;
        text-decoration: none;
      }
  
      /* Container */
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        background-color: #f6f6f6;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
      }
  
      /* Header */
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        font-size: 30px;
        margin-top: 0;
        margin-bottom: 0;
        color: #0056b3;
      }
  
      /* Body */
      .body {
        margin-bottom: 30px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 20px 0;
      }
      .body p {
        font-size: 18px;
        margin-top: 0;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #0056b3;
        color: #fff;
        font-size: 18px;
        padding: 12px 24px;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.2s ease;
      }
      .btn:hover {
        background-color: #003d80;
      }
  
      /* Footer */
      .footer {
        text-align: center;
        margin-top: 20px;
        color: #999;
      }
      .footer p {
        font-size: 14px;
        margin-top: 0;
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Expense Manager</h1>
      </div>
      <div class="body">
        <p>Hello ${sharedUserEmail},</p>
        <p>${currentUseremail} has shared the "${accName}" account with you.</p>
        <p>Click the button below to view the account's transaction page:</p>
        <p><a href="http://localhost:1337/viewTransaction/${id}" class="btn">View Transaction Page</a></p>
        <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:expensemanager27@gmail.com">expensemanager27@gmail.com</a>.</p>
      </div>
      <div class="footer">
        <p>© 2023 Expense Manager. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
function WelcomeEmailTemp(username, loginpage, email) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to Expense Manager</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #F2F2F2;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #FFFFFF;
        border-radius: 10px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        font-size: 36px;
        margin: 0;
        color: #2672FF;
      }
      .content {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        background-color: #2672FF;
        color: #FFFFFF;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        padding: 12px 30px;
        border-radius: 30px;
        text-decoration: none;
        transition: background-color 0.2s ease;
      }
      .button:hover {
        background-color: #214B8F;
        color:#fff;
      }
      .footer {
        font-size: 14px;
        color: #999999;
        text-align: center;
        margin-top: 30px;
      }
      .footer p {
        margin: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Expense Manager!</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for signing up for Expense Manager. We're excited to have you as a user!</p>
        <p>With Expense Manager, you can easily track your expenses and stay on top of your budget. To get started, simply log in to your account and start adding your expenses.</p>
        <p>Log in to your account by clicking the button below:</p>
        <a href="${loginpage}" class="button">Log In</a>
      </div>
      <div class="footer">
        <p>This email was sent to <strong>${email}</strong>. If you did not sign up for Expense Manager, please ignore this email.</p>
        <p>If you have any questions or need assistance, feel free to contact our support team at support@expensemanager.com.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = {
  createToken,
  mailData,
  generateData,
  generateRandomNames,
  AccountShareMail,
  RevicerAccShareMail,
  WelcomeEmailTemp,
};
