import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import { connect } from "react-redux";
import AssetLink from "../components/modals/AssetLink";
import {
  assetsLoad,
  usersLoad,
  assetDisplay,
  assetSendToParents,
  assetsConnectionsLoad,
  assetDelete,
  loadPreviewAssets
} from "../redux/actions/server";
import {
  assetsFilterDateFrom,
  assetsFilterDateTo,
  assetsFilterUser,
  changeAssetsFilterGeneral
} from "../redux/actions/settings";

class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalUserLinkIsOpen: false,
      assets: [],
      asset: null
    };
    this.modalClose = this.modalClose.bind(this);
    this.onFilterGeneral = this.onFilterGeneral.bind(this);
    this.refreshInterval = null;
  }

  componentDidMount() {
    this.refresh();
    this.refreshInterval = setInterval(() => this.refresh(), 1000 * 30);

    // eslint-disable-next-line
    const picker = $(".datetimepicker")
      .datetimepicker({
        format: "YYYY-MM-DD",
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-chevron-up",
          down: "fa fa-chevron-down",
          previous: "fa fa-chevron-left",
          next: "fa fa-chevron-right",
          today: "fa fa-screenshot",
          clear: "fa fa-trash",
          close: "fa fa-remove"
        }
      })
      .on("dp.change", e => {
        console.log(e.target.id);
        if (e.target.id === "dateFrom") {
          this.props.assetsFilterDateFrom(e.date.unix());
        } else {
          this.props.assetsFilterDateTo(e.date.unix());
        }
        this.refreshAssets();
      });
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  onFilterDateChange(e) {
    console.log("change date", e.target.value);
  }

  onFilterGeneral(e) {
    const v = e.target.value;
    this.props.changeAssetsFilterGeneral(v);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.assetsFilterGeneral !== this.props.assetsFilterGeneral) {
      this.refreshAssets();
    }
  }

  refresh() {
    this.props.usersLoad();
    this.props.assetsConnectionsLoad();
    this.refreshAssets();
  }

  refreshAssets() {
    if (this.props.assetsFilterGeneral === "normal") {
      this.props.assetsLoad();
    } else {
      this.props.loadPreviewAssets();
    }
  }

  deleteAsset(asset) {
    if (window.confirm("Vill du ta bort denna media fil?")) {
      this.props.assetDelete(asset.id).then(() => {
        this.refresh();
      });
    }
  }

  sendToParents(asset) {
    console.log("send to parents", asset);
    this.props.assetSendToParents(asset.id);
  }

  sendToDisplay(asset) {
    const display = asset.display === 1 ? 0 : 1;
    this.props.assetDisplay(asset.id, display);
    if (this.props.assetsFilterGeneral !== "normal") {
      this.refreshAssets();
    }
  }

  modalOpen() {
    this.setState({ modalUserLinkIsOpen: true });
  }

  modalClose() {
    this.setState({ modalUserLinkIsOpen: false });
  }

  linkKids(asset) {
    this.setState({ asset });
    this.modalOpen();
  }

  updateUserFilter(userId) {
    this.props.assetsFilterUser(userId);
    this.refreshAssets();
  }

  render() {
    const assetsList =
      this.props.assetsFilterGeneral === "normal"
        ? this.props.assets
        : this.props.previews;
    const disableFilters = this.props.assetsFilterGeneral !== "normal";

    return (
      <div className="page">
        <AssetLink
          asset={this.state.asset}
          isOpen={this.state.modalUserLinkIsOpen}
          close={this.modalClose}
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
                <h1 className="title">Media</h1>
                <h4>
                  Alla media bifogade filer du skickar till epost address X
                  dyker efter en stund upp här. Tagga media med barn för att
                  veta vilka som är med. Detta kan användas sedan för att skicka
                  till föräldrar eller visa på display.
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="main main-raised">
          <div className="container">
            <div className="section">
              <div className="row">
                <div className="col-2">
                  <h4>Filter</h4>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="normal"
                        checked={this.props.assetsFilterGeneral === "normal"}
                        onChange={this.onFilterGeneral}
                      />{" "}
                      Standard
                      <span className="circle">
                        <span className="check" />
                      </span>
                    </label>
                  </div>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="display"
                        checked={this.props.assetsFilterGeneral === "display"}
                        onChange={this.onFilterGeneral}
                      />{" "}
                      Skärm
                      <span className="circle">
                        <span className="check" />
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="form-group">
                    <label className="label-control">Datum från</label>
                    <input
                      disabled={disableFilters}
                      type="text"
                      id="dateFrom"
                      className="form-control datetimepicker"
                      onChange={e => {}}
                      value={moment
                        .unix(this.props.assetsFilterDateFromUnix)
                        .format("YYYY-MM-DD")}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label-control">Datum till</label>
                    <input
                      disabled={disableFilters}
                      type="text"
                      id="dateTo"
                      className="form-control datetimepicker"
                      onChange={e => {}}
                      value={moment
                        .unix(this.props.assetsFilterDateToUnix)
                        .format("YYYY-MM-DD")}
                    />
                  </div>
                </div>
                <div className="col-7">
                  <div className="form-group bmd-form-group is-filled">
                    <label className="label-control bmd-label-static">
                      Barn
                    </label>
                    <div>
                      <h6>
                        {_.map(this.props.users, (u, index) => {
                          if (u.isParent) return null;
                          const isSelected = this.props.assetsFilterUsers.includes(
                            u.id
                          );
                          return (
                            <button
                              onClick={e => {
                                e.preventDefault();
                                this.updateUserFilter(u.id);
                              }}
                              disabled={disableFilters}
                              className={[
                                "btn",
                                "badge",
                                "badge-pill",
                                isSelected ? "badge-primary" : "badge-default"
                              ].join(" ")}
                              key={index}
                            >
                              {u.name}
                            </button>
                          );
                        })}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {_.map(assetsList, (asset, index) => {
                  const conns = _.filter(
                    this.props.assetsConnections,
                    conn => conn.idAsset === asset.id
                  );
                  return (
                    <div className="col-md-4" key={index}>
                      <div className="card card-profile card-plain">
                        <div className="card-header card-header-image">
                          <a
                            href={`/files/${asset.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              className="img"
                              alt=""
                              src={`/files/${asset.filename}`}
                              style={{
                                width: "100%",
                                height: 200,
                                objectFit: "cover"
                              }}
                            />
                          </a>
                          <div
                            className="colored-shadow"
                            style={{
                              backgroundImage: `url('/files/${
                                asset.filename
                              }')`,
                              opacity: 1
                            }}
                          />
                        </div>
                        <div className="card-body ">
                          <h5
                            className="card-category text-muted"
                            style={{ margin: 5 }}
                          >
                            {asset.created.format("YYYY-MM-DD")}
                          </h5>
                        </div>
                        <div className="card-footer justify-content-center">
                          <button
                            title="Koppla barn"
                            className="btn btn-just-icon btn-info btn-round"
                            onClick={() => {
                              this.linkKids(asset);
                            }}
                            style={{ overflow: "visible" }}
                          >
                            <i className="material-icons">link</i>
                            <div className="ripple-container" />
                          </button>
                          <button
                            title="Skicka till förälder"
                            className="btn btn-just-icon btn-info btn-round"
                            onClick={() => {
                              this.sendToParents(asset);
                            }}
                            style={{ overflow: "visible" }}
                          >
                            <i className="material-icons">face</i>
                            <div className="ripple-container" />
                            {asset.sent > 0 && (
                              <span className="badge badge-primary badge-number">
                                {asset.sent}
                              </span>
                            )}
                          </button>
                          <button
                            title={
                              asset.display
                                ? "Ta bort från skärm"
                                : "Visa på skärm"
                            }
                            className={[
                              "btn",
                              "btn-just-icon",
                              "btn-round",
                              asset.display ? "btn-warning" : "btn-info"
                            ].join(" ")}
                            onClick={() => {
                              this.sendToDisplay(asset);
                            }}
                            style={{ overflow: "visible" }}
                          >
                            <i className="material-icons">tv</i>
                            <div className="ripple-container" />
                            {asset.display === 1 && (
                              <span className="badge badge-primary badge-number">
                                <i className="material-icons">thumb_up</i>
                              </span>
                            )}
                          </button>
                          <button
                            title="Ta bort bild"
                            className="btn btn-just-icon btn-danger btn-round"
                            onClick={() => {
                              this.deleteAsset(asset);
                            }}
                          >
                            <i className="material-icons">remove_circle</i>
                            <div className="ripple-container" />
                          </button>
                        </div>
                        <div
                          className="card-footer justify-content-center"
                          style={{ padding: 0, marginTop: -15 }}
                        >
                          <h6
                            className="card-category text-muted"
                            style={{ margin: 5 }}
                          >
                            {_.map(conns, (kidObj, index) => {
                              const kid = _.find(
                                this.props.users,
                                u => u.id === kidObj.idKid
                              );
                              return (
                                <div
                                  className="badge badge-pill badge-default"
                                  key={index}
                                >
                                  {kid.name}
                                </div>
                              );
                            })}
                          </h6>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  users: state.server.users,
  assets: state.server.assets,
  previews: state.server.previews,
  assetsConnections: state.server.assetsConnections,
  assetsFilterDateFromUnix: state.settings.assetsFilterDateFrom,
  assetsFilterDateToUnix: state.settings.assetsFilterDateTo,
  assetsFilterUsers: state.settings.assetsFilterUsers,
  assetsFilterGeneral: state.settings.assetsFilterGeneral
});

export default connect(
  mapStateToProps,
  {
    assetsLoad,
    usersLoad,
    assetDisplay,
    assetSendToParents,
    assetsConnectionsLoad,
    assetDelete,
    assetsFilterDateFrom,
    assetsFilterDateTo,
    assetsFilterUser,
    changeAssetsFilterGeneral,
    loadPreviewAssets
  }
)(Media);
