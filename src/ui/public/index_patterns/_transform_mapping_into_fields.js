import _ from 'lodash';
import IndexPatternsMapFieldProvider from 'ui/index_patterns/_map_field';
export default function transformMappingIntoFields(Private, kbnIndex, config) {
  var mapField = Private(IndexPatternsMapFieldProvider);

    /**
     * This function will recursively define all of the properties/mappings
     * contained in the index. This will build out full name paths and
     * detect nested paths for any child attributes.
     */
    function defineMapping(fields, parentPath, name, rawField, nestedPath) {
      var fullName = name;
      // build the fullName first
      if (parentPath !== undefined) {
        fullName = parentPath + '.' + name;
      }

      if (rawField.type !== undefined) {
        var field = {};

        if (rawField.type === 'nested') {
          nestedPath = fullName;
        } else {
          if (nestedPath !== undefined) {
            rawField.nestedPath = nestedPath;
          }
          field.mapping = {};
          field.mapping[name] = rawField;
          field.fullName = fullName;

          var keys = Object.keys(field.mapping);
          if (keys.length === 0 || (fullName[0] === '_') && !_.contains(config.get('metaFields'), fullName)) return;

          var mapping = mapField(field, fullName);

          if (fields[fullName]) {
            if (fields[fullName].type !== mapping.type) {
              // conflict fields are not available for much except showing in the discover table
              mapping.type = 'conflict';
              mapping.indexed = false;
            }
          }
          fields[fullName] = _.pick(mapping, 'type', 'indexed', 'analyzed', 'doc_values', 'nestedPath');
        }
      }

      _.each(rawField.properties, function (field, name) {
        defineMapping(fields, fullName, name, field, nestedPath);
      });

      _.each(rawField.fields, function (field, name) {
        defineMapping(fields, fullName, name, field, nestedPath);
      });

    }

<<<<<<< HEAD
  /**
   * Convert the ES response into the simple map for fields to
   * mappings which we will cache
   *
   * @param  {object} response - complex, excessively nested
   *                           object returned from ES
   * @return {object} - simple object that works for all of kibana
   *                    use-cases
   */
  return function (response) {
    var fields = {};
    _.each(response, function (index, indexName) {
      if (indexName === kbnIndex) return;
      _.each(index.mappings, function (mappings) {
        _.each(mappings, function (field, name) {
          var keys = Object.keys(field.mapping);
          if (keys.length === 0 || (name[0] === '_') && !_.contains(config.get('metaFields'), name)) return;

          var mapping = mapField(field, name);

          if (fields[name]) {
            if (fields[name].type !== mapping.type) {
              // conflict fields are not available for much except showing in the discover table
              mapping.type = 'conflict';
              mapping.indexed = false;
            }
          }
          fields[name] = _.pick(mapping, 'type', 'indexed', 'analyzed', 'doc_values');
=======
    /**
     * Convert the ES response into the simple map for fields to
     * mappings which we will cache
     *
     * @param  {object} response - complex, excessively nested
     *                           object returned from ES
     * @return {object} - simple object that works for all of kibana
     *                    use-cases
     */
    return function (response) {
      var fields = {};
      _.each(response, function (index, indexName) {
        if (indexName === kbnIndex) return;
        _.each(index.mappings, function (mappings) {
          _.each(mappings.properties, function (field, name) {
            // call the define mapping recursive function
            defineMapping(fields, undefined, name, field, undefined);
          });
>>>>>>> ffc01fb... Nested query/aggregation support with query parser
        });
      });
    });

    config.get('metaFields').forEach(function (meta) {
      if (fields[meta]) return;

      var field = { mapping: {} };
      field.mapping[meta] = {};
      fields[meta] = mapField(field, meta);
    });

    return _.map(fields, function (mapping, name) {
      mapping.name = name;
      return mapping;
    });
  };
};
