import _ from 'lodash';
import angular from 'angular';
import QueryFormatter from 'ui/parse_query/lib/queryFormatter';

/**
 * Take text from the model and present it to the user as a string
 * @param {text} model value
 * @returns {string}
 */
export default function toUser(text) {
  if (text == null) return '';
  if (_.isObject(text)) {
    if (text.query_string) return toUser(text.query_string.query);
    try {
      var result = QueryFormatter.formatQuery(text);
      if (result === undefined) {
        return angular.toJson(text);
      }
    } catch (e) {
      return angular.toJson(text);
    }
  }
  return '' + text;
};
