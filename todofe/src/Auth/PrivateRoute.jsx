import { Navigate } from "react-router";


const PrivateRoute = ({ element, token }) => {
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
