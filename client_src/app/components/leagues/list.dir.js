(function () {
  'use strict';

  var maxResults = 10;
  var leagues = null;

  angular.module('PoeCurrencyAnalyserApp').directive('leagueList', leagueList);

  function leagueList() {
    return {
      restrict: 'E',
      templateUrl: '/templates/components/leagues/list.dir',
      controller: ['$rootScope', '$scope', '$http', '$timeout', Controller],
      controllerAs: 'leagueList',
      scope: {}
    }
  }

  function Controller($rootScope, $scope, $http, $timeout) {
    $scope.loading = 0;
    $scope.leagues = null;
    GetLeagues();

    function GetLeagues() {
      if (leagues != null) {
        $scope.leagues = leagues;
        return;
      }

      $scope.loading++;
      $http({
        method: 'GET',
        url: '/api/leagues'
      }).then(function success(response) {
        leagues = response.data;
        $scope.leagues = leagues;
        $scope.loading--;
      }, function failed(response) {
        $scope.loading--;
      });
    }
  }

})();