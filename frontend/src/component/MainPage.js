import React, { Component } from "react";

import axios from "axios";
import YAML from "js-yaml";

import { Button, ActionGroup, Checkbox } from "@patternfly/react-core";

import { BACKEND_URL, USE_MOCK_DATA, FAKE_SUBMIT } from "./common/GuiConstants";
import { MockupData_JSON, MockupData_JSON_SCHEMA } from "./common/MockupData";

import Page1 from "./page1/Page1";
import Page2 from "./page2/Page2";
import Page3 from "./page3/Page3";

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    let jsonForm;
    let jsonSchema;
    let useMockdataWarning;
    if (USE_MOCK_DATA) {
      jsonForm = MockupData_JSON;
      jsonSchema = MockupData_JSON_SCHEMA;
      useMockdataWarning = "USING MOCK DATA!!!!!";
    } else {
      jsonForm = JSON.parse(
        document.getElementById("golang_json_form").innerHTML
      );
      jsonSchema = JSON.parse(
        document.getElementById("golang_json_schema").innerHTML
      );
    }

    this.state = {
      useMockdataWarning,
      jsonForm,
      jsonSchema,
      value1: "",
      value2: "",
      value3: "",
      value4: "please choose",
      name: ""
    };
  }

  setValue1 = value1 => {
    this.setState({
      value1
    });
  };

  setValue2 = value2 => {
    this.setState({
      value2
    });
  };

  setValue3 = value3 => {
    this.setState({
      value3
    });
  };

  setValue4 = value4 => {
    this.setState({
      value4
    });
  };

  setName = name => {
    console.log("set state Name " + name);
    this.setState({
      name
    });
  };

  convertStatesToYaml = () => {
    const spec = {};
    spec.environment = this.state.value3;
    spec.applicationName = this.state.value4;

    const formData = {
      name: this.state.name,
      apiVersion: this.state.value1,
      kind: this.state.value2,
      spec: spec
    };

    return YAML.safeDump(formData);
  };

  cancel = () => {
    console.log("cancle button is clicked, do nothing for now");
  };

  submit = () => {
    var resultYaml = this.convertStatesToYaml();
    console.log("MainPage submit: " + resultYaml);

    const servicsUrl = BACKEND_URL;
    console.log("servicsUrl: " + servicsUrl);
    if (!FAKE_SUBMIT) {
      axios
        .post(servicsUrl, resultYaml, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(function(response) {
          console.log("submit response: " + response.data);
        })
        .catch(function(error) {
          console.log("submit error: " + error);
        });
    } else {
      console.log("mock submit");
    }
  };

  render() {
    const golangJsonForm = document.getElementById("golang_json_form")
      .innerHTML;
    return (
      <div>
        <font size="6">{this.state.useMockdataWarning}</font>
        <table border="1" align="center">
          <tbody>
            <tr>
              <td>
                <b>Page1</b>
                <Page1
                  value1={this.state.value1}
                  value2={this.state.value2}
                  value3={this.state.value3}
                  value4={this.state.value4}
                  setValue1={this.setValue1}
                  setValue2={this.setValue2}
                  setValue3={this.setValue3}
                  setValue4={this.setValue4}
                  jsonForm={this.state.jsonForm}
                  jsonSchema={this.state.jsonSchema}
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Page2</b>{" "}
                <Page2
                  jsonForm={this.state.jsonForm}
                  jsonSchema={this.state.jsonSchema}
                  setName={this.setName}
                />
              </td>
            </tr>
            <tr>
              <td>
                <b>Page3</b>{" "}
                <Page3
                  jsonForm={this.state.jsonForm}
                  jsonSchema={this.state.jsonSchema}
                />
              </td>
            </tr>

            <tr>
              <td>
                <ActionGroup>
                  <Button variant="primary" onClick={this.submit}>
                    Submit form
                  </Button>
                  <Button variant="secondary" onClick={this.cancel}>
                    Cancel
                  </Button>
                  <Checkbox
                    label="Remember this setting"
                    aria-label="Remember this setting"
                    id="alt-form-checkbox-1"
                    name="alt-form-checkbox-1"
                  />
                </ActionGroup>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
