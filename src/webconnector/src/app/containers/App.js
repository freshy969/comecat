import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import InputContainer from '../components/InputContainer';
import ConversationContainer from '../components/ConversationContainer';
import HeaderContainer from '../components/HeaderContainer';
import UserInfoInputContainer from '../components/UserInfoInputContainer';
import SocialContainer from '../components/SocialContainer';

import * as actions from '../actions/index';
import * as config from '../lib/config';
import * as utils from '../lib/Utils';

import * as TodoActions from '../actions/index';

class App extends Component {

  constructor(props) {
    super(props);
  }

  initialIconClick(e) {

  }

  componentDidMount = () => {

    setTimeout(() => {
      window.scrollTo(0, 100);
    }, 1000);

  }

  render() {

    let mainClass = "" + this.props.mode;
    const backgroundStyle = {
    };
    if (this.props.backgroundImage)
      backgroundStyle.backgroundImage = `url(${this.props.backgroundImage})`
    else
      backgroundStyle.background = 'linear-gradient(137deg, rgba(255,195,0,1) 0%, rgba(255,244,216,1) 100%)'

    if (mode == 'iframe')
      backgroundStyle.backgroundImage = "none";

    return (
      <div
        className="row background"
        style={backgroundStyle}
      >

        <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-6 offset-sm-3 col-12">

          {this.props.show ?

            <div id="chatbox"
              className={mainClass}
              onScroll={this.onScroll}
              ref={dom => { this.chatbox = dom }}>

              <HeaderContainer />

              <ConversationContainer />

              <InputContainer />

              {this.props.showUserForm ? < UserInfoInputContainer /> : null}

            </div> : null}

        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    show: state.windowstate.show,
    showUserForm: state.windowstate.showUserForm,
    mode: state.windowstate.mode,
    backgroundImage: state.agent.backgroundURL
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch),
    startChat: (name, email) => dispatch(actions.userform.send(name, email)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
