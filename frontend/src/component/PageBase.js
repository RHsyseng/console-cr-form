import React, { Component } from "react";

//import { Form } from "@patternfly/react-core";
import {
  FormGroup,
  TextInput,
  TextArea,
  FormSelectOption,
  FormSelect,
  Radio,
  Button,
  ActionGroup,
  Checkbox
} from "@patternfly/react-core";
import validator from "validator";
import JSONPATH from "jsonpath";
//import { OPERATOR_NAME } from "./common/GuiConstants";
import * as utils from "./common/CommonUtils";

export default class PageBase extends Component {
  componentDidMount() {
    this.renderComponents();
  }

  onSubmit = () => {
    console.log("onSubmit is clicked" + this.state.pageNumber);
    console.log(
      "onSubmit is clicked" + this.state.jsonForm.pages[0].fields.length
    );
    var j = this.state.pageNumber;
    var cnt = 0;
    if (j < 2) {
      while (j >= 0) {
        console.log(
          "onSubmit is clicked" + this.state.jsonForm.pages[j].fields.length
        );
        cnt = cnt + this.state.jsonForm.pages[j].fields.length + 2;
        j--;
      }
    }
    //console.log(The no of field needed for yaml creation on editcnt + "cnt");
    var elem = document.getElementById("main_form").elements;
    const len = cnt > 0 ? cnt : elem.length;
    var str = "";
    var sampleYaml = {};
    for (var i = 0; i < len; i++) {
      if (elem[i].type != "button") {
        var jsonpath = document
          .getElementById(elem[i].id)
          .getAttribute("jsonpath");
        if (
          elem[i].value != null &&
          elem[i].value != "" &&
          elem[i].name != "alt-form-checkbox-1" &&
          jsonpath != "$.spec.auth.sso" &&
          jsonpath != "$.spec.auth.ldap"
        ) {
          str += "Name: " + elem[i].name + " ";
          str += "Type: " + elem[i].type + " ";
          str += "Value: " + elem[i].value + " ";
          str += "                                                 ";

          var tmpJsonPath = utils.getJsonSchemaPathForYaml(jsonpath);
          const value =
            elem[i].type === "checkbox" ? elem[i].checked : elem[i].value;
          if (tmpJsonPath.search(/\*/g) != -1) {
            tmpJsonPath = utils.replaceStarwithPos(elem[i], tmpJsonPath);
          }
          //
          sampleYaml[tmpJsonPath] = value;
          //  }
        }
      }
    }
    alert(str);
    console.log(sampleYaml);
    var result = this.props.createResultYaml(sampleYaml);
    console.log(result);
    //  alert(result);
    //  this.props.setResultYaml(result);
    this.props.togglePopup();
  };

  onCancel = () => {
    console.log("onCancel is clicked");
    alert("onCancel is clicked");
  };

  onNext = () => {
    console.log("onNext is clicked");
    alert("onNext is clicked");
  };

  onClose = () => {
    console.log("onClose is clicked");
    alert("onClose is clicked");
  };

  onChange = value => {
    console.log("onChange with value: " + value);
  };

  onChangeCheckBox = (_, event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({ [event.target.name]: value });
  };

  //onChangeEmail = (value, event) => {
  onChangeEmail = value => {
    //console.log("onChangeEmail: " + value);
    //console.log("handleEmailchange, event.target.name: " + event.target.name);
    //console.log("handleEmailchange, event.target.value: " +  event.target.value);

    if (value != null && value != "" && !validator.isEmail(value)) {
      console.log("not valid email address: " + value);
      this.setState({
        validationMessageEmail: "not valid email address"
      });
    } else {
      this.setState({
        validationMessageEmail: ""
      });
    }
  };

  //onChangeUrl = (value, event) => {
  onChangeUrl = value => {
    if (value != null && value != "" && !validator.isURL(value)) {
      console.log("not valid URL " + value);
      this.setState({
        validationMessageUrl: "not valid URL"
      });
    } else {
      this.setState({
        validationMessageUrl: ""
      });
    }
  };

  findValueFromSchema(jsonPath) {
    const schema = this.props.jsonSchema;
    //const values = schema.properties.spec.properties.environment.enum;
    //console.log("values " + JSON.stringify(values));

    //console.log("jsonPath: " + jsonPath);
    //passed in: $.spec.environment
    //jsonPath = "$..spec.properties.environment.enum";

    var queryResults = JSONPATH.query(schema, jsonPath);
    //console.log("queryResults " + JSON.stringify(queryResults[0]));

    return queryResults[0];
  }

  renderComponents = () => {
    //const pageDef = MockupData_JSON.pages[1];
    //console.log("!!!!!!!!!! renderComponents pageDef2: " + JSON.stringify(pageDef));
    const pageDef = this.state.jsonForm.pages[this.state.pageNumber];

    if (pageDef != null && pageDef != "") {
      var children = [];

      const tmpDiv = (
        <b key={this.state.pageNumber}>PAGE {this.state.pageNumber + 1}</b>
      );
      children.push(tmpDiv);
      //generate all fields
      if (pageDef.fields != null && pageDef.fields != "") {
        //loop through all fields
        pageDef.fields.forEach((field, fieldNumber) => {
          const oneComponent = this.buildOneField(field, fieldNumber);
          children.push(oneComponent);
        });
      }

      //generate all buttons
      if (pageDef.buttons != null && pageDef.buttons != "") {
        const buttonsComponent = this.buildAllButtons(pageDef.buttons);
        children.push(buttonsComponent);
      }

      //return children;
      this.setState({ children });
    } else {
      console.log("do nothing, it's an empty page.");
      //do nothing, it's an empty page.
    }
  };

  retrieveObjectMap(field, fieldnumber) {
    const key = this.state.pageNumber + "_" + fieldnumber;
    var value = this.state.objectMap.get(key);
    /*
    console.log(
      "44444444444444444444: retrieveObjectMap value: " + key + " : " + value
    );
    */
    if (value == null) {
      return "";
    } else {
      return JSON.parse(value);
    }
  }

  storeObjectMap(field, fieldnumber) {
    //first time deal with this key value pair, store fields (the whole array, can't be just field[0]) to the map
    const key = this.state.pageNumber + "_" + fieldnumber;
    /*
    console.log(
      "3333333333333333333: storeObjectMap value: " +
        key +
        " : " +
        JSON.stringify(field.fields)
    );
    */
    this.state.objectMap.set(key, JSON.stringify(field.fields));
    this.state.objectCntMap.set(key, field.fields.length);
  }

  subtractLastOneFromCurrentFields(allSubFieldsStr, sampleObjStr) {
    sampleObjStr = sampleObjStr.replace("[", "");
    sampleObjStr = sampleObjStr.replace("]", "");

    const n = allSubFieldsStr.lastIndexOf(sampleObjStr);
    /*
    console.log("!!!!!!!!!!!!!!!!!!!!sampleObjStr: " + sampleObjStr);
        console.log("!!!!!!!!!!!!!!!!!!!!astIndexOf(sampleObjStr): " + n);
    console.log(
      "!!!!!!!!!!!!!!!!!!!!allSubFieldsStr.length: " + allSubFieldsStr.length
    );
    console.log(
      "!!!!!!!!!!!!!!!!!!!!sampleObjStr.length: " + sampleObjStr.length
    );
    */
    if (n >= 0) {
      //remove the last one of sampleObjStr occurance
      allSubFieldsStr = allSubFieldsStr.substring(0, n - 1);

      if (allSubFieldsStr != "") {
        allSubFieldsStr = allSubFieldsStr + "]";
      }
      //console.log("!!!!!!!!!!!!!!!!!!!!result after: " + allSubFieldsStr);
    }
    return allSubFieldsStr;
  }

  deleteOneFieldForObj = event => {
    var fieldnumber = document
      .getElementById(event.target.id)
      .getAttribute("fieldnumber");
    //console.log("deleteOneFieldForObj, : " + JSON.parse(fieldnumber));

    var field = this.state.jsonForm.pages[this.state.pageNumber].fields[
      fieldnumber
    ];
    //console.log("deleteOneFieldForObj, field.min current value: " + field.min);

    const sampleObjStr = JSON.stringify(
      this.retrieveObjectMap(field, fieldnumber)
    );

    var allSubFieldsStr = JSON.stringify(field.fields);
    //console.log("deleteOneFieldForObj,  before delete: " + allSubFieldsStr);

    if (field.min > 0) {
      allSubFieldsStr = this.subtractLastOneFromCurrentFields(
        allSubFieldsStr,
        sampleObjStr
      );
      //console.log("deleteOneFieldForObj,  after delete: " + allSubFieldsStr);
      if (allSubFieldsStr != null && allSubFieldsStr != "") {
        field.fields = JSON.parse(allSubFieldsStr);
      } else {
        field.fields = [];
      }

      field.min = field.min - 1;
      this.renderComponents();
    } else {
      console.log("deleteOneFieldForObj, min = 0, can't delete more!");
    }
  };

  addOneFieldForObj = event => {
    var fieldnumber = document
      .getElementById(event.target.id)
      .getAttribute("fieldnumber");
    console.log("addOneFieldForObj, fieldnumber: " + JSON.parse(fieldnumber));

    const field = this.state.jsonForm.pages[this.state.pageNumber].fields[
      fieldnumber
    ];
    console.log("addOneFieldForObj, field.min current value: " + field.min);

    const sampleObj = this.retrieveObjectMap(field, fieldnumber);

    if (field.min < field.max) {
      console.log("addOneFieldForObj, min < max, add another object");
      field.min = field.min + 1;
      console.log("addOneFieldForObj, field.min new value:" + field.min);

      /* can't use this, otherwise no way to delete since string changed.
      sampleObj.forEach((tmpField, i) => {
        console.log("addOneFieldForObj, tmpField.label:" + tmpField.label);
        tmpField.label = tmpField.label + "_" + field.min;
      });
*/

      //the whole idea about this seperateObjDiv is to make the screen looks cleaner when user add a new obj
      const seperateObjDiv = JSON.parse('{"type":"seperateObjDiv"}');
      field.fields = field.fields.concat(sampleObj);
      field.fields = field.fields.concat(seperateObjDiv);

      this.props.saveJsonForm(this.state.jsonForm);
    } else {
      console.log("addOneFieldForObj, min = max, can't add more!");
    }
    this.renderComponents();
  };

  buildObject(fieldnumber) {
    const field = this.state.jsonForm.pages[this.state.pageNumber].fields[
      fieldnumber
    ];

    var randomNum = Math.floor(Math.random() * 100000000 + 1);

    const fieldGroupId =
      this.state.pageNumber +
      "-fieldGroup-" +
      fieldnumber +
      "-" +
      field.label +
      "-" +
      randomNum;
    const fieldGroupKey = "fieldGroupKey-" + fieldGroupId;
    const fieldId =
      this.state.pageNumber +
      "-field-" +
      fieldnumber +
      "-" +
      field.label +
      "-" +
      randomNum;
    const fieldKey = "fieldKey-" + fieldId;
    var jsxArray = [];
    var fieldJsx = (
      <ActionGroup fieldid={fieldGroupId} key={fieldGroupKey}>
        <Button
          variant="secondary"
          id={fieldId}
          key={fieldKey}
          fieldnumber={fieldnumber}
          onClick={this.addOneFieldForObj}
        >
          Add new {field.label}
        </Button>
        <Button
          variant="secondary"
          id={fieldId + 1}
          key={fieldKey + 1}
          fieldnumber={fieldnumber}
          onClick={this.deleteOneFieldForObj}
        >
          Delete last {field.label}
        </Button>
      </ActionGroup>
    );
    jsxArray.push(fieldJsx);
    jsxArray.push(
      <div key={fieldGroupId + 1}>
        =====================================================================
      </div>
    );

    var value = this.retrieveObjectMap(field, fieldnumber);
    const objCnt = this.retrieveObjectCntMap(field, fieldnumber) + 1; //getting how many field in obj e.g env has 2 name and value +1 for devider
    if (value == "") {
      //it's the first time here, never store the sample in the objectMap,
      this.storeObjectMap(field, fieldnumber);

      if (field.min == 0) {
        //if it's the 1st time here, and field.min ==0
        //so after store it to the map, remove from render json form, then it won't be displayed
        field.fields = [];
      } else if (field.min > 1) {
        //for field.min == 1 do nothing, just leave the sample there as the 1st object in array which will be displayed
        //for field.min > 1, need to insert more objects as the min value requires
        //TODO:

        console.log("!!!!!!!! TODO: add more objects");
      }
    }

    var pos = 0,
      cnt = 1,
      attrs = {};
    field.fields.forEach((subfield, i) => {
      if (field.min == 0) {
        //means don't generate the 1st one unless user press button
        //console.log("field.min == 0, won't render ");
      } else {
        //add extra attributes in fields to recognise the position of field are created  envpos, serverpos etc.
        // these attr will be replace *  by serverpos and envpos in jsonpath like  $.spec.objects.servers[*].env[*].value
        var posKey = field.label.toLowerCase() + "pos";
        attrs = {
          ...attrs,
          [posKey]: pos
        };

        let oneComponent = this.buildOneField(subfield, i, attrs);
        jsxArray.push(oneComponent);

        //assigning each fiels for object with same pos and increment the pos when all fields are done
        if (cnt == objCnt) {
          //console.log("Incrementing pos from " + pos + " to " + (pos + 1));
          pos++;
          cnt = 0;
        }
        cnt++;
      }
    });
    jsxArray.push(
      <div key={fieldGroupId + 2}>
        =====================================================================
      </div>
    );
    return jsxArray;
  }

  retrieveObjectCntMap(field, fieldnumber) {
    const key = this.state.pageNumber + "_" + fieldnumber;
    var value = this.state.objectCntMap.get(key);

    // console.log(
    //   "retrieveObjectCntMap value::::::::: " + key + " : " + value
    // );

    if (value == null) {
      return "";
    } else {
      return value;
    }
  }
  buildOneField(field, fieldNumber, attrs) {
    //console.log("buildOneField " + fieldNumber);
    //console.log("55555555555field.type: " + JSON.stringify(field));

    var randomNum = Math.floor(Math.random() * 100000000 + 1);

    const fieldGroupId =
      this.state.pageNumber +
      "-fieldGroup-" +
      fieldNumber +
      "-" +
      field.label +
      "-" +
      randomNum;
    const fieldGroupKey = "fieldGroupKey-" + fieldGroupId;
    const fieldId =
      this.state.pageNumber +
      "-field-" +
      fieldNumber +
      "-" +
      field.label +
      "-" +
      randomNum;
    const fieldKey = "fieldKey-" + fieldId;
    const textName = field.label;

    var fieldJsx = "";
    if (field.type == "dropDown") {
      var options = [];
      const tmpJsonPath = utils.getJsonSchemaPathForJsonPath(field.jsonPath);
      const optionValues = this.findValueFromSchema(tmpJsonPath + ".enum");
      if (optionValues !== undefined) {
        optionValues.forEach(option => {
          const oneOption = {
            label: option,
            value: option
          };
          options.push(oneOption);
        });
      }
      //  const tmpJsonPath = "$..spec.properties.environment.description";
      const helpText = this.findValueFromSchema(tmpJsonPath + ".description");

      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
          helperText={helpText}
        >
          <FormSelect
            id={fieldId}
            key={fieldKey}
            name={textName}
            jsonpath={field.jsonPath}
          >
            {options.map((option, index) => (
              <FormSelectOption
                isDisabled={option.disabled}
                id={fieldId + index}
                key={fieldKey + index}
                value={option.value}
                label={option.label}
              />
            ))}
          </FormSelect>
        </FormGroup>
      );
    } else if (field.type == "textArea") {
      fieldJsx = (
        <FormGroup
          label={field.label}
          isRequired
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <TextArea
            value={field.default}
            name="horizontal-form-exp"
            id={fieldId}
            key={fieldKey}
            jsonpath={field.jsonPath}
          />
        </FormGroup>
      );
    } else if (field.type == "radioButton") {
      const fieldIdTrue = fieldId + "-true";
      const fieldKeyTrue = fieldKey + "-true";
      const fieldIdFalse = fieldId + "-false";
      const fieldKeyFalse = fieldKey + "-false";
      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <Radio
            label="Yes"
            aria-label="radio yes"
            id={fieldIdTrue}
            key={fieldKeyTrue}
            name="horizontal-radios"
            jsonpath={field.jsonPath}
          />
          <Radio
            label="No"
            aria-label="radio no"
            id={fieldIdFalse}
            key={fieldKeyFalse}
            name="horizontal-radios"
            jsonpath={field.jsonPath}
          />
        </FormGroup>
      );
    } else if (field.type == "object") {
      fieldJsx = this.buildObject(fieldNumber);
    } else if (field.type == "email") {
      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <TextInput
            type="text"
            id={fieldId}
            key={fieldKey}
            name={textName}
            onChange={this.onChangeEmail}
            jsonpath={field.jsonPath}
          />
        </FormGroup>
      );
    } else if (field.type == "url") {
      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <TextInput
            type="text"
            id={fieldId}
            key={fieldKey}
            name={textName}
            onChange={this.onChangeUrl}
            jsonpath={field.jsonPath}
          />
        </FormGroup>
      );
    } else if (field.type == "password") {
      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <TextInput
            type="password"
            id={fieldId}
            key={fieldKey}
            name={textName}
            onChange={this.onChange}
            jsonpath={field.jsonPath}
          />
        </FormGroup>
      );
    } else if (field.type == "checkbox") {
      var name = "checkbox-" + fieldNumber;
      var isChecked = field.default == "true" || field.default == "TRUE";
      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <Checkbox
            isChecked={isChecked}
            onChange={this.onChangeCheckBox}
            id={fieldId}
            key={fieldKey}
            aria-label="checkbox yes"
            name={name}
            jsonpath={field.jsonPath}
          />
        </FormGroup>
      );
    } else if (field.type == "seperateObjDiv") {
      fieldJsx = (
        <div key={fieldKey}>
          ------------------------------------------------------------------------------------------------------------------
        </div>
      );
    } else {
      fieldJsx = (
        <FormGroup
          label={field.label}
          fieldId={fieldGroupId}
          key={fieldGroupKey}
        >
          <TextInput
            isRequired
            type="text"
            id={fieldId}
            key={fieldKey}
            aria-describedby="horizontal-form-name-helper"
            name={textName}
            onChange={this.onChange}
            jsonpath={field.jsonPath}
            {...attrs}
          />
        </FormGroup>
      );
    }

    return fieldJsx;
  }

  buildAllButtons(buttons) {
    var buttonsJsx = [];
    //loop through all
    buttons.forEach((button, i) => {
      const key = this.state.pageNumber + "-form-key-" + button.label + i;

      var buttonJsx = "";
      if (button.action != null && button.action == "submit") {
        buttonJsx = (
          <Button variant="primary" key={key} onClick={this.onSubmit}>
            {button.label}
          </Button>
        );
      } else if (button.action != null && button.action == "cancel") {
        buttonJsx = (
          <Button variant="secondary" key={key} onClick={this.onCancel}>
            {button.label}
          </Button>
        );
      } else if (button.action != null && button.action == "next") {
        buttonJsx = (
          <Button variant="secondary" key={key} onClick={this.onNext}>
            {button.label}
          </Button>
        );
      } else if (button.action != null && button.action == "close") {
        buttonJsx = (
          <Button variant="secondary" key={key} onClick={this.onClose}>
            {button.label}
          </Button>
        );
      }

      buttonsJsx.push(buttonJsx);
    });

    const actionGroupKey = this.state.pageNumber + "-action-group";
    return <ActionGroup key={actionGroupKey}>{buttonsJsx}</ActionGroup>;
  }

  render() {
    return <div>{this.state.children}</div>;
  }

  /*
  renderMultipleComponents = (label, operator, tempRenderJson) => {
    const objDef = objJson[operator + "_" + label];

    console.log(
      "!!!!!!!!!! renderComponents tempRenderJson objDefobjDef***: " +
        JSON.stringify(objDef)
    );
    //
    // var obj = JSON.parse(jsonStr);
    var x;
    let obj = objDef.fields;

    for (x in obj) {
      tempRenderJson.push(obj[x]);
      // jsonStr = JSON.stringify(obj);
    }
    // this.state.children = [];
    return tempRenderJson;
  };

  onAddObject = () => {
    var x, currentFields, fields;
    currentFields = this.state.renderJson.fields;
    console.log("onAddObject is clicked****", currentFields);
    var tempRenderJson = [];

    for (x in currentFields) {
      fields = currentFields[x];
      tempRenderJson.push(fields);

      // if (fields.label === "Env") {
      if (fields.type == "object") {
        //   console.log("onAddObject is clicked****", fields.type);
        this.renderMultipleComponents(
          fields.label,
          OPERATOR_NAME,
          tempRenderJson
        );
      }
    }
    // console.log(
    //   "!!!!!!!!!! renderComponents tempRenderJson:::: " +
    //     JSON.stringify(tempRenderJson)
    // );
    let newRenderJson = {
      fields: [{}],
      buttons: [{}]
    };
    // console.log(
    //   "!!!!!!!!!! renderComponents newRenderJs+===== " +
    //     JSON.stringify(newRenderJson.fields)
    // );
    newRenderJson = { ...newRenderJson, fields: tempRenderJson };
    newRenderJson = {
      ...newRenderJson,
      buttons: this.state.pageDef.buttons
    };

    // console.log(
    //   "!!!!!!!!!! renderComponents newRenderJson:::: " +
    //     JSON.stringify(newRenderJson)
    // );

    this.setState({ renderJson: newRenderJson });
    //  this.state.children = [];

    this.renderComponents(newRenderJson);
  };

  onDeleteObject = () => {
    // console.log(
    //   "!!!!!!!!!! renderComponents newRenderJson:::: " +
    //     JSON.stringify(this.state.renderJson)
    // );

    var tempRenderJson = this.state.renderJson;
    var newChildren = [];
    tempRenderJson.fields.splice(tempRenderJson.fields.length - 2, 2);
    this.setState({ renderJson: tempRenderJson });
    //  this.state.children = [];
    this.setState({
      children: [this.state.children, newChildren]
    });

    this.renderComponents(tempRenderJson);
};*/
}
