import React, { Component } from "react";

import {
  FormGroup,
  FormSelectOption,
  FormSelect
} from "@patternfly/react-core";

import FieldFactory from "./FieldFactory";
import JSONPATH from "jsonpath";

import { connect } from "react-redux";
import { Dispatchers } from "../../../../redux/";
import Formatter from "../../../../utils/formatter";
import Validator from "../../../../utils/validator";

const mapStateToProps = state => {
  return {
    // currentSteps: state.steps.stepList,
    // originalSteps: state.steps.originalStepList,
    currentPages: state.pages.pageList,
    originalPages: state.pages.originalPageList
  };
};

const mapDispatchToProps = dispatch => {
  return Formatter.extend(
    Dispatchers.steps(dispatch),
    Dispatchers.pages(dispatch)
  );
};

const stepName = "Components",
  itemName = "Smart Router",
  rhdmEnvPrefix = "rhdm",
  rhpamEnvPrefix = "rhpam",
  fieldName = "Environment";

class UnconnectedDropdownField extends Component {
  constructor(props) {
    super(props);
    if (
      props.fieldDef.value === undefined &&
      props.fieldDef.default !== undefined
    ) {
      this.props.fieldDef.value = props.fieldDef.default;
    }
    this.state = {
      value: this.props.fieldDef.value,
      isValid: true,
      errMsg: this.props.fieldDef.errMsg
    };
    this.props = props;
  }

  updateFieldInPage(fieldObj, pageList) {
    let newPageList = [];
    if (Validator.isEmptyArray(pageList) || Validator.isEmpty(fieldObj)) {
      return;
    }
    newPageList = Formatter.filter(pageList, page => {
      let fieldIndex = Formatter.findIndex(page.fields, field => {
        return field.label === fieldObj.label;
      });

      if (fieldIndex > -1) {
        page.fields.splice(fieldIndex, 1, fieldObj);
        return page;
      } else {
        return page;
      }
    });
    return newPageList;
  }

  getJsonSchemaPathForJsonPath(jsonPath) {
    if (jsonPath !== undefined && jsonPath !== "") {
      jsonPath = jsonPath.slice(2, jsonPath.length);
      jsonPath = jsonPath.replace(/\./g, ".properties.");
      jsonPath = "$.." + jsonPath;
    }
    return jsonPath;
  }

  getJsx() {
    let { value, isValid, errMsg } = this.state;
    let options = [
      {
        value: "",
        label: "Select here"
      }
    ];

    if (this.props.fieldDef.options) {
      options = this.props.fieldDef.options;
    } else {
      const tmpJsonPath = this.getJsonSchemaPathForJsonPath(
        this.props.fieldDef.originalJsonPath
      );
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
    }
    if (
      this.props.fieldDef.required === true &&
      (this.props.fieldDef.value === undefined ||
        this.props.fieldDef.value === "")
    ) {
      errMsg = this.props.fieldDef.label + " is required.";
      isValid = false;
    } else {
      errMsg = "";
      isValid = true;
    }
    this.props.fieldDef.errMsg = errMsg;

    var jsxArray = [];
    jsxArray.push(
      <FormGroup
        label={this.props.fieldDef.label}
        id={this.props.ids.fieldGroupId}
        key={this.props.ids.fieldGroupKey}
        helperTextInvalid={errMsg}
        helperText={this.props.fieldDef.description}
        fieldId={this.props.ids.fieldId}
        isValid={isValid}
        isRequired={this.props.fieldDef.required}
      >
        <FormSelect
          id={this.props.ids.fieldId}
          key={this.props.ids.fieldKey}
          name={this.props.fieldDef.label}
          jsonpath={this.props.fieldDef.jsonPath}
          onChange={this.onSelect}
          value={value}
        >
          {options.map((option, index) => (
            <FormSelectOption
              key={this.props.ids.fieldKey + index}
              value={option.value}
              label={option.label}
            />
          ))}
        </FormSelect>
      </FormGroup>
    );
    jsxArray.push(this.addChildren());
    return jsxArray;
  }

  addChildren() {
    var elements = [];

    if (this.props.fieldDef.fields) {
      this.props.fieldDef.fields.forEach((subfield, i) => {
        var parentjsonpath = this.props.fieldDef.jsonPath;
        if (parentjsonpath !== undefined && parentjsonpath !== "") {
          parentjsonpath = parentjsonpath.slice(
            0,
            parentjsonpath.lastIndexOf(".")
          );
          var res = "";
          if (parentjsonpath.length < subfield.jsonPath.length) {
            res = subfield.jsonPath.substring(
              parentjsonpath.length,
              subfield.jsonPath.length
            );
            subfield.jsonPath = parentjsonpath.concat(res);
          }
        }
        if (subfield.type != "object") {
          let oneComponent = FieldFactory.newInstance(
            subfield,
            i,
            this.props.pageNumber,
            this.props.jsonSchema,
            this.props.page
          );
          elements.push(oneComponent);
        } else {
          if (subfield.label === this.props.fieldDef.value) {
            //when the drop down value matches field group
            subfield.visible = true;
          }
          let oneComponent = FieldFactory.newInstance(
            subfield,
            i,
            this.props.pageNumber,
            this.props.jsonSchema,
            this.props.page,
            this.props.fieldNumber
          );
          elements.push(oneComponent);
        }
      });
    }
    return elements;
  }

  onSelect = (_, event) => {
    let value = event.target.value;
    const { currentPages, originalPages } = this.props;
    let copyOfCurrentPages = [],
      copyOfOriginalPages = Formatter.deepCloneArrayOfObject(originalPages);

    this.isValidField(value);
    this.reBuildChildren(value);

    this.props.props.page.loadPageChildren();

    if (Validator.isEmptyArray(currentPages)) {
      copyOfCurrentPages = Formatter.deepCloneArrayOfObject(originalPages);
    } else {
      copyOfCurrentPages = Formatter.deepCloneArrayOfObject(currentPages);
    }

    if (this.props.fieldDef.label === fieldName) {
      if (value.indexOf(rhdmEnvPrefix) > -1) {
        // remove the Smart Router item from pages
        copyOfCurrentPages = Formatter.filter(copyOfCurrentPages, page => {
          let subPageList = [];
          if (page.label === stepName) {
            subPageList = Formatter.filter(page.subPages, subPage => {
              return subPage.label !== itemName;
            });
            page.subPages = subPageList;
            return page;
          } else {
            return page;
          }
        });

        //update the related field.
        copyOfCurrentPages = this.updateFieldInPage(
          this.props.fieldDef,
          copyOfCurrentPages
        );

        // modify the pages in the redux store.
        this.props.dispatchUpdatePages(copyOfCurrentPages);
      } else if (
        !Validator.isEqual(
          copyOfCurrentPages,
          copyOfOriginalPages && value.indexOf(rhpamEnvPrefix) > -1
        )
      ) {
        //update the related field.
        copyOfCurrentPages = this.updateFieldInPage(
          this.props.fieldDef,
          copyOfCurrentPages
        );

        //merge all the values
        copyOfCurrentPages = Formatter.getValues(
          Formatter.merge(copyOfOriginalPages, copyOfCurrentPages)
        );

        // modify the pages in the redux store.
        this.props.dispatchUpdatePages(copyOfCurrentPages);
      } else {
        //update the related field.
        copyOfOriginalPages = this.updateFieldInPage(
          this.props.fieldDef,
          copyOfOriginalPages
        );
        this.props.dispatchUpdatePages(copyOfOriginalPages);
      }
    }
  };

  reBuildChildren(value) {
    if (this.props.fieldDef.fields) {
      this.props.fieldDef.fields.forEach(subfield => {
        if (subfield.type === "fieldGroup") {
          if (subfield.displayWhen === value) {
            subfield.visible = true;
          } else {
            subfield.visible = false;
          }
        }
      });
    }
  }

  findValueFromSchema(jsonPath) {
    try {
      var queryResults = JSONPATH.query(this.props.jsonSchema, jsonPath);

      if (Array.isArray(queryResults) && queryResults.length > 0) {
        return queryResults[0];
      }
    } catch (error) {
      console.debug("Failed to find a value from schema", error);
    }
    return [];
  }

  isValidField(value) {
    let isValid = true;
    let errMsg = "";
    this.props.fieldDef.value = value;
    this.props.fieldDef.visible = true; //if not changed visible was remains as false or undefined and validations of fields ignored
    if (this.props.fieldDef.required === true && value === "") {
      errMsg = this.props.fieldDef.label + " is required.";
      isValid = false;
    } else {
      errMsg = "";
      isValid = true;
    }
    this.props.fieldDef.errMsg = this.errMsg;
    this.setState({
      value,
      isValid,
      errMsg
    });
  }
  render() {
    return this.getJsx();
  }
}

const DropdownField = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedDropdownField);
export { DropdownField };
