import React from 'react';
 
const AWSContext = React.createContext(null);

export const withAWS = Component => props => (
    <AWSContext.Consumer>
      {AWS => <Component {...props} AWS={AWS} />}
    </AWSContext.Consumer>
  );
 
export default AWSContext;