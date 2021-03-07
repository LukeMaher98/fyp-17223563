import { connect } from "react-redux";
import * as _ from "lodash";
import PasswordRecovery from "../components/LoginComponents/PasswordRecovery";

const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
  };
};

const mapDispatchToProps = dispatch => {
};

const PasswordRecoveryContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordRecovery);

export default PasswordRecoveryContainer;
