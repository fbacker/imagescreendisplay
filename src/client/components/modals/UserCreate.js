import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { userCreate, userUpdate } from "../../redux/actions/server";

class UserCreate extends Component {
  constructor(props) {
    super(props);
    this.state = { type: "kid", name: "", email: "", nameKid: "" };
    this.createUser = this.createUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  setType(type) {
    this.setState({ type });
  }
  createUser() {
    let isParent = this.state.type === "parent" ? 1 : 0;
    if (this.props.user) isParent = this.props.user.isParent;
    let name = isParent ? this.state.name : this.state.nameKid;
    let email = isParent ? this.state.email : null;

    const isEditMode = this.props.user !== null;
    if (isEditMode) {
      this.props.userUpdate(this.props.user.id, name, email).then(() => {
        console.log("updated");
        this.props.refresh();
        this.props.close();
      });
    } else {
      this.props.userCreate(name, isParent, email).then(() => {
        console.log("created");
        this.props.refresh();
        this.props.close();
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.user !== nextProps.user && nextProps.user) {
      console.log("user changed", nextProps.user);
      if (nextProps.user.isParent) {
        this.setState({
          name: nextProps.user.name,
          email: nextProps.user.email
        });
      } else {
        this.setState({ nameKid: nextProps.user.name });
      }
    }
  }

  handleChange(event) {
    let id = null;
    switch (event.target.id) {
      case "userNameKid":
        id = "nameKid";
        break;
      case "userName":
        id = "name";
        break;
      case "userEmail":
        id = "email";
        break;
      default:
        return;
    }
    this.setState({ [id]: event.target.value });
  }

  render() {
    const isEditMode = this.props.user !== null;
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.close}>
        <ModalHeader toggle={this.props.close}>
          {isEditMode ? "Editera användare" : "Skapa ny användare"}
        </ModalHeader>
        <ModalBody>
          {!isEditMode && (
            <ul
              className="nav nav-pills nav-pills-icons justify-content-center"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#create-kid"
                  role="tab"
                  data-toggle="tab"
                  onClick={() => this.setType("kid")}
                >
                  <i className="material-icons">child_care</i>
                  Barn
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#create-parent"
                  role="tab"
                  data-toggle="tab"
                  onClick={() => this.setType("parent")}
                >
                  <i className="material-icons">face</i>
                  Förälder
                </a>
              </li>
            </ul>
          )}
          <div className="tab-content tab-space">
            <div
              className={[
                "tab-pane",
                !isEditMode ? "active" : "",
                isEditMode && !this.props.user.isParent ? "active" : "null"
              ].join(" ")}
              id="create-kid"
            >
              <Form>
                <FormGroup>
                  <Label for="userNameKid">Namn</Label>
                  <Input
                    type="name"
                    name="userNameKid"
                    id="userNameKid"
                    placeholder="Barnets namn"
                    value={this.state.nameKid}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Form>
            </div>
            <div
              id="create-parent"
              className={[
                "tab-pane",
                isEditMode && this.props.user.isParent ? "active" : ""
              ].join(" ")}
            >
              <Form>
                <FormGroup>
                  <Label for="userName">Namn</Label>
                  <Input
                    type="name"
                    name="userName"
                    id="userName"
                    placeholder="förälders namn"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="userEmail">Namn</Label>
                  <Input
                    type="email"
                    name="userEmail"
                    id="userEmail"
                    placeholder="Epost"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.createUser}>
            {isEditMode ? "Spara" : "Skapa användare"}
          </Button>{" "}
          <Button color="secondary" onClick={this.props.close}>
            Avbryt
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: ownProps.user
});

export default connect(
  mapStateToProps,
  { userCreate, userUpdate }
)(UserCreate);
