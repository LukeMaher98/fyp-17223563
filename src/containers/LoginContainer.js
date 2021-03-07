import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "../actions/AuthActions";
import * as userDataActions from "../actions/UserDataActions";
import * as _ from "lodash";
import Login from "../components/LoginComponents/Login";
import history from '../history';

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    history: history
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(_.assign({}, authActions, userDataActions ), dispatch);
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;
