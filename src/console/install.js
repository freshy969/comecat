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
var OrganizationModel = require('../server/Models/Organization');

var Utils = require('../server/lib/utils');
var init = require('../server/lib/init');
var Const = require('../server/lib/consts');

async function checkFolder() {

    const folderPath = init.uploadPath;
    const testFile = folderPath + "/test";

    if (!fs.existsSync(folderPath)) {
        return false;
    }

    fs.writeFileSync(testFile, "test");

    if (!fs.existsSync(testFile)) {
        return false;
    }

    fs.unlinkSync(testFile);

    return true;

}


async function checkOrganization() {

    return new Promise((res, rej) => {

        const model = OrganizationModel.get();

        if (!init.personamOrganizationName || init.personamOrganizationName == "") {
            return rej(" Wrong config. Please check personamOrganizationName.")
        }

        model.findOne({
            organizationId: init.personamOrganizationName
        }, (err, findResult) => {

            if (err)
                rej(err);

            res(findResult);

        });

    });

}

async function checkUser(username) {

    return new Promise((res, rej) => {

        const model = UserModel.get();
        model.findOne({
            userid: username
        }, (err, findResult) => {

            if (err)
                rej(err);

            res(findResult);

        });

    });

}

async function generateOrganization() {

    return new Promise((res, rej) => {

        const model = OrganizationModel.get();

        if (!init.personamOrganizationName || init.personamOrganizationName == "") {
            return rej(" Wrong config. Please check personamOrganizationName.")
        }

        var org = new model({
            name: init.personamOrganizationName,
            organizationId: init.personamOrganizationName,
            sortName: init.personamOrganizationName,
            created: Utils.now(),
            maxUserNumber: 1000000,
            maxGroupNumber: 1000000,
            maxRoomNumber: 1000000,
            diskQuota: 1000000,
            status: 1
        });

        org.save((err, saveResult) => {
            var organization = saveResult.toObject();
            res(organization);
        });

    });

}
async function generateUser(org, username, password, avatarImage) {

    return new Promise((res, rej) => {

        const userModel = UserModel.get();

        const originalImagePath = path.resolve(__dirname + "/../../doc/avatar/" + avatarImage);
        const thumbname = Utils.getRandomString();
        const filename = Utils.getRandomString();

        if (!fs.existsSync(originalImagePath)) {
            rej(avatarImage + " doesnt exists.");
        }

        // get organization

        easyimg.thumbnail({
            src: originalImagePath,
            dst: init.uploadPath + "/" + thumbname + ".png",
            width: Const.thumbSize, height: Const.thumbSize
        }).then(

            (image) => {

                fs.renameSync(init.uploadPath + "/" + thumbname + ".png", init.uploadPath + "/" + thumbname);
                fs.copySync(init.uploadPath + "/" + thumbname, init.uploadPath + "/" + filename);

                var model = new userModel({
                    organizationId: org._id.toString(),
                    name: username,
                    description: "",
                    userid: username,
                    password: Utils.getHash(password),
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

                model.save((err, modelSaved) => {

                    if (err)
                        rej('faild to create user');

                    res(modelSaved);

                });

            },
            (err) => {



            }

        );

    })

}
async function scanfPassword() {

    console.log('OK Lets create admin user first.')
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

                rej("failed to connect db");

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
    console.log('This installer does following things.');
    console.log('1. Check Database and upload folder permission.');
    console.log('2. Create organization.');
    console.log('3. Create admin user.');
    console.log('4. Create user for chatbot message.');
    console.log('\n');

    try {
        await connectDB();
    } catch (e) {
        console.error(e);
        console.error('Failed to connect DB.Please check datebase settings in src/server/lib/init.js.'.red);
        process.exit(1);
    }
    console.log('Database connection -- OK .'.yellow);


    let org = await checkOrganization();
    if (org) {
        const message = "Please delete organization " + org._id + " and start installer again";
        console.error(message.red);
        process.exit(1);
    }

    try {
        org = await generateOrganization()
    } catch (e) {
        console.error(e.red);
        process.exit(1);
    }

    // check upload folder permission
    const folderWritable = await checkFolder();
    if (!folderWritable) {
        console.error('Check upload folder permission.'.red);
        process.exit(1);
    }
    console.log('Upload folder write permission -- OK .'.yellow);
    console.log('');

    let adminUser = await checkUser('admin');
    if (adminUser) {
        const message = "Please delete user " + adminUser._id + " and start installer again";
        console.error(message.red);
        process.exit(1);
    }

    const adminPassword = await scanfPassword();

    process.stdout.write("Your password is ".green);
    process.stdout.write(adminPassword + "\n\n");
    process.stdout.write('Generating admin...'.green);

    try {
        adminUser = await generateUser(org, "admin", adminPassword, "thecat.png");
    } catch (e) {
        console.error(e.red);
        process.exit(1);
    }

    console.log('Done !'.green);
    console.log('Your admin credential is ');
    console.log('  User Name :'.green + "admin".white);
    console.log('  Password :'.green + adminPassword.white);

    console.log('');

    process.stdout.write('Generating robot user...'.green);

    let robotUser = await checkUser('robot');
    if (robotUser) {
        const message = "Please delete user " + robotUser._id + " and start installer again";
        console.error(message.red);
        process.exit(1);
    }

    try {
        robotUser = await generateUser(org, "robot", "robot", "robocat.png");
    } catch (e) {
        console.error(e.red);
        process.exit(1);
    }

    console.log('Done !'.green);
    console.log('Your robot user account is generated.');
    console.log('');

    console.log('Editing config file...'.green);

    const initFilePath = path.resolve(__dirname + '/../server/lib/init.js');
    let contents = fs.readFileSync(initFilePath, 'utf8');

    contents = contents.replace(/Config.robotUserId = ""/, 'Config.robotUserId = "' + robotUser._id.toString() + '"');
    contents = contents.replace(/Config.personalAccountAdminId = ""/, 'Config.personalAccountAdminId = "' + adminUser._id.toString() + '"');

    fs.writeFileSync(initFilePath, contents, 'utf8');
    console.log('Done !'.green);

    process.exit(0);





})();