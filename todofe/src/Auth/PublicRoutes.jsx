import { Navigate } from "react-router";


const PublicRoute = ({ element, token }) => {
  return !token ? element : <Navigate to="/" />;
};

export default PublicRoute;
