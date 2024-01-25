import { ReactComponent as LogoDark } from "../assets/images/logos/hor_logo_blue.svg";
import logo from "../assets/images/logos/hor_logo_blue.png"
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img src={logo} style={{ height: '25px', marginLeft: '10px' }} />
    </Link>
  );
};

export default Logo;
