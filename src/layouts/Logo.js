import wayLogo from "../assets/images/logos/way_logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img src={wayLogo} alt="Way Logo" style={{ maxWidth: "100px" }} />
    </Link>
  );
};

export default Logo;
