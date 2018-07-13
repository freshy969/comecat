/** Sample configuration file */

var path = require('path');

var Config = {};

//---------------------------------------- must change

Config.host = "localhost";
Config.port = 8080;

Config.serviceURL = "http://localhost:8080"; // frontend url

Config.databaseUrl = "mongodb://localhost/comecat"; // mongodb settings

Config.redis = { // redis settings
    host: "localhost",
    port: 6379
}

Config.mailgunSettings = {
} // mailgun is used for email activation

//------------------------------------- Options

Config.urlPrefix = '/';
Config.dbCollectionPrefix = '';

Config.personamOrganizationName = "personal"; //
Config.robotUserId = "";
Config.personalAccountAdminId = "";

Config.forceLogoutAllDevice = false;

Config.AESPassword = "cl0v3r-S+uD10-h4X0r1";
Config.hashSalt = "8zgqvU6LaziThJI1uz3PevYd";

Config.publicPath = path.resolve(__dirname, "../../..", "public");
Config.uploadPath = path.resolve(__dirname, "../../..", "public/uploads/");

Config.socketNameSpace = '/spikaenterprise';
Config.defaultAvatar = "/img/noname.png";
Config.defaultAvatarGroup = "/img/noname-group.png";

Config.username = "admin";
Config.password = "1234";

Config.signinBackDoorSecret = "";

Config.apnsCertificates = {

    push: {
        token: {
            key: null,
            keyId: "",
            teamId: ""
        },
        appbundleid: ""
    },
    voip: {
        key: null,
        cert: null
    }

};

Config.gcmAPIKey = "";
Config.fcmServerKey = "";

Config.webRTCConfig = {
    "isDev": true,
    "socketNameSpace": "signaling",
    "server": {
        "port": Config.port,
        "secure": false,
        "key": null,
        "cert": null,
        "password": null
    },
    "peerConnectionConfig": {
        "iceTransports": "relay"
    },
    "rooms": {
        "maxClients": 0
    },

    "stunservers": [
        {
            "url": "stun:numb.viagenie.ca:3478"
        }
    ],
    "turnservers": [
        {
            "urls": ["turn:numb.viagenie.ca"],
            "secret": "turnserversharedsecret",
            "expiry": 86400,
            "user": 'ken.yasue@clover-studio.com',
            "password": 'yumiko'
        }
    ]

}

Config.email = {
    service: "",
    username: "",
    password: "",
    from: "no-reply@clover-studio.com"
};

Config.smtp = {
    host: '',
    port: 25,
    username: '',
    password: ''
}

Config.protocol = "http://";

Config.twilio = {
    accountSid: "",
    authToken: "",
    fromNumber: ""
};

Config.useVoipPush = true;
Config.useCluster = false;

Config.phoneNumberSignin = false;

Config.frontEndUrl = "/";

Config.vapidDetails = {
}

Config.paymentRedirectUrl = "http://localhost:8080";

module["exports"] = Config;