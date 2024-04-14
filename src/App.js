<<<<<<< Updated upstream
import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";

const App = () => {
  const routing = useRoutes(Themeroutes);

  return <div className="dark">{routing}</div>;
};
=======
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./pages/login";
import SignUpForm from "./pages/singup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LoginForm></LoginForm>} />
        <Route path="/signup" element={<SignUpForm></SignUpForm>} />
      </Routes>
    </Router>
  );
}
>>>>>>> Stashed changes

export default App;
