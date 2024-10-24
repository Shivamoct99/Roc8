import { Route, Routes, useNavigate } from "react-router-dom";
// import { Suspense, lazy } from "react";
import Home from "./components/Home";
import Email from "./components/Email";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import { useDashboardcontext } from "./context/dashboard";
import { useLocation } from "react-router-dom";

// import Dashboard from "./Dashboard2";

// const Email = lazy(() => import("./components/Email"));
function App() {
  const { setIsAuthenticated } = useDashboardcontext();
  const navigate = useNavigate();
  const location = useLocation();
  const ProtectedRoutes = ({ children, auth = false }) => {
    const isLoggedIn = localStorage.getItem("userToken:") !== null || false;

    if (!isLoggedIn && auth) {
      return navigate("/sign-in");
    } else if (
      isLoggedIn &&
      ["/sign-in", "/sign-up"].includes(window.location.pathname)
    ) {
      return navigate("/sign-up");
    }
    setIsAuthenticated(true);
    return children;
  };
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/email" element={<Email />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes auth={true}>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
      <Route path="/sign-up" element={<Form />} />
      <Route path="/sign-in" element={<Form isSignIn />} />
    </Routes>
  );
}

export default App;
