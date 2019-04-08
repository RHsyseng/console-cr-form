import React, { Component } from "react";

import YAML from "js-yaml";

//import { Form } from "@patternfly/react-core";
import { Button, ActionGroup, Checkbox } from "@patternfly/react-core";

import { USE_MOCK_DATA } from "./common/GuiConstants";
import { MockupData_JSON, MockupData_JSON_SCHEMA } from "./common/MockupData";

import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    let passedInJsonForm;
    //this is the render json form, which will be updated on-the-fly.
    let jsonForm;
    let jsonSchema;
    let useMockdataWarning;
    if (USE_MOCK_DATA) {
      passedInJsonForm = MockupData_JSON;
      jsonForm = JSON.parse(JSON.stringify(passedInJsonForm));
      jsonSchema = MockupData_JSON_SCHEMA;
      useMockdataWarning = "USING MOCK DATA!!!!!";
    } else {
      passedInJsonForm = JSON.parse(
        document.getElementById("golang_json_form").innerHTML
      );
      jsonForm = JSON.parse(JSON.stringify(passedInJsonForm));

      jsonSchema = JSON.parse(
        document.getElementById("golang_json_schema").innerHTML
      );
    }

    //let jsonForm = this.convertPassedInToRenderJson(passedInJsonForm);

    this.state = {
      useMockdataWarning,
      jsonForm,
      jsonSchema
    };
  }

  /*
  convertPassedInToRenderJson = passedInJsonForm => {
    let renderJson;
    if (passedInJsonForm != null) {
      passedInJsonForm.pages.forEach((pageDef, i) => {
        console.log("page number: " + i);

        //generate all fields
        if (pageDef.fields != null && pageDef.fields != "") {
          let tmpPage = [];
          //loop through all fields
          pageDef.fields.forEach(field => {
            if (field.type != "object") {
              tmpPage.push(field);
            }
          });
        }

        //loop through all fields
        pageDef.fields.forEach(field => {
          if (field.type != "object") {
            tmpPage.push(field);
          }
        });
      }
      });
    }

    return passedInJsonForm;
  };
  */

  saveJsonForm = inputJsonForm => {
    this.setState({
      jsonForm: inputJsonForm
    });
  };
  /*
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
*/
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
    var str = "";
    var elem = document.getElementById("main_form").elements;
    for (var i = 0; i < elem.length; i++) {
      if (elem[i].type != "button") {
        if (elem[i].value != null && elem[i].value != "") {
          str += "Name: " + elem[i].name + " ";
          str += "Type: " + elem[i].type + " ";
          str += "Value: " + elem[i].value + " ";
          str += "                                                 ";
        }
      }
    }
    alert(str);
  };

  handleAddPlanFormChange = e => {
    console.log("handleAddPlanFormChange, e.target.name: " + e.target.name);
    if (e.target.name == "name") {
      this.setState({ name: e.target.value });
    } else if (e.target.name == "description") {
      this.setState({ description: e.target.value });
    } else if (e.target.name == "sourceContainerId") {
      this.setState({ sourceContainerId: e.target.value });
    } else if (e.target.name == "targetContainerId") {
      this.setState({ targetContainerId: e.target.value });
    } else if (e.target.name == "targetProcessId") {
      this.setState({ targetProcessId: e.target.value });
    } else if (e.target.name == "mappings") {
      this.setState({ mappings: e.target.value });
    }
  };

  render() {
    /*
//This can dynamically generate the pages, but it mess up the map which store the sampleObj for array, so can't use it now
    function DisplayPages(props) {
      const jsonForm = props.jsonForm;
      //generate all fields
      if (jsonForm.pages != null) {
        //loop through all pages

        var jsxArray = [];

        jsonForm.pages.forEach((page, pageNumber) => {
          const eachPage = (
            <div key={pageNumber}>
              ===<b>PAGE{pageNumber + 1}</b> ==================================
              <EachPage
                jsonForm={props.jsonForm}
                jsonSchema={props.jsonSchema}
                saveJsonForm={props.saveJsonForm}
                pageNumber={pageNumber}
              />
            </div>
          );
          jsxArray.push(eachPage);
        });
        return jsxArray;
      }
    }

    <!--tr>
      <td>
        <DisplayPages
          jsonForm={this.state.jsonForm}
          jsonSchema={this.state.jsonSchema}
          saveJsonForm={this.saveJsonForm}
        />
      </td>
    </tr-->

*/
    return (
      <div>
        <form
          className="form-horizontal"
          name="dynamic_operator_form"
          id="main_form"
          onChange={this.handleAddPlanFormChange}
        >
          <font size="6">{this.state.useMockdataWarning}</font>
          <table border="1" align="center">
            <tbody>
              <tr>
                <td>
                  <Page1
                    jsonForm={this.state.jsonForm}
                    jsonSchema={this.state.jsonSchema}
                    saveJsonForm={this.saveJsonForm}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Page2
                    jsonForm={this.state.jsonForm}
                    jsonSchema={this.state.jsonSchema}
                    saveJsonForm={this.saveJsonForm}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Page3
                    jsonForm={this.state.jsonForm}
                    jsonSchema={this.state.jsonSchema}
                    saveJsonForm={this.saveJsonForm}
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
        </form>
      </div>
    );
  }
}
