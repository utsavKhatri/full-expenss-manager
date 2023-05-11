/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "GET /": "AccountsController.viewAccount",
  "GET /editProfile": "UserController.editProfile",
  "GET /editTransaction/:id": "TransactionController.editTransaction",
  "GET /editAccount/:id": "AccountsController.editAccount",
  "GET /viewTransaction/:id": "TransactionController.getTrsansaction",
  "GET /transaction/duration/:id": "TransactionController.getTransactionByDura",
  "GET /logout": "UserController.userLogout",
  "GET /share/:id": "AccountsController.share",
  "DELETE /delAccount/:accId": "AccountsController.delAccount",
  "DELETE /delUser/:id": "UserController.delUser",
  "GET /dahsboard": "UserController.dashBoard",

  "POST /searchTransaction": "AccountsController.searchTransactions",
  "PUT /editTransaction/:id": "TransactionController.updateTransaction",
  "PUT /editAccount/:id": "AccountsController.updateAccount",
  "POST /login": "UserController.userLogin",
  "POST /signup": "UserController.userSignup",
  "PUT /editProfile": "UserController.updateProfile",
  "POST /addTransaction/:tId": "TransactionController.addTrsansaction",
  "POST /addAccount": "AccountsController.addAccount",
  "POST /account/share/:id": "AccountsController.shareAccount",
  "DELETE /rmTransaction/:delId": "TransactionController.rmTransaction",
  "POST /generate": "TransactionController.generateDataForTrans",
  "POST /generate/name": "TransactionController.generateNames",
  "GET /category": "CategoryController.find",
  "GET /categoryId": "CategoryController.getCatId",
  "GET /category/:id": "CategoryController.findOne",
  "POST /category": "CategoryController.create",
  "PUT /category/:id": "CategoryController.update",
  "DELETE /category/:id": "CategoryController.delete",
  "POST /largeDataInsert/:tId": "TransactionController.addLargeGeneratedTransaction",
  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
