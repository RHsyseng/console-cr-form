import React, { Component } from "react";

import { Wizard } from "@patternfly/react-core";

import OperatorWizardFooter from "./OperatorWizardFooter";

export default class OperatorWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      allStepsValid: true, //TODO: set false and change to true upon validation
      currentStep: 1,
      maxSteps: 1
    };
  }

  /*
   * TODO: these events should address the state change of the Wizard.
   * After each change, the state must be persisted in the local storage and
   * bring back as soon as the user navigates to the Page
   */

  areAllStepsValid = () => {
    this.setState({
      //TODO: Set to the result of the validation
      allStepsValid: true
    });
  };

  static getDerivedStateFromProps(props) {
    return {
      maxSteps: OperatorWizard.calculateSteps(props.steps)
    };
  }

  static calculateSteps = pages => {
    let steps = 0;
    pages.forEach(p => {
      if (p.steps !== undefined) {
        steps += this.calculateSteps(p.steps);
      } else {
        steps++;
      }
    });
    return steps;
  };

  onPageChange = ({ id }) => {
    this.areAllStepsValid();
    this.setState({
      currentStep: id
    });
  };

  render() {
    const operatorFooter = (
      <OperatorWizardFooter
        canDeploy={this.state.allStepsValid}
        maxSteps={this.state.maxSteps}
        onNext={this.onPageChange}
        onBack={this.onPageChange}
        onGoToStep={this.onPageChange}
      />
    );
    return (
      <Wizard
        isOpen={true}
        title="Operator GUI"
        description="KIE Operator"
        isFullHeight
        isFullWidth
        onClose={() => {}}
        steps={this.props.steps}
        footer={operatorFooter}
      />
    );
  }
}
