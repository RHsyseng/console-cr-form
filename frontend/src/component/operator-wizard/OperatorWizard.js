import React, { Component } from "react";

import { Wizard, TextArea, Button, Modal, Alert } from "@patternfly/react-core";
import YAML from "js-yaml";
import Dot from "dot-object";
import CopyToClipboard from "react-copy-to-clipboard";

import OperatorWizardFooter from "./OperatorWizardFooter";
import { BACKEND_URL } from "../common/GuiConstants";
import FormJsonLoader from "./FormJsonLoader";
import StepBuilder from "./StepBuilder";
import ReviewPage from "./page-component/ReviewPage";

import { connect } from "react-redux";
import { Dispatchers } from "../../redux/";
import Formatter from "../../utils/formatter";
import Validator from "../../utils/validator";

const mapDispatchToProps = dispatch => {
  return Formatter.extend(Dispatchers.pages(dispatch));
};

const mapStateToProps = state => {
  return {
    currentPages: state.pages.pageList,
    originalPages: state.pages.originalPageList
  };
};

var stepBuilder = new StepBuilder();

class OperatorWizard extends Component {
  constructor(props) {
    super(props);
    this.title = "Operator installer";
    this.subtitle = "RHPAM installer";
    this.errorStep = 1;
    this.state = {
      steps: stepBuilder.buildPlaceholderStep(),
      isFormValid: false,
      validationError: "",
      currentStep: 1,
      maxSteps: 1,
      isEditYamlModalOpen: false,
      isErrorModalOpen: false,
      deployment: {
        deployed: false
      }
    };
    document.title = this.title;
  }

  componentDidMount() {
    FormJsonLoader.loadJsonSpec().then(spec =>
      this.setState({
        spec: spec
      })
    );

    stepBuilder.buildSteps().then(result => {
      //store pages to redux store
      if (!Validator.isEmptyArray(result.pages)) {
        this.props.dispatchStorePages(result.pages);
      } else {
        this.props.dispatchStorePages([]);
      }

      this.setState({
        steps: result.steps,
        maxSteps: result.maxSteps
      });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = {},
      newResult = {};

    if (!Validator.isEmptyArray(nextProps.currentPages)) {
      newResult = stepBuilder.reBuildPages(nextProps.currentPages);
      state = Formatter.extend(prevState, {
        maxSteps: newResult.maxSteps,
        steps: newResult.steps
      });
      return state;
    } else {
      return null;
    }
  }

  onPageChange = ({ id }) => {
    this.setState({
      currentStep: id
    });
  };

  onDeploy = () => {
    if (!this.validateForm()) {
      return;
    }
    const result = this.createResultYaml();
    fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/yaml"
      },
      credentials: "same-origin"
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        }
        throw Error(response.statusText);
      })
      .then(response => {
        const deployment = {
          deployed: true
        };
        if (response.result !== "success") {
          deployment.error = response.message;
        }
        console.log("Applilcation deployed:", JSON.stringify(deployment));
        this.setState({ deployment });
      })
      .catch(error => {
        console.error("Error:", error.message);
        this.setState({
          deployment: {
            deployed: true,
            error: error.message
          }
        });
      });
  };

  onEditYaml = () => {
    this.createResultYaml();
    this.handleEditYamlModalToggle();
  };

  handleEditYamlModalToggle = () => {
    this.setState(({ isEditYamlModalOpen }) => ({
      isEditYamlModalOpen: !isEditYamlModalOpen
    }));
  };

  onChangeYaml = resultYaml => {
    this.setState({
      resultYaml
    });
  };
  getErrorStep = () => {
    return this.errorStep;
  };
  validateForm = () => {
    let result = { isValid: true, errMsg: "", errorStep: 1 };
    let pages = [];
    let errorStep = 1;
    const { originalPages, currentPages } = this.props;

    if (!Validator.isEmptyArray(currentPages)) {
      pages = Formatter.deepCloneArrayOfObject(currentPages);
    } else {
      pages = Formatter.deepCloneArrayOfObject(originalPages);
    }

    pages.forEach(page => {
      if (!result.isValid) {
        return;
      }
      if (page.subPages !== undefined) {
        page.subPages.forEach(subPage => {
          if (!result.isValid) {
            return;
          }
          result = this.validateFields(subPage.fields, errorStep);
          errorStep++;
        });
        if (!result.isValid) {
          return;
        }
        errorStep++;
      }

      result = this.validateFields(page.fields, errorStep);
      if (!result.isValid) {
        return;
      }
      errorStep++;
    });

    this.errorStep = result.errorStep;
    this.setState({
      isFormValid: result.isValid,
      validationError: result.errMsg,
      isErrorModalOpen: !result.isValid
    });

    return result.isValid;
  };

  validateFields(fields, errorStep) {
    let result = { isValid: true, errMsg: "", errorStep: errorStep };

    if (fields !== undefined) {
      fields.forEach(field => {
        if (!result.isValid) {
          return;
        }
        if (field.type === "object" && field.elementCount > 0) {
          result = this.validateFields(field.fields, errorStep);
          if (!result.isValid) {
            return;
          }
        } else if (
          (field.type === "dropDown" ||
            field.type === "fieldGroup" ||
            field.type === "checkbox") &&
          field.fields !== undefined
        ) {
          if (field.visible !== undefined && field.visible !== false) {
            result = this.validateFields(field.fields, errorStep);
            if (!result.isValid) {
              return;
            }
          }
        } else {
          if (field.errMsg !== undefined && field.errMsg !== "") {
            console.log(`Field ${field.label} is not valid: ${field.errMsg}`);
            result = {
              isValid: false,
              errMsg: field.errMsg,
              errorStep: errorStep
            };
          } else {
            if (
              field.required !== undefined &&
              field.required &&
              (field.value === undefined || field.value === "")
            ) {
              const errMsg = field.label + " is required.";
              result = { isValid: false, errMsg: errMsg, errorStep: errorStep };
            }
          }
        }
      });
    }
    return result;
  }

  createYamlFromPages() {
    let jsonObject = {};
    let pages = [];
    const { originalPages, currentPages } = this.props;

    if (!Validator.isEmptyArray(currentPages)) {
      pages = Formatter.deepCloneArrayOfObject(currentPages);
    } else {
      pages = Formatter.deepCloneArrayOfObject(originalPages);
    }

    if (!Validator.isEmptyArray(pages)) {
      pages.forEach(page => {
        let pageFields = page.fields;

        if (Array.isArray(pageFields)) {
          pageFields.forEach(field => {
            if (
              field.type === "dropDown" &&
              field.fields !== undefined &&
              field.visible !== false
            ) {
              jsonObject = this.addObjectFields(field, jsonObject);
            }
            if (
              field.type === "checkbox" &&
              field.fields !== undefined &&
              field.visible !== false
            ) {
              jsonObject = this.addObjectFields(field, jsonObject);
            }
            if (field.type === "object" || field.type === "fieldGroup") {
              jsonObject = this.addObjectFields(field, jsonObject);
            } else {
              const value =
                field.type === "checkbox" ? field.checked : field.value;
              if (
                field.jsonPath !== undefined &&
                field.jsonPath !== "" &&
                value !== undefined &&
                value !== ""
              ) {
                let jsonPath = this.getJsonSchemaPathForYaml(field.jsonPath);
                jsonObject[jsonPath] = value;
              }
            }
          });
        }
        if (
          page.subPages !== undefined &&
          Array.isArray(page.subPages) &&
          page.subPages.length > 0
        ) {
          page.subPages.forEach(subPage => {
            let subPageFields = subPage.fields;

            subPageFields.forEach(field => {
              if (
                field.type === "dropDown" &&
                field.fields !== undefined &&
                field.visible !== false
              ) {
                jsonObject = this.addObjectFields(field, jsonObject);
              }
              if (
                field.type === "checkbox" &&
                field.fields !== undefined &&
                field.visible !== false
              ) {
                jsonObject = this.addObjectFields(field, jsonObject);
              }
              if (field.type === "object" || field.type === "fieldGroup") {
                jsonObject = this.addObjectFields(field, jsonObject);
              } else {
                const value =
                  field.type === "checkbox" ? field.checked : field.value;
                if (
                  field.jsonPath !== undefined &&
                  field.jsonPath !== "" &&
                  value !== undefined &&
                  value !== ""
                ) {
                  let jsonPath = this.getJsonSchemaPathForYaml(field.jsonPath);
                  jsonObject[jsonPath] = value;
                }
              }
            });
          });
        }
      });
    }
    return jsonObject;
  }

  addObjectFields(field, jsonObject) {
    if (Array.isArray(field.fields)) {
      field.fields.forEach(field => {
        if (
          field.type === "dropDown" &&
          field.fields !== undefined &&
          field.visible !== false
        ) {
          jsonObject = this.addObjectFields(field, jsonObject);
        }
        if (
          field.type === "checkbox" &&
          field.fields !== undefined &&
          field.visible !== false
        ) {
          jsonObject = this.addObjectFields(field, jsonObject);
        }

        if (field.type === "object" || field.type === "fieldGroup") {
          jsonObject = this.addObjectFields(field, jsonObject);
        } else {
          const value = field.type === "checkbox" ? field.checked : field.value;
          if (
            field.jsonPath !== undefined &&
            field.jsonPath !== "" &&
            value !== undefined &&
            value !== "" &&
            field.visible !== false
          ) {
            let jsonPath = this.getJsonSchemaPathForYaml(field.jsonPath);
            jsonObject[jsonPath] = value;
          }
        }
      });
    }
    return jsonObject;
  }

  getJsonSchemaPathForYaml(jsonPath) {
    return jsonPath.slice(2, jsonPath.length);
  }

  createResultYaml() {
    const jsonObject = this.createYamlFromPages();
    var resultYaml =
      "apiVersion: " +
      this.state.spec.apiVersion +
      "\n" +
      "kind: " +
      this.state.spec.kind +
      "\n";
    if (Object.getOwnPropertyNames(jsonObject).length > 0) {
      resultYaml = resultYaml + YAML.safeDump(Dot.object(jsonObject));
    }
    this.setState({
      resultYaml: resultYaml
    });
    return resultYaml;
  }

  render() {
    let pages = [];
    const { originalPages, currentPages } = this.props;
    const { steps } = this.state;

    if (!Validator.isEmptyArray(currentPages)) {
      pages = Formatter.deepCloneArrayOfObject(currentPages);
    } else {
      pages = Formatter.deepCloneArrayOfObject(originalPages);
    }
    if (!Validator.isEmptyArray(pages)) {
      const reviewPageTitle = "Confirmation";
      const reviewStep = {
        id: this.state.maxSteps,
        name: reviewPageTitle,
        // canJumpTo: this.state.isFormValid,
        component: (
          <ReviewPage
            title={reviewPageTitle}
            deployment={this.state.deployment}
          />
        )
      };

      if (steps.length > 0 && steps[steps.length - 1].id === reviewStep.id) {
        steps[steps.length - 1] = reviewStep;
      } else if (steps.length === pages.length) {
        steps.push(reviewStep);
      }
    }

    if (steps.length > 0) {
      const operatorFooter = (
        <OperatorWizardFooter
          validate={this.validateForm}
          isFormValid={this.state.isFormValid}
          maxSteps={this.state.maxSteps}
          onDeploy={this.onDeploy}
          onEditYaml={this.onEditYaml}
          onNext={this.onPageChange}
          onBack={this.onPageChange}
          onGoToStep={this.onPageChange}
          isFinished={this.state.deployment.deployed}
          getErrorStep={this.getErrorStep}
        />
      );
      this.wizard = (
        <React.Fragment>
          <Wizard
            isOpen={true}
            title={this.title}
            description={this.subtitle}
            isFullHeight
            isFullWidth
            onClose={() => {}}
            steps={steps}
            footer={operatorFooter}
          />
          <Modal
            title=" "
            isOpen={this.state.isEditYamlModalOpen}
            onClose={this.handleEditYamlModalToggle}
            actions={[
              <CopyToClipboard
                key="yaml_copy"
                className="pf-c-button pf-m-primary"
                onCopy={this.onCopyYaml}
                text={this.state.resultYaml}
              >
                <button key="yaml_button_copy">Copy to clipboard</button>
              </CopyToClipboard>,
              <Button
                key="cancel"
                variant="secondary"
                onClick={this.handleEditYamlModalToggle}
              >
                Cancel
              </Button>
            ]}
          >
            <TextArea
              id="yaml_edit_text"
              key="yaml_text"
              onChange={this.onChangeYaml}
              rows={100}
              cols={35}
              value={this.state.resultYaml}
            />
          </Modal>

          <Modal
            isSmall
            title="Review the form"
            isOpen={this.state.isErrorModalOpen}
            onClose={() => this.setState({ isErrorModalOpen: false })}
          >
            <Alert variant="danger" title={this.state.validationError} />
          </Modal>
        </React.Fragment>
      );
      return this.wizard;
    } else {
      return null;
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OperatorWizard);
