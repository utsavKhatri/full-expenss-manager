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
  const categories = [
    "643fce35569a635b776fd002",
    "643fce50706bb35bb80a8e67",
    "643fce57706bb35bb80a8e68",
    "643fce5c706bb35bb80a8e69",
    "643fce60706bb35bb80a8e6a",
    "643fce65706bb35bb80a8e6b",
    "643fce69706bb35bb80a8e6c",
    "643fce7f706bb35bb80a8e6d",
    "643fce84706bb35bb80a8e6e",
    "643fce97706bb35bb80a8e6f",
    "643fce9e706bb35bb80a8e70",
    "643fcea3706bb35bb80a8e71",
    "643fceaa706bb35bb80a8e72",
    "643fe5466871c673ca25e253",
    "643fe5466871c673ca25e254",
    "643fe5466871c673ca25e255",
    "643fe5466871c673ca25e256",
    "643fe5466871c673ca25e257",
    "643fe5466871c673ca25e258",
    "643fe5466871c673ca25e259",
    "643fe5466871c673ca25e25a",
    "643fe5466871c673ca25e25b",
    "643fe5466871c673ca25e25c",
    "643fe5466871c673ca25e25d",
    "643fe5466871c673ca25e25e",
    "643fe5466871c673ca25e25f",
    "643fe5466871c673ca25e260",
    "643fe5466871c673ca25e261",
    "643fe5466871c673ca25e262",
    "643fe5466871c673ca25e263",
    "643fe5466871c673ca25e264",
    "643fe5466871c673ca25e265",
    "643fe5466871c673ca25e266",
    "643fe5466871c673ca25e267",
    "643fe5466871c673ca25e268",
    "643fe5466871c673ca25e269",
    "643fe5466871c673ca25e26a",
    "643fe5466871c673ca25e26b",
    "643fe5466871c673ca25e26c",
    "643fe5466871c673ca25e26d",
    "643fe5466871c673ca25e26e",
    "643fe5466871c673ca25e26f",
    "643fe5466871c673ca25e270",
    "643fe5466871c673ca25e271",
    "643fe5466871c673ca25e272",
    "643fe5466871c673ca25e273",
    "643fe5466871c673ca25e274",
    "643fe5466871c673ca25e275",
    "643fe5466871c673ca25e276",
    "643fe5466871c673ca25e277",
    "643fe5466871c673ca25e278",
    "643fe5466871c673ca25e279",
    "643fe5466871c673ca25e27a",
    "643fe5466871c673ca25e27b",
    "643fe5466871c673ca25e27c",
    "643fe5466871c673ca25e27d",
    "643fe5466871c673ca25e27e",
    "643fe5466871c673ca25e27f",
    "643fe5466871c673ca25e280",
    "643fe5466871c673ca25e281",
    "643fe5466871c673ca25e282",
    "643fe5466871c673ca25e283",
    "643fe5466871c673ca25e284",
    "643fe5466871c673ca25e285",
  ];

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
