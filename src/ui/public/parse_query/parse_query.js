<<<<<<< HEAD
import toUser from 'ui/parse_query/lib/to_user';
import ParseQueryLibFromUserProvider from 'ui/parse_query/lib/from_user';
import uiModules from 'ui/modules';
uiModules
  .get('kibana')
  .directive('parseQuery', function (Private) {
    var fromUser = Private(ParseQueryLibFromUserProvider);

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        'ngModel': '='
      },
      link: function ($scope, elem, attr, ngModel) {
        var init = function () {
          $scope.ngModel = fromUser($scope.ngModel);
        };

        ngModel.$parsers.push(fromUser);
        ngModel.$formatters.push(toUser);
=======
define(function (require) {
  require('ui/modules')
    .get('kibana')
    .directive('parseQuery', function (Private) {
      var fromUser = Private(require('ui/parse_query/lib/from_user'));
      var toUser = require('ui/parse_query/lib/to_user');
      var _ = require('lodash');

      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          'ngModel': '='
        },
        link: function ($scope, elem, attr, ngModel) {
          var init = function () {
            $scope.ngModel = fromUser($scope.ngModel, ($scope ? $scope.$parent : undefined));
          };

          var fieldMap;

          if ($scope.$parent.indexPattern) {
            fieldMap = _.chain($scope.$parent.indexPattern.fields).indexBy('name').value();
          }

          toUser.setIndexPattern(fieldMap);
          fromUser.setIndexPattern(fieldMap);
          ngModel.$parsers.push(fromUser);
          ngModel.$formatters.push(toUser);
>>>>>>> ffc01fb... Nested query/aggregation support with query parser

        init();
      }
    };
  });
