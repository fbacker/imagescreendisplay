import React, { Component } from "react";
import PreviewDisplay from "../components/PreviewDisplay";
class Preview extends Component {
  componentDidMount() {
    console.log("preview mount");
  }
  componentWillUnmount() {
    console.log("preview mount");
  }
  render() {
    return (
      <div className="page dark">
        <div className="container">
          <div className="row" style={{ paddingTop: 100 }}>
            <div className="col-12">
              <PreviewDisplay />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Preview;
