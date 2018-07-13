import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';

import App from './app/containers/App';
import configureStore from './app/store/configureStore';

import * as Config from './app/lib/config';
import * as utils from './app/lib/Utils';
import SpikaConnector from './app/lib/SpikaConnector';
import * as actions from './app/actions/index';

import './css/index.scss';

// get webconnector id
const parsedURL = queryString.parse(location.search);
window.connectorId = parsedURL["c"];
window.mode = parsedURL["m"];

let mode = "window";

if (window.mode)
  mode = window.mode;

const store = configureStore();

if (window.connectorId) {

  setTimeout(() => {

    SpikaConnector.config(Config.SpikaBaseURL, Config.SpikaAPIKey);
    SpikaConnector.getAgent().then(({ agent, webconnector, connectors }) => {

      // check existing session
      if (window.localStorage &&

        utils.getLocal("accessToken") &&
        utils.getLocal("userData")) {

        const email = utils.getLocal("savedemail");
        const name = utils.getLocal("savedname");

        store.dispatch(actions.chat.startChat(name, email));

      } else {

        store.dispatch(actions.chat.showInitial(mode));

      }

    }).catch((err) => {

      console.log(err);

    });

  }, 100);

  window.addEventListener("load", function () {
    // Set a timeout...
    setTimeout(function () {
      // Hide the address bar!
      window.scrollTo(0, 1);
    }, 0);
  });

  let agentSaved = utils.getLocal("agentData");
  if (agentSaved)
    agentSaved = JSON.parse(agentSaved);
  if (agentSaved && agentSaved.cover && agentSaved.cover.picture) {
    const cover = Config.AvatarBaseURL + agentSaved.cover.picture.nameOnServer;
  }

  if (agentSaved && agentSaved.background && agentSaved.background.picture) {
    const background = Config.AvatarBaseURL + agentSaved.background.picture.nameOnServer;
    store.dispatch(actions.chat.setBackgroundImage(background));

  }



  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('comecat-web-container')
  );


}

export const globalStore = store;