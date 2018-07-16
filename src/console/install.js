var fs = require('fs-extra');
var _ = require('lodash');
var sha1 = require('sha1');
var http = require('http');
var Stream = require('stream').Transform;
var async = require('async');
var scanf = require('scanf');
var colors = require('colors');
var easyimg = require('easyimage');
var path = require("path");

var DatabaseManager = require('../server/lib/DatabaseManager');
var UserModel = require('../server/Models/User');

var Utils = require('../server/lib/utils');
var init = require('../server/lib/init');
var Const = require('../server/lib/consts');

async function generateUser() {


    easyimg.thumbnail({
        src: init.uploadPath + "/" + filename,
        dst: init.uploadPath + "/" + thumbname + ".png",
        width: Const.thumbSize, height: Const.thumbSize
    }).then(

        function (image) {

            fs.renameSync(init.uploadPath + "/" + thumbname + ".png", init.uploadPath + thumbname);

            var model = new userModel({
                organizationId: organizationId,
                name: row.first_name + " " + row.last_name,
                description: row.email,
                userid: row.username,
                password: Utils.getHash('yumiko'),
                status: 1,
                avatar: {
                    picture: {
                        originalName: filename,
                        size: 1,
                        mimeType: "image/png",
                        nameOnServer: filename
                    },
                    thumbnail: {
                        originalName: thumbname,
                        size: 1,
                        mimeType: "image/png",
                        nameOnServer: thumbname
                    },
                },
                created: Utils.now()
            });

            model.save(function (err, modelSaved) {

                if (err)
                    console.log(err);

                done(err);

            });

        },
        function (err) {



        }

    );

}
async function scanfPassword() {

    process.stdout.write("Please input admin password > ".green);

    const password = scanf('%s');

    if (!/^[0-9a-zA-Z]{6,}$/.test(password)) {

        console.log('Password must be more than 6 charactors & only alphabet and numbers'.red);

        const rePassword = await scanfPassword();

        if (rePassword) {
            return rePassword;
        }

    } else {
        return password;
    }

}

async function connectDB() {

    return new Promise((res, rej) => {

        DatabaseManager.init((success) => {

            if (!success) {

                rej('Failed to connect DB');

            } else {

                res();

            }

        });

    });
}

// main
(async function () {

    console.log('\n\n');
    console.log('-------------------------------'.rainbow);
    console.log('Welcome to comecat installer'.rainbow);
    console.log('-------------------------------'.rainbow);
    console.log('\n');

    await connectDB();
    const adminPassword = await scanfPassword();

    process.stdout.write("Your password is ".green);
    process.stdout.write(adminPassword + "\n\n");

    process.stdout.write('Generating admin...'.green);
    process.stdout.write('Done !'.green);





    process.exit(1);

})();