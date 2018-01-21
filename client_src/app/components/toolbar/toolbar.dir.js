(function () {
  'use strict';

  angular.module('PoeCurrencyAnalyserApp').directive('toolbar', toolbar);

  function toolbar() {
    return {
      restrict: 'E',
      templateUrl: '/templates/components/toolbar/toolbar.dir',
      controller: ['$rootScope', '$scope', '$http', Controller],
      controllerAs: 'sidenav',
      scope: {}
    }
  }

  function Controller($rootScope, $scope, $http) {
    $scope.league = null;
    $scope.pull = null;
    $rootScope.$on('league-recieved', function(evt, league) {
      $scope.league = league;
    });

    $rootScope.$on('pull-recieved', function(evt, pull) {
      $scope.pull = pull;
    });

    $rootScope.$on('reset-league', function(evt) {
      $scope.league = null;
      $scope.pull = null;
    });
  }
})();