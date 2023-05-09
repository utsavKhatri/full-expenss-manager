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
      isIncome:faker.datatype.boolean(),
      createdAt: faker.date.between('2020-01-01T00:00:00.000Z', '2023-06-01T00:00:00.000Z'),
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

module.exports = { createToken, mailData, generateData, generateRandomNames };
