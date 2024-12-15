import { ToastContainer } from "react-toastify";
import "./App.css";
import LoginAndRegister from "./LoginAndRegister";
import "react-toastify/dist/ReactToastify.css";
import Todo from "./Todo";
import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useNavigate,
  Navigate,
} from "react-router";
import PrivateRoute from "./Auth/PrivateRoute";
import PublicRoute from "./Auth/PublicRoutes";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          <Route
            path="/"
            element={<PrivateRoute path="/" element={<Todo />} token={token} />}
          />
          <Route
            path="/login"
            element={
              <PublicRoute
                path="/login"
                element={<LoginAndRegister />}
                token={token}
              />
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
