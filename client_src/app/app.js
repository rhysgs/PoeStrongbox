(function () {

  var _pcaa = angular.module('PoeCurrencyAnalyserApp', [
    'ngMaterial',
    'ui.router',
    'ngStorage'
  ]);

  _pcaa.config(['$locationProvider', '$stateProvider', function ($locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('index', {
        url: '/',
        template: '<league-list></league-list>',
        controller: 'IndexController'
      })
      .state('league', {
        url: '/league/{leagueId}',
        templateUrl: '/templates/components/index/index.ctrl',
        controller: 'IndexController'
      });
  }]);

  _pcaa.run(['$rootScope', '$localStorage', '$http', function ($rootScope, $localStorage, $http) {
    $rootScope.visitorId = null;
    $rootScope.visitId = null;

    GetVisitorId();

    function GetVisitorId() {
      $rootScope.visitorId = $localStorage.visitorId;
      if ($rootScope.visitorId) {
        Visit();
        return;
      }
      $http({
        method: 'GET',
        url: '/api/visitor'
      }).then(function success(response) {
        $rootScope.visitorId = response.data.id;
        $localStorage.visitorId = $rootScope.visitorId;
        Visit();
      }, function failed(response) {

      });
    }

    function Visit() {
      $http({
        method: 'PATCH',
        url: '/api/visitor/' + encodeURIComponent($rootScope.visitorId) + '/visit'
      }).then(function success(response) {
        $rootScope.visitId = response.data.id;
      }, function failed(response) {

      });
    }

  }]);
})();