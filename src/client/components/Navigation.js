import React from "react";
import { NavLink } from "react-router-dom";

const Menu = () => (
  <nav className="navbar fixed-top navbar-expand-lg">
    <div
      className="card card-nav-tabs card-plain nav"
      style={{ marginBottom: -15, marginTop: 15 }}
    >
      <div className="card-header card-header-primary">
        <div className="nav-tabs-navigation">
          <div className="nav-tabs-wrapper">
            <ul className="nav nav-tabs" data-tabs="tabs">
              <li className="nav-item">
                <NavLink
                  exact
                  to="/"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="material-icons">dashboard</i>
                  Översikt
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/users"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="material-icons">face</i>
                  Användare
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/media"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="material-icons">perm_media</i>
                  Media
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/preview"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="material-icons">aspect_ratio</i>
                  Preview
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
);
export default Menu;
