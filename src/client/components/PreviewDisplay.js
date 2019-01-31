import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import _ from "lodash";

import { loadPreviewAssets } from "../redux/actions/server";

class PreviewDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 500,
      bgSrc: null
    };
    this.resize = this.resize.bind(this);
    this.intervalRefresh = null;
  }

  componentDidMount() {
    this.refresh();
    if (this.props.live) {
      window.addEventListener("resize", this.resize);
      this.resize();
    }
    this.intervalRefresh = setInterval(() => {
      this.refresh();
    }, 10000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    clearInterval(this.intervalRefresh);
  }

  resize(e) {
    let browserHeight = window.innerHeight;
    this.setState({ height: browserHeight });
  }

  refresh() {
    this.props.loadPreviewAssets();
  }

  setBackground(item) {
    if (!this.props.live) return;
    this.setState({ bgSrc: item.filename });
  }

  render() {
    var settings = {
      dots: false,
      arrows: !this.props.live,
      autoplay: this.props.live,
      infinite: true,
      speed: 500,
      autoplaySpeed: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: false,
      adaptiveHeight: false,
      beforeChange: (oldIndex, newIndex) => {
        const item = this.props.previews[newIndex];
        this.setBackground(item);
      }
    };
    return (
      <Fragment>
        <div
          style={{
            backgroundImage: `url("files/${this.state.bgSrc}")`
          }}
          className="display-background"
        />
        <Slider {...settings}>
          {this.props.previews.length === 0 && (
            <div>
              <div style={{ textAlign: "center", color: "white" }}>
                No images
              </div>
            </div>
          )}
          {_.map(this.props.previews, item => {
            return (
              <div key={item.id}>
                <img
                  alt={item.id}
                  src={`files/${item.filename}`}
                  style={{
                    width: "100%",
                    height: this.state.height,
                    objectFit: this.props.live ? "contain" : "cover"
                  }}
                />
              </div>
            );
          })}
        </Slider>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  previews: state.server.previews,
  live: ownProps.live
});

export default connect(
  mapStateToProps,
  { loadPreviewAssets }
)(PreviewDisplay);
