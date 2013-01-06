/**
 * Deep extend
 * Based on  <https://gist.github.com/1868955>
 * @copyright 2012 Mikhail Yurasov
 */

if (typeof mym == "undefined") mym = {};

mym.extend = function (obj) {
  var parentRE = /#{\s*?_\s*?}/,
    slice = Array.prototype.slice,
    hasOwnProperty = Object.prototype.hasOwnProperty;

  _.each(slice.call(arguments, 1), function (source) {

    for (var prop in source) {

      if (hasOwnProperty.call(source, prop)) {

        if (_.isUndefined(obj[prop])) {
          obj[prop] = source[prop];
        } else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
          if (_.isString(obj[prop])) {
            obj[prop] = source[prop].replace(parentRE, obj[prop]);
          }
        } else if (_.isArray(obj[prop]) || _.isArray(source[prop])) {
          if (!_.isArray(obj[prop]) || !_.isArray(source[prop])) {
            throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
          } else {
            obj[prop] = _.reject(mym.extend(obj[prop], source[prop]), function (item) {
              return _.isNull(item);
            });
          }
        } else if ((_.isObject(obj[prop]) || _.isObject(source[prop])) && !_.isNull(obj[prop])) {
           obj[prop] = mym.extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }

      }

    }
  });

  return obj;
}