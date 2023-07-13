const csv = require("csvtojson");
const xlsx = require("xlsx");

module.exports = {
  friendlyName: "File processing",

  description: "Process file and return data",

  inputs: {
    fileData: {
      type: "ref",
      required: true,
    },
    userId: {
      type: "string",
      required: true,
    },
    tID: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const { fileData, userId, tID } = inputs;
    let dataArr = [];
    let rejectedRowCount = 0;
    const validHeaders = {
      text: "String",
      amount: "Number",
      transfer: "String",
      category: "ObjectId",
      isIncome: "Boolean",
      createdAt: "Date",
    };

    if (fileData.mimetype === "text/csv") {
      const csvArr = await csv().fromString(fileData.buffer.toString());
      dataArr = csvArr;
    } else if (
      fileData.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = xlsx.read(fileData.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      dataArr = data;
    }

    dataArr = await dataArr.reduce(async (result, item, index) => {
      const rowHeaders = Object.keys(item);
      const isValidRow = Object.keys(validHeaders).every((header) =>
        rowHeaders.includes(header)
      );

      if (!isValidRow) {
        console.log(`Invalid row at index ${index + 1}:`, "from 1");
        rejectedRowCount++;
        return await result; // Await the result before returning
      }

      const categoryId = item.category;

      const isValidCat = await Category.findOne({ id: categoryId });
      if (!isValidCat) {
        console.log(`Invalid row at index ${index + 1}:`, "from 2");
        rejectedRowCount++;
        return await result; // Await the result before returning
      }

      const processedItem = {
        text: item.text,
        amount: parseFloat(item.amount),
        transfer: item.transfer,
        category: categoryId,
        isIncome: JSON.parse(item.isIncome),
        by: userId,
        account: tID,
        updatedBy: userId,
        createdAt: item.createdAt ? new Date(item.createdAt) : null,
      };

      console.log(processedItem, index);

      const invalidField = Object.keys(processedItem).find(
        (key) =>
          processedItem[key] === null ||
          processedItem[key] === undefined ||
          processedItem[key] === ""
      );

      if (!invalidField) {
        result = await result; // Await the result before pushing
        result.push(processedItem);
      } else {
        console.log(
          `Invalid field '${invalidField}' in row at index ${index + 1}:`,
          item
        );
        rejectedRowCount++;
      }

      return await result; // Await the result before returning
    }, []);

    return { successRows: dataArr, rejectedRowCount };
  },
};
