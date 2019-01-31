import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
import { connect } from "react-redux";
import { userConnectionModify } from "../../redux/actions/server";

class UserLink extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.swap = this.swap.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen) {
    }
  }

  swap(e, userItem, isSelected) {
    isSelected = !isSelected;
    this.props.userConnectionModify(
      this.props.user.id,
      userItem.id,
      isSelected
    );
  }

  render() {
    const user = this.props.user ? this.props.user : { name: "" };
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.close}>
        <ModalHeader toggle={this.props.close}>
          Länka en förälder för
          <span className="text-primary">{user.name}</span>
        </ModalHeader>
        <ModalBody>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">Är förälder</th>
                <th>Namn</th>
              </tr>
            </thead>
            <tbody>
              {_.map(this.props.users, (user, index) => {
                if (user.isParent === 0) return null;
                const selected =
                  _.findIndex(
                    this.props.usersConnections,
                    item => item.idParent === user.id
                  ) !== -1;
                return (
                  <tr key={index}>
                    <td className="text-center">
                      <div className="togglebutton">
                        <label>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={e => this.swap(e, user, selected)}
                          />
                          <span className="toggle" />
                        </label>
                      </div>
                    </td>
                    <td>{user.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.close}>
            Stäng
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  users: state.server.users,
  usersConnections: state.server.usersConnections
});

export default connect(
  mapStateToProps,
  { userConnectionModify }
)(UserLink);
