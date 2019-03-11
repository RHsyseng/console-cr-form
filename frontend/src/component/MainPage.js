import React, { Component } from 'react';

import axios from 'axios';
import YAML from 'js-yaml';

import {BACKEND_URL, USE_MOCK_DATA} from './common/GuiConstants';
import Page1 from './page1/Page1'
import Page2 from './page2/Page2'

export default class MainPage extends Component {

    constructor(props) {
      super(props);
      this.state = {
          value1: '',
          value2: '',
          value3: '',
          value4: 'please choose'
      };
    }

    setValue1 = (value1) =>{
        this.setState({
            value1
         });
    }

    setValue2 = (value2) =>{
        this.setState({
            value2
         });
    }

    setValue3 = (value3) =>{
        this.setState({
            value3
         });
    }

    setValue4 = (value4) =>{
        this.setState({
            value4
         });
    }

    convertStatesToYaml = () => {
      const spec = {};
      spec.environment = this.state.value3;
      spec.applicationName = this.state.value4;

      const formData = {
        apiVersion: this.state.value1,
        kind: this.state.value2,
        spec: spec
      };

      return YAML.safeDump(formData);
    }


    submit = () =>{
        var resultYaml = this.convertStatesToYaml();
        console.log('MainPage submit: ' + resultYaml);

        const servicsUrl = BACKEND_URL;
        console.log('servicsUrl: ' + servicsUrl);
        if (!USE_MOCK_DATA) {
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
        }else{
            console.log("mock submit");
        }

    }

  render() {

    return (
<div>
  <table border="1">
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
          />
        </td>
      </tr>
      <tr>
        <td>
          <b>Page2</b> <Page2 />
        </td>
      </tr>
      <tr>
        <td>
          <button onClick={this.submit}>Submit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


    );
  }
}
