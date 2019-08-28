// prettier-ignore
import lodash from 'lodash';

class Validator {
  static isEmpty(value) {
    if (lodash.isObject(value)) {
      return this.isEmptyObject(value);
    } else if (lodash.isArray(value)) {
      return this.isEmptyArray(value);
    } else {
      return lodash.isNil(value) || !value;
    }
  }

  static isEmptyArray(array) {
    if (lodash.isArray(array)) {
      if (array.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  static isNil(value) {
    return lodash.isNil(value);
  }

  static isUndefined(value) {
    return lodash.isUndefined(value);
  }

  static isEmptyObject(value) {
    return lodash.isEmpty(value);
  }

  static isInteger(value) {
    return lodash.isInteger(value);
  }

  static isArray(value) {
    return lodash.isArray(value);
  }

  static isString(value) {
    return lodash.isString(value);
  }

  static isFunction(value) {
    return lodash.isFunction(value);
  }

  static isObject(value) {
    return lodash.isObject(value);
  }

  static isBoolean(value) {
    return lodash.isBoolean(value);
  }

  static isJsonString(value) {
    if (value && typeof value === "string") {
      // eslint-disable-next-line
      return (
        (value[0] === "{" && value[value.length - 1] === "}") ||
        (value[0] === "[" && value[value.length - 1] === "]")
      );
    }

    return false;
  }

  static isEqual(object, source) {
    return lodash.isEqual(object, source);
  }

  static isIPAddress(address) {
    // eslint-disable-next-line
    let reg = RegExp(
      "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"
    );
    let isIP = false;

    if (reg.test(address)) {
      isIP = true;
    }

    return isIP;
  }

  static isDateTimeString(dateTimeString) {
    let formattedDateTimeString;

    // eslint-disable-next-line
    let dateTimeReg = RegExp(
      "^([0-9][0-9]{3})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1]) ([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])( ([-+]([0-1][0-9]):00))?$"
    );
    let dateReg = RegExp(
      "^([0-9][0-9]{3})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])$"
    );
    let dateTimeMillionSecReg = RegExp(
      "^([0-9][0-9]{3})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1]) ([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]):([0-9][0-9][0-9])$"
    );
    let isDateTime = false;

    if (this.isString(dateTimeString)) {
      formattedDateTimeString = dateTimeString.trim();
    }

    if (
      dateTimeReg.test(formattedDateTimeString) ||
      dateReg.test(formattedDateTimeString) ||
      dateTimeMillionSecReg.test(formattedDateTimeString)
    ) {
      isDateTime = true;
    }

    return isDateTime;
  }

  //determin if all properties has empty values in an object
  static isObjectPropertyAllHasEmptyValue(object) {
    if (lodash.isObject(object)) {
      for (let key in object) {
        if (
          object[key] !== "" &&
          !this.isEmptyArray(object[key]) &&
          !this.isEmpty(object[key])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  static isActivationTypeString(activationTypeString) {
    let formattedActivationTypeString;
    let isActivationType = false;

    if (this.isString(activationTypeString)) {
      formattedActivationTypeString = activationTypeString.trim().toLowerCase();
    }

    if (
      formattedActivationTypeString.includes("location updates") ||
      formattedActivationTypeString.includes("lu") ||
      formattedActivationTypeString.includes("api") ||
      formattedActivationTypeString.includes("pdp")
    ) {
      isActivationType = true;
    }

    return isActivationType;
  }
}

export default Validator;
