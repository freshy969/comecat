/** Initialize backend API controllers here  */

var express = require("express");
var router = express.Router();
var fs = require("fs");

var bodyParser = require("body-parser");
var _ = require("lodash");

var init = require("../../lib/init.js");

var APIMain = {
  init: function (app) {
    var self = this;

    router.use("/test", require("./Controllers/TestController").init(app));
    router.use("/signin", require("./Controllers/SigninController").init(app));
    router.use(
      "/signout",
      require("./Controllers/SignoutController").init(app)
    );
    router.use(
      "/message/list",
      require("./Controllers/MessageListController").init(app)
    );
    router.use(
      "/messages",
      require("./Controllers/MessagesController").init(app)
    );
    router.use(
      "/files/upload",
      require("./Controllers/FileUploadController").init(app)
    );
    router.use(
      "/files/download",
      require("./Controllers/FileDownloadController").init(app)
    );
    router.use("/groups", require("./Controllers/GroupsController").init(app));
    router.use("/rooms", require("./Controllers/RoomsController").init(app));
    router.use(
      "/stickers",
      require("./Controllers/StickersController").init(app)
    );

    router.use("/users", require("./Controllers/UsersController").init(app));
    router.use(
      "/private",
      require("./Controllers/PrivateMessageController").init(app)
    );

    router.use("/webconnector", require("./Controllers/WebConnectorController").init(app));
    router.use("/cc", require("./Controllers/ComcatAPIController").init(app));

    return router;
  }
};

module["exports"] = APIMain;
