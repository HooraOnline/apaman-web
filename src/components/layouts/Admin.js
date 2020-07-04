import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";


import Dashboard from "pages/adminPanel/Dashboard/Dashboard.js";


export default function Admin({ ...rest }) {







  // initialize and destroy the PerfectScrollbar plugin

  return (
      <Route
          path={'/admin/dashboard'}
          component={Dashboard}
          key={0}
      />
  );
}
