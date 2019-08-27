// prettier-ignore
import lodash from 'lodash';

class Formatter {
  static extend(...objectSources) {
    return lodash.assignIn({}, ...objectSources);
  }

  static merge(source, ...objects) {
    if (!source) {
      return lodash.merge({}, ...objects);
    } else {
      return lodash.merge(source, ...objects);
    }
  }

  static assign(...objects) {
    return lodash.assign({}, ...objects);
  }

  static pickFromObject(object, keys) {
    return lodash.pick(object, keys);
  }

  static clone(...objects) {
    return lodash.clone({}, ...objects);
  }

  static deepCloneArrayOfObject(arrayOfObjects) {
    return lodash.cloneDeep(arrayOfObjects);
  }

  static forEach(value, callback) {
    return lodash.forEach(value, callback);
  }

  static getValue(object, path, defaultValue) {
    return lodash.get(object, path, defaultValue);
  }

  static sortData(data, iteratees, order) {
    return lodash.orderBy(data, iteratees, order);
  }

  static getKeys(object) {
    return lodash.keys(object);
  }

  static getValues(object) {
    return lodash.values(object);
  }

  static forIn(object, iteratee) {
    if (lodash.isObject(object) && lodash.isFunction(iteratee)) {
      return lodash.forIn(object, iteratee);
    } else {
      return "Invalid";
    }
  }

  static find(collection, callback) {
    return lodash.find(collection, callback);
  }

  static map(collection, callback) {
    return lodash.map(collection, callback);
  }

  static groupBy(collection, callback) {
    return lodash.groupBy(collection, callback);
  }

  static unique(collection) {
    return lodash.uniq(collection);
  }

  static uniqueWith(collection) {
    return lodash.uniqWith(collection, lodash.isEqual);
  }

  static toPairs(object) {
    return lodash.toPairs(object);
  }

  static chain(value) {
    return lodash.chain(value);
  }

  static zipObject(propArrays, valueArrays) {
    return lodash.zipObject(propArrays, valueArrays);
  }

  static fromPairs(pairs) {
    return lodash.fromPairs(pairs);
  }

  static mapKeys(object, callback) {
    return lodash.mapKeys(object, callback);
  }

  static findIndex(array, callback, fromIndex) {
    return lodash.findIndex(array, callback, fromIndex);
  }

  static filter(collection, callback) {
    return lodash.filter(collection, callback);
  }

  static range(number) {
    return lodash.range(number);
  }

  static includes(collection, value) {
    return lodash.includes(collection, value);
  }

  static remove(array, callback) {
    return lodash.remove(array, callback);
  }

  static keyBy(collection, callback) {
    return lodash.keyBy(collection, callback);
  }

  static mapValues(collection, callback) {
    return lodash.mapValues(collection, callback);
  }

  static flatten(array) {
    return lodash.flatten(array);
  }
}

export default Formatter;
