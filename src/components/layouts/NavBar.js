// components/NavBar.js

import "./NavBar.scss";
import NavButton from "./NavButton";

const NavBar = props => (
  <div className="NavBar" style={{marginTop:10,marginBottom:10}}>
    {props.navButtons.map(button => (
      <NavButton
        key={button.path}
        path={button.path}
        label={button.label}
        icon={button.icon}
      />
    ))}
  </div>
);

export default NavBar;
