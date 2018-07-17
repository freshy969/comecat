# ComeCat

ComeCat is open source messenger for team chat and for live chat support. Everything you need for communication is in one place.

## Demo

Please signin from here. You can try all features.

[https://app.come.cat/](https://app.come.cat/)

## Features

 - Team Chat
 - Live Chat
    - On Your Web Site
    - Chat with guests

 - Messenger Integration
    - Facebook Messenger
    - Line
    - WeChat
    - Viber
    - Kik
    - Telegram
    - Twilio
    
 - Bot API Integration 
    - IBM Watson
    - Dialog Flow
    - And a lot of Bot API is comming !!

For further detail please check our website and documentation.
 - [Web Site](https://come.cat)
 - [Documentation](https://doc.come.cat)

This repository contains following.

- Comecat Backend ( under src/server )

  - Backend provides API and all business logics. Spika uses HTTP API and Websocket.

- Comecat Web Client ( under src/client )

  - Web client is where you login in and chat with your team & customer.

- Comecat Web Connector ( under src/webconnector)

  - Web Connector is the unique URL where you can share to people and everyone has direct chat with you.
    As also you can include simple JS into your web site and you can chat with your web site visitors.

## System Requirements

### Hardware
- 2GB RAM
- 128FB Storage

### Software
- NodeJS : v9.0
- MongoDB :  v3.6
- Redis Server : v2.8.4

## Quick Installation

This instruction shows how to deploy server and build frontend in Ubuntu16.04. Probably almost same for Ubuntu18.04.
ComeCat should work on all Linux distributions please understand what you need from this instruction. 

This installation is for minimum setup for development environment. So I skipped everything about security. 

### Server

1. Install libraries

```
sudo apt-get update
```

```
sudo apt-get install -y git imagemagick build-essential libfuse-dev libcurl4-openssl-dev libxml2-dev mime-support automake libtool python redis-server
```

2. Install NVM
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

```
nvm install node
```

```
nvm use node
```

3. Install MongoDB 4.0

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
```

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
```

```
sudo apt-get update
```

```
sudo apt-get install -y mongodb-org
```

```
sudo service mongod start
```

**Please don't forget to setup access credentials for production environment** 

4. Clone From Git

```
git clone https://github.com/cloverstudio/comecat.git
```

```
cd comecat
```

```
npm install
```

```
cp src/server/lib/init-sample.js src/server/lib/init.js
```

Create upload folder
```
mkdir public/uploads
```

Run installer
```
node src/console/installer.js
```

Start server
```
node src/server/main.js
```

If everything is installed correctly server start running in port 8080.
So please try to open http://[yourhost]:8080/admin/ and check admin console is opened.

5. Build Frontend

Now you have to build frontend and webconnector.

```
npm run build
```

**This process will take a long if you are running in low spec servers.**

Then check you can open http://[yourhost]:8080/


6. Build WebConnector

```
cd src/webconnector/
```

```
npm install
```

```
npm run build
```

## Configuration

### src/server/init.js

```
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
```

### src/client/lib/config.js

```
export const serverBase = "http://localhost:8080";
```

### src/webconnector/src/lib/config.js

```
export const baseURL = "http://localhost:8080";
export const SpikaAPIKey = "GtZX9bkKKiWpJKauL06ugOCZS2BwrJEY";
export const SpikaWebSocketURL = 'ws://localhost:8080/spikaenterprise';
```

### public/c/l/loader.js

```
var baseURLSrc = "http://localhost:8080";
```