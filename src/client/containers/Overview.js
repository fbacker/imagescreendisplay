import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Chart from "chart.js";
import { assetsLoad, usersLoad, assetsHistory } from "../redux/actions/server";
import { historyDays } from "../redux/actions/settings";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      data: []
    };
    this.canvas = null;
    this.onChangeDateFilter = this.onChangeDateFilter.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.history !== this.props.history) {
      this.refreshChartData(nextProps.history);
    }
  }

  onChangeDateFilter(e) {
    const days = parseInt(e.target.value, 10);
    this.props.historyDays(days);
    this.loadHistoryData(days);
  }

  refreshChartData(history) {
    let labels = [];
    let data = [];
    _.each(history, item => {
      labels.push(item.time);
      data.push(item.num);
    });

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }

  loadHistoryData(days) {
    this.props.assetsHistory(days);
  }

  componentDidMount() {
    // eslint-disable-next-line
    $(".selectpicker").selectpicker();

    this.props.assetsLoad();
    this.props.usersLoad();
    this.loadHistoryData(this.props.dateFilter);

    const data = {
      labels: [],
      datasets: [
        {
          backgroundColor: ["rgba(0,188,212,0.2)"],
          borderColor: ["rgba(0,188,212,1)"],
          data: []
        }
      ]
    };
    const options = {
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }
        ]
      }
    };

    this.chart = new Chart(this.canvas, { type: "line", data, options });
  }
  componentWillUnmount() {
    console.log("overview mount");
  }
  render() {
    const group = (title, icon, number) => {
      return (
        <div className="col-lg-3 col-md-6">
          <div className="card card-pricing">
            <div className="card-body ">
              <h6 className="card-category text-gray">{title}</h6>
              <div className="icon icon-info">
                <i className="material-icons">{icon}</i>
              </div>
              <h3 className="card-title">{number}</h3>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div style={{ marginTop: 100 }}>
        <div className="container">
          <div className="row">
            {group("Antal användare", "people", this.props.users.length)}
            {group(
              "Barn",
              "child_care",
              _.filter(this.props.users, u => !u.isParent).length
            )}
            {group(
              "Föräldrar",
              "face",
              _.filter(this.props.users, u => u.isParent).length
            )}
            {group("Bilder", "perm_media", this.props.assets.length)}
          </div>
          <div className="row">
            <div className="col-4">
              <p style={{ marginLeft: 40, marginTop: 25 }}>Uppladdade bilder</p>
            </div>
            <div className="col-8 text-right">
              <select
                className="selectpicker"
                data-style="select-with-transition"
                title="Datum filter"
                defaultValue={this.props.dateFilter.toString()}
                onChange={this.onChangeDateFilter}
              >
                <option value="30">30 dagar</option>
                <option value="90">3 månader</option>
                <option value="180">6 månader</option>
                <option value="365">1 år</option>
              </select>
            </div>
          </div>
          <div className="row">
            <canvas
              ref={refItem => {
                this.canvas = refItem;
              }}
              width="400"
              height="110"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.server.users,
  assets: state.server.assets,
  history: state.server.history,
  dateFilter: state.settings.historyDays
});

export default connect(
  mapStateToProps,
  {
    assetsLoad,
    usersLoad,
    assetsHistory,
    historyDays
  }
)(Overview);
