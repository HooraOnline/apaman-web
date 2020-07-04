import Link from "next/link";
import { withRouter } from "next/router";
import {drawerItem} from "../constants/colors";

import "./MenuButton.scss";

const MenuButton = props => (
  <Link href={props.path}>
      <div
          className={`MenuButton  ${
              props.router.pathname === props.path ? "active" : ""
              }`}
          onClick={()=>{
             props.onPress && props.onPress()
          }}
      >
      {/* <div className="Icon">{props.icon}</div> */}
      <img style={{ marginLeft: 10, with: 25, height: 25, }} src={"../static/assets/images/theme/" + props.icon + ".png"}/>
      <span className="Label" style={{color:drawerItem}}>{props.label}</span>
    </div>
  </Link>
);

export default withRouter(MenuButton);
