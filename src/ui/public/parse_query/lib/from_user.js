import _ from 'lodash';
import jison from 'jison';
import DecorateQueryProvider from 'ui/courier/data_source/_decorate_query';
let esQueryStringPattern = /^[^"=]*:/;
let bnf = require('raw!./queryLang.jison');
let ngModel;
let parser = new jison.Parser(bnf, {
  type : 'slr',
  noDefaultResolve : true,
  moduleType : 'js'
});
parser.yy = require('ui/parse_query/lib/queryAdapter');

export default function GetQueryFromUser(es, Private) {
  var decorateQuery = Private(DecorateQueryProvider);

  /**
   * Take text from the user and make it into a query object
   * @param {text} user's query input
   * @returns {object}
   */
  return function (text, model) {
    function getQueryStringQuery(text) {
      return decorateQuery({query_string: {query: text}});
    }

    var matchAll = getQueryStringQuery('*');
    if (model !== undefined) {
      ngModel = model;
    }

    ngModel.parseError = undefined;
    // If we get an empty object, treat it as a *
    if (_.isObject(text)) {
      if (Object.keys(text).length) {
        return text;
      } else {
        return matchAll;
      }
    }

    // Nope, not an object.
    text = (text || '').trim();
    if (text.length === 0) return matchAll;

    if (text[0] === '{') {
      try {
        return JSON.parse(text);
      } catch (e) {
        return getQueryStringQuery(text);
      }
    } else {
      if (!esQueryStringPattern.test(text)) {
        try {
          return JSON.parse(parser.parse(text).toJson());
        } catch (e) {
          ngModel.parseError = e.message;
          return undefined;
        }
      }
      return getQueryStringQuery(text);
    }
  };
};

