import toUser from 'ui/parse_query/lib/to_user';
import ParseQueryLibFromUserProvider from 'ui/parse_query/lib/from_user';
import ParseQueryLibToUserProvider from 'ui/parse_query/lib/to_user';
import uiModules from 'ui/modules';
import _ from 'lodash';
uiModules
  .get('kibana')
  .directive('parseQuery', function (Private) {
    var fromUser = Private(ParseQueryLibFromUserProvider);
    var toUser = Private(ParseQueryLibToUserProvider);

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
          fieldMap = $scope.$parent.indexPattern.fields;
        }

        fromUser.parser.yy.fieldDictionary = fieldMap;
        ngModel.$parsers.push(fromUser);
        ngModel.$formatters.push(toUser);

        init();
      }
    };
  });
