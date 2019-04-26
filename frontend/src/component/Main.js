import React, { Component } from "react";
import OperatorWizard from "./operator-wizard/OperatorWizard";
import StepBuilder from "./operator-wizard/StepBuilder";
import { TextArea, Button, Modal } from "@patternfly/react-core";
import CopyToClipboard from "react-copy-to-clipboard";
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.stepBuilder = new StepBuilder();
    this.state = {
      steps: [this.stepBuilder.buildPlaceholderStep()],
      showPopup: false
    };
  }

  componentDidMount() {
    this.setState({ steps: this.stepBuilder.buildSteps() });
  }

  togglePopup = () => {
    //  alert("Swat")
    //alert(this.state.showPopup);
    this.setState({
      showPopup: !this.state.showPopup
    });
  };
  render() {
    return (
      <React.Fragment>
        <OperatorWizard steps={this.state.steps} />
        <Modal
          title=" "
          width={"200%"}
          isOpen={this.state.showPopup}
          onClose={this.togglePopup}
          actions={[
            <CopyToClipboard
              key="yaml_copy"
              className="pf-c-button pf-m-primary"
              //  onCopy={this.onCopyYaml}
              //  text={this.state.resultYaml}
            >
              <button key="yaml_button_copy">Copy to clipboard</button>
            </CopyToClipboard>,
            <Button key="cancel" variant="secondary" onClick={this.togglePopup}>
              Cancel
            </Button>
          ]}
        >
          <TextArea
            id="yaml_edit_text"
            key="yaml_text"
            onChange={this.onChangeYaml}
            rows={35}
            cols={35}
            value={this.state.resultYaml}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
