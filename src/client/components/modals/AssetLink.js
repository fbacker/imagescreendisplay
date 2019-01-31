import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import _ from "lodash";
import { assetConnectionModify } from "../../redux/actions/server";

class AssetLink extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.swap = this.swap.bind(this);
  }

  swap(e, userItem, isSelected) {
    isSelected = !isSelected;
    this.props.assetConnectionModify(
      this.props.asset.id,
      userItem.id,
      isSelected
    );
  }

  render() {
    const asset = this.props.asset
      ? this.props.asset
      : { id: -1, filename: "" };
    console.log("asset", this.props.asset);
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.close}>
        <ModalHeader toggle={this.props.close}>
          Länka en barn till bilden
        </ModalHeader>
        <ModalBody>
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">Är med i bilden</th>
                <th>Namn</th>
              </tr>
            </thead>
            <tbody>
              {_.map(this.props.users, (user, index) => {
                if (user.isParent) return null;
                const selected =
                  _.findIndex(
                    this.props.assetsConnections,
                    item => item.idKid === user.id && item.idAsset === asset.id
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
const mapStateToProps = (state, ownProps) => ({
  users: state.server.users,
  assetsConnections: state.server.assetsConnections,
  asset: ownProps.asset
});

export default connect(
  mapStateToProps,
  { assetConnectionModify }
)(AssetLink);
