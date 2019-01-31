import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import {
  usersLoad,
  userDelete,
  usersConnectionsLoad,
  assetsConnectionsLoad
} from "../redux/actions/server";
import { Button } from "reactstrap";
import UserCreate from "../components/modals/UserCreate";
import UserLink from "../components/modals/UserLink";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalCreateIsOpen: false,
      modalLinkIsOpen: false,
      filter: "all",
      link: null
    };
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.linkUserClose = this.linkUserClose.bind(this);
    this.refresh = this.refresh.bind(this);
    this.refreshInterval = null;
  }
  componentDidMount() {
    this.refresh();
    this.refreshInterval = setInterval(() => this.refresh(), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  refresh() {
    this.props.usersLoad();
    this.props.usersConnectionsLoad();
    this.props.assetsConnectionsLoad();
  }

  deleteUser(user) {
    console.log("delete", user);
    if (window.confirm(`Vill du ta bort användare ${user.name}`)) {
      this.props.userDelete(user.id).then(() => {
        console.log("user deleted");
        this.refresh();
      });
    }
  }

  editUser(user) {
    this.setState({ modalCreateIsOpen: true, link: user });
  }

  linkUser(user) {
    this.setState({ modalLinkIsOpen: true, link: user });
  }

  linkUserClose(user) {
    this.setState({ modalLinkIsOpen: false, link: null });
  }

  modalOpen() {
    this.setState({ modalCreateIsOpen: true });
  }

  modalClose() {
    this.setState({ modalCreateIsOpen: false, link: null });
  }

  setFilter(filter) {
    this.setState({ filter });
  }

  render() {
    let middleName = "E-post / Föräldrar";
    if (this.state.filter === "kid") {
      middleName = "Föräldrar";
    } else if (this.state.filter === "parent") {
      middleName = "E-post";
    }

    return (
      <div className="page">
        <UserCreate
          isOpen={this.state.modalCreateIsOpen}
          user={this.state.link}
          close={this.modalClose}
          refresh={this.refresh}
        />
        <UserLink
          isOpen={this.state.modalLinkIsOpen}
          close={this.linkUserClose}
          refresh={this.refresh}
          user={this.state.link}
          users={this.props.users.filter(user => user.isParent)}
        />

        <div
          className="page-header header-filter"
          data-parallax="true"
          style={{
            backgroundImage: "url('https://picsum.photos/800/800/?random')"
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-left">
                <h1 className="title">Användare</h1>
                <h4>
                  Här kan du se alla användare, både föräldrar och barn. Barn
                  används för att tagga bilder med vem som är med och förälder
                  används för att ha möjlighet att skicka mediafiler.
                </h4>
                <br />
                <div className="buttons">
                  <Button color="primary" size="lg" onClick={this.modalOpen}>
                    Skapa ny användare
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main main-raised">
          <div className="container">
            <div className="section">
              <ul className="nav nav-pills nav-pills-primary" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                    aria-expanded="true"
                    onClick={() => this.setFilter("all")}
                  >
                    Alla användare
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#link2"
                    role="tablist"
                    aria-expanded="false"
                    onClick={() => this.setFilter("kid")}
                  >
                    Barn
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#link3"
                    role="tablist"
                    aria-expanded="false"
                    onClick={() => this.setFilter("parent")}
                  >
                    Förälder
                  </a>
                </li>
              </ul>
              <p>&nbsp;</p>
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center" />
                    <th>Namn</th>
                    <th>{middleName}</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(this.props.users, (user, index) => {
                    if (this.state.filter === "kid") {
                      if (user.isParent) return null;
                    } else if (this.state.filter === "parent") {
                      if (!user.isParent) return null;
                    }
                    let middle = <td>{user.email}</td>;
                    if (!user.isParent) {
                      let p = [];
                      _.each(this.props.usersConnections, u => {
                        if (u.idKid === user.id) {
                          _.each(this.props.users, u2 => {
                            if (u2.id === u.idParent) {
                              p.push(u2.name);
                            }
                          });
                        }
                      });
                      middle = (
                        <td>
                          <h6>
                            {_.map(p, (u, index) => {
                              return (
                                <div
                                  className="badge badge-pill badge-default"
                                  key={index}
                                >
                                  {u}
                                </div>
                              );
                            })}
                          </h6>
                        </td>
                      );
                    }
                    return (
                      <tr key={index}>
                        <td className="text-center">
                          {user.isParent ? (
                            <i className="material-icons">face</i>
                          ) : (
                            <i className="material-icons">child_care</i>
                          )}
                        </td>
                        <td>{user.name}</td>
                        {middle}
                        <td className="td-actions text-right">
                          <Button
                            style={{ marginRight: 5 }}
                            color="warning"
                            size="sm"
                            onClick={() => {
                              this.editUser(user);
                            }}
                            title="Editera"
                          >
                            <i className="material-icons">create</i>
                          </Button>
                          {!user.isParent && (
                            <Button
                              style={{ marginRight: 5 }}
                              color="info"
                              size="sm"
                              onClick={() => {
                                this.linkUser(user);
                              }}
                              title="Föräldrar"
                            >
                              <i className="material-icons">link</i>
                            </Button>
                          )}
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => {
                              this.deleteUser(user);
                            }}
                            title="Ta bort"
                          >
                            <i className="material-icons">remove_circle</i>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.server.users,
  usersConnections: state.server.usersConnections
});

export default connect(
  mapStateToProps,
  {
    usersLoad,
    userDelete,
    usersConnectionsLoad,
    assetsConnectionsLoad
  }
)(Users);
