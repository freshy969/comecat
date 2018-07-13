/** Initialize backend API controllers here  */

var express = require("express");
var router = express.Router();
var fs = require("fs");

var bodyParser = require("body-parser");
var _ = require("lodash");

var init = require("../../lib/init.js");

var ConnectorsMain = {
  init: function (app) {
    var self = this;

    router.use("/social", require("./SocialMain").init(app));

    return router;
  }
};

module["exports"] = ConnectorsMain;
