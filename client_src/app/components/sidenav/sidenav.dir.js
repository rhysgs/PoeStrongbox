(function () {
  'use strict';

  angular.module('PoeCurrencyAnalyserApp').directive('sidenav', sidenav);

  function sidenav() {
    return {
      restrict: 'E',
      templateUrl: '/templates/components/sidenav/sidenav.dir',
      controller: ['$rootScope', '$scope', '$http', Controller],
      controllerAs: 'sidenav',
      scope: {}
    }
  }

  function Controller($rootScope, $scope, $http) {
    $scope.loading = 0;
    $scope.currencies = [];
    $scope.searchSummary = [];
    $scope.league = null;

    GetSearchSummary();

    $rootScope.$on('league-recieved', function(evt, league) {
      $scope.league = league;
    });

    $rootScope.$on('currencies-recieved', function(evt, currencies) {
      $scope.currencies = currencies || [];
    });

    $rootScope.$on('reset-league', function(evt) {
      $scope.currencies = [];
      $scope.league = null;
    });

    function GetSearchSummary() {
      $scope.loading++;
      $http({
        method: 'GET',
        url: '/api/currencies/search/summary'
      }).then(function success(response) {
        $scope.searchSummary = response.data;
        $scope.loading--;
      }, function failed(response) {
        $scope.loading--;
      });
    }
  }
})();