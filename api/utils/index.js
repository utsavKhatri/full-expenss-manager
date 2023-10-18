const {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
} = require('date-fns');

/**
 * Generates a welcome email template for a new user.
 *
 * @param {string} username - The username of the new user.
 * @param {string} loginpage - The URL of the login page.
 * @param {string} email - The email address of the new user.
 * @return {string} The HTML code for the welcome email template.
 */
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

/**
 * Calculates the percentage change between two values.
 * @param {number} oldValue - The old value.
 * @param {number} newValue - The new value.
 * @returns {number} The calculated percentage change between the old value and the new value.
 */
function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) {
    if (newValue === 0) {
      return 0; // Percentage change is 0 if both old and new values are 0
    } else {
      return 100; // Percentage change is infinite if old value is 0 and new value is non-zero
    }
  } else {
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  }
}

/**
 * Generates the start and end dates of a given interval.
 *
 * @param {string} interval - The interval for which to generate dates. Possible values are 'today', 'thisMonth', 'thisWeek', 'thisYear'.
 * @return {Object} An object containing the start and end dates of the interval.
 */
function getIntervalValue(interval) {
  let startDate;
  let endDate;

  switch (interval) {
    case 'today':
      startDate = startOfDay(new Date()).getTime();
      endDate = endOfDay(new Date()).getTime();
      break;

    case 'thisMonth':
      startDate = startOfMonth(new Date()).getTime();
      endDate = endOfMonth(new Date()).getTime();
      break;

    case 'thisWeek':
      startDate = startOfWeek(new Date()).getTime();
      endDate = endOfWeek(new Date()).getTime();
      break;

    case 'thisYear':
      startDate = startOfYear(new Date()).getTime();
      endDate = endOfYear(new Date()).getTime();
      break;

    default:
      startDate = null;
      endDate = null;
      break;
  }

  return {
    startDate,
    endDate,
  };
}

/**
 * Predicts future income based on a given array of income data using linear regression.
 * @param {number[]} totalAmount - An array of numbers representing the income data.
 * @returns {number[]} - An array containing the predicted future incomes based on the linear regression equation.
 */
function predictFutureData(totalAmount) {
  if (totalAmount.length < 3) {
    return [];
  }

  const predictedData = [];
  const lastIndex = totalAmount.length - 1;

  // Calculate the slope and intercept for the linear regression
  const sumX = totalAmount.reduce((acc, _, index) => acc + index, 0);
  const sumY = totalAmount.reduce((acc, val) => acc + val, 0);
  const sumXY = totalAmount.reduce((acc, val, index) => acc + index * val, 0);
  const sumX2 = totalAmount.reduce((acc, _, index) => acc + index ** 2, 0);

  const slope =
    (totalAmount.length * sumXY - sumX * sumY) /
    (totalAmount.length * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / totalAmount.length;

  // Predict the next incomes
  for (let i = 1; i <= 2; i++) {
    const nextIncome = slope * (lastIndex + i) + intercept;
    predictedData.push(nextIncome);
  }

  return predictedData;
}

function calculateTotalPercentageChange(transactions) {
  let totalPercentageChange = 0;

        for (let i = 0; i < transactions.length - 1; i++) {
          const oldValue = transactions[i].amount;
          const newValue = transactions[i + 1].amount;
          totalPercentageChange += ((newValue - oldValue) / oldValue) * 100;
        }

        return totalPercentageChange / (transactions.length - 1);
}

module.exports = {
  WelcomeEmailTemp,
  calculatePercentageChange,
  getIntervalValue,
  predictFutureData,
  calculateTotalPercentageChange
};
