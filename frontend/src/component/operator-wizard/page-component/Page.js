import React, { Component } from "react";
import ElementFactory from "../element-component/ElementFactory";
import { Form } from "@patternfly/react-core";
import YAML from "js-yaml";
import Dot from "dot-object";
import { TextArea, Button, Modal } from "@patternfly/react-core";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactDOM from "react-dom";
import * as jsonLoader from "../FormJsonLoader";
import { BACKEND_URL } from "../../common/GuiConstants";

/**
 * The Page component to handle each element individually.
 */
export default class Page extends Component {
  /**
   * Default constructor for the PageComponent.
   *
   * @param {*} props { pageDef, jsonSchema, pageNumber }
   */
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      isModalOpen: false,
      resultYaml: ""
    };
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen }) => ({
        isModalOpen: !isModalOpen
      }));
    };
    this.editYaml = this.editYaml.bind(this);
    this.formId = "form-page-" + this.props.pageNumber;
    this.errFlag = false;
    this.jsonObject = {};
    this.spec = this.getSpec().then(spec => (this.spec = spec));
  }

  async getSpec() {
    return await jsonLoader.loadJsonSpec;
  }

  loadPageChildren() {
    var elements = ElementFactory.newInstances(
      this.props.pageDef.fields,
      this.props.pageDef.buttons,
      this.props.jsonSchema,
      this.props.pageNumber,
      this
    );

    this.setState({
      elements: elements
    });
  }

  /**
   * Adds a new element to the specific position at the Page and re-render the DOM.
   * @param {int} startIndex
   * @param {Element} element
   */
  addElements(startIndex, newElements, objectkey) {
    this.state.elements.forEach((element, i) => {
      if (element.props != undefined && element.props.ids != undefined) {
        if (element.props.ids.fieldGroupId === objectkey) {
          startIndex = startIndex + i;
        }
      }
    });

    if (Array.isArray(newElements)) {
      var elements = this.state.elements;
      newElements.forEach((element, count) => {
        // update the json state
        this.props.pageDef.fields.splice(
          startIndex + count - 1,
          0,
          JSON.parse(JSON.stringify(element.props.fieldDef))
        );
        // add the elements dynamically
        elements.splice(startIndex + count, 0, element);
      });

      this.setState({ elements: elements });
    } else {
      throw new Error(
        "When adding new elements to the page, please use an Array. Got: ",
        newElements
      );
    }
  }

  /**
   * Removes elements from the Page.
   *
   * @param {int} startIndex
   * @param {int} elementCount
   */
  deleteElements(startIndex, elementCount, objectkey) {
    this.state.elements.forEach((element, i) => {
      // console.log(element.page.props.key);
      if (element.props != undefined && element.props.ids != undefined) {
        if (element.props.ids.fieldGroupId === objectkey) {
          startIndex = startIndex + i;
        }
      }
    });
    var elements = this.state.elements;
    this.props.pageDef.fields.splice(startIndex - 1, elementCount);
    elements.splice(startIndex, elementCount);
    this.setState({ elements: elements });
  }

  componentDidMount() {
    this.loadPageChildren();
    this.renderPages();
  }

  getElements() {
    return this.state.elements;
  }
  editYaml() {
    this.errFlag = false;

    this.createSampleYamlfromPages();
    if (this.errFlag === false) {
      this.createResultYaml();
      this.handleModalToggle();
    }
  }
  createResultYaml() {
    var resultYaml =
      "apiVersion: " +
      this.spec.apiVersion +
      "\n" +
      "kind: " +
      this.spec.kind +
      "\n";
    if (Object.getOwnPropertyNames(this.jsonObject).length > 0) {
      resultYaml = resultYaml + YAML.safeDump(Dot.object(this.jsonObject));
    }

    this.setState({
      resultYaml
    });

    return resultYaml;
  }
  onChangeYaml = value => {
    this.setResultYaml(value);
  };

  deploy = () => {
    this.createSampleYamlfromPages();
    var result = this.createResultYaml();
    console.log(result);
    fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/yaml"
      }
    })
      .then(res => res.json())
      .then(response => console.log("Success:", JSON.stringify(response)))
      .catch(error => console.error("Error:", error));
  };

  setResultYaml = resultYaml => {
    this.setState({
      resultYaml
    });
  };

  createSampleYamlfromPages() {
    let jsonObject = {};
    this.errFlag = false;
    if (Array.isArray(this.props.pages)) {
      this.props.pages.forEach(page => {
        let pageFields = page.fields;

        if (Array.isArray(pageFields)) {
          pageFields.forEach(field => {
            if (
              field.type === "dropDown" &&
              field.fields !== undefined &&
              (field.visible === undefined || field.visible === true)
            ) {
              jsonObject = this.addObjectFields(field, jsonObject);
            }
            if (field.type === "object" || field.type === "fieldGroup") {
              jsonObject = this.addObjectFields(field, jsonObject);
            } else {
              const value =
                field.type === "checkbox" ? field.checked : field.value;
              if (
                field.errMsg !== undefined &&
                field.errMsg !== "" &&
                (field.visible === undefined || field.visible === true)
              ) {
                this.errFlag = true;
              }
              if (
                field.jsonPath !== undefined &&
                field.jsonPath !== "" &&
                value !== undefined &&
                value !== "" &&
                (field.visible === undefined || field.visible === true)
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
                (field.visible === undefined || field.visible === true)
              ) {
                jsonObject = this.addObjectFields(field, jsonObject);
              }
              if (field.type === "object" || field.type === "fieldGroup") {
                jsonObject = this.addObjectFields(field, jsonObject);
              } else {
                const value =
                  field.type === "checkbox" ? field.checked : field.value;
                if (
                  field.errMsg !== undefined &&
                  field.errMsg !== "" &&
                  (field.visible === undefined || field.visible === true)
                ) {
                  //console.log("err:::" + field.label + "....." + field.errMsg);
                  this.errFlag = true;
                }
                if (
                  field.jsonPath !== undefined &&
                  field.jsonPath !== "" &&
                  value !== undefined &&
                  value !== "" &&
                  (field.visible === undefined || field.visible === true)
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
    this.jsonObject = jsonObject;
  }

  addObjectFields(field, jsonObject) {
    if (Array.isArray(field.fields)) {
      field.fields.forEach(field => {
        if (
          field.type === "dropDown" &&
          field.fields !== undefined &&
          (field.visible === undefined || field.visible === true)
        ) {
          jsonObject = this.addObjectFields(field, jsonObject);
        }
        if (field.type === "object" || field.type === "fieldGroup") {
          jsonObject = this.addObjectFields(field, jsonObject);
        } else {
          const value = field.type === "checkbox" ? field.checked : field.value;
          if (
            field.errMsg !== undefined &&
            field.errMsg !== "" &&
            (field.visible === undefined || field.visible === true)
          ) {
            this.errFlag = true;
          }
          if (
            field.jsonPath !== undefined &&
            field.jsonPath !== "" &&
            value !== undefined &&
            value !== "" &&
            (field.visible === undefined || field.visible === true)
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
    jsonPath = jsonPath.slice(2, jsonPath.length);

    return jsonPath;
  }

  renderPages() {
    var div = document.createElement("div");
    div.id = "footerDiv";
    var footerElem = document.getElementsByTagName("FOOTER");

    var buttonJsx = (
      <Button
        variant="primary"
        id="deploy"
        key="deploKey"
        onClick={this.deploy}
      >
        Deploy{" "}
      </Button>
    );

    if (footerElem[0] != undefined) {
      footerElem[0].appendChild(div);
    }
    ReactDOM.render(buttonJsx, document.getElementById("footerDiv"));
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <Form id={"form-page-" + this.props.pageNumber}>
        <div key={"page" + this.props.pageNumber}>
          <Button
            key="try"
            variant="secondary"
            onClick={this.editYaml}
            //className="pf-u-float-right"
            //onClick={this.togglePopup}
          >
            Edit YAML
          </Button>
          {this.state.elements.map(element => {
            return element.getJsx();
          })}

          <Modal
            title=" "
            isOpen={isModalOpen}
            onClose={this.handleModalToggle}
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
                onClick={this.handleModalToggle}
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
        </div>
      </Form>
    );
  }
}
