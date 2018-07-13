var _ = require('lodash');
var express = require('express');
var request = require('request');

var pathTop = "../../../";

var Const = require(pathTop + "lib/consts");
var Config = require(pathTop + "lib/init");
var Utils = require(pathTop + "lib/utils");

var DatabaseManager = require(pathTop + 'lib/DatabaseManager');

var BlankAdapter = function () {
}

BlankAdapter.prototype.init = function (app) {
}

BlankAdapter.prototype.process = function (req, res, config, processMessage) {

    if (req.method == 'GET') {

        res.sendStatus(403);

    }


    if (req.method == 'POST') {

        var data = req.body;
        res.sendStatus(403);

    }

}

BlankAdapter.prototype.sendMessage = function (settings, message) {

    return new Promise((res, rej) => {

    });

}

module["exports"] = new BlankAdapter();
