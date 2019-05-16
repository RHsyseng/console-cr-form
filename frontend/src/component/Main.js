import React, { Component } from "react";
import OperatorWizard from "./operator-wizard/OperatorWizard";
import StepBuilder from "./operator-wizard/StepBuilder";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.stepBuilder = new StepBuilder();
    this.state = {
      steps: [this.stepBuilder.buildPlaceholderStep()]
    };
  }

  componentDidMount() {
    this.stepBuilder.buildSteps((steps, pages) =>
      this.setState({ steps: steps, pages: pages })
    );
  }

  render() {
    return <OperatorWizard steps={this.state.steps} />;
  }
}
