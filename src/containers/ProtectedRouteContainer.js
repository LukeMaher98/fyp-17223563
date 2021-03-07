import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProtectedRoute from '../components/ProtectedRoute';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const ProtectedRouteContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedRoute);

export default ProtectedRouteContainer;
