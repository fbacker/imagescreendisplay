import React, { Component } from "react";
import PreviewDisplay from "../components/PreviewDisplay";
class DisplayScreen extends Component {
  componentDidMount() {
    console.log("display mount");
  }
  componentWillUnmount() {
    console.log("display mount");
  }
  render() {
    return (
      <div className="page black no-overflow">
        <div className="center">
          <PreviewDisplay live={true} />
        </div>
      </div>
    );
  }
}
export default DisplayScreen;
