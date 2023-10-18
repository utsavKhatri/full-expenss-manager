const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

module.exports.validationRules = {
  USER: {
    ID: 'required|string',
    NAME: 'required|string|max:50|min:3',
    EMAIL: 'required|string|email',
    PASSWORD: [
      'required',
      'string',
      'min:8',
      'max:32',
      `regex:${passwordRegex}`,
    ],
  },
  ACCOUNT: {
    NAME: 'required|string|max:50|min:3',
    BALANCE: 'required|integer|min:0',
    ID: 'required|string',
  },
  TRANSACTION: {
    TEXT: 'required|string|min:2',
    AMOUNT: 'required|integer|min:0',
    ISINCOME: 'required|boolean',
    TRANSFER: 'required|string|min:2',
    CATEGORY: 'required|string',
    ACCOUNT: 'required|string',
    CREATEDBY: 'required|string',
    UPDATEDBY: 'required|string',
  }
};
