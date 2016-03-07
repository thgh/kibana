import moment from 'moment';
import buildRangeFilter from 'ui/filter_manager/lib/range';
export default function createDateHistogramFilterProvider(Private) {

<<<<<<< HEAD
  return function (agg, key) {
    var start = moment(key);
    var interval = agg.buckets.getInterval();
=======
    return function (agg, key) {
      var start = moment(key);
      var interval = agg.buckets.getInterval();

      var filter = buildRangeFilter(agg.params.field, {
        gte: start.valueOf(),
        lte: start.add(interval).subtract(1, 'ms').valueOf()
      }, agg.vis.indexPattern);
      if (agg.params.nested) {
        filter = { 'nested' : { 'query' : { 'bool' : { 'must' : [{filter}]}}, 'path' : agg.params.nested.path}};
      }
      return filter;
    };
>>>>>>> ffc01fb... Nested query/aggregation support with query parser

    return buildRangeFilter(agg.params.field, {
      gte: start.valueOf(),
      lte: start.add(interval).subtract(1, 'ms').valueOf()
    }, agg.vis.indexPattern);
  };

};
