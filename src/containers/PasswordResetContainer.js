import { connect } from "react-redux";
import * as _ from "lodash";
import PasswordReset from "../components/LoginComponents/PasswordReset";

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
  };
};

const mapDispatchToProps = dispatch => {
};

const PasswordResetContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordReset);

export default PasswordResetContainer;