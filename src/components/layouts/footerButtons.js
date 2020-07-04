// config/buttons.js

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faMapMarkerAlt,
  faUser,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";

const navButtons = [
  /*{
    label: "کارتها",
    path: "/mycart",
    icon: <FontAwesomeIcon icon={faShoppingCart} />
  },*/
  {
    label: "نزدیک من",
    path: "/second1",
    icon: <FontAwesomeIcon icon={faMapMarkerAlt} />
  },
  {
    label: "صفحه اصلی",
    path: "/Main",
    icon: <FontAwesomeIcon icon={faCompass} />
  },
  {
    label: "رخدادها",
    path: "/events",
    icon: <FontAwesomeIcon icon={faUser} />
  }
];

export default navButtons;
