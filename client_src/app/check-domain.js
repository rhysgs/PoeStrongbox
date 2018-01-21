(function() {

  console.log('hey');
  // asddsaasd
  angular.module('PoeCurrencyAnalyserApp').run(['$mdToast', '$location', function($mdToast, $location) {

    console.log('location', $location);
    if (!isNaN(parseInt($location.host()))) {
      $mdToast.show({
        templateUrl: '/templates/components/dialogs/no-domain.toast',
        position: 'top right',
        hideDelay: 10000
      });
    }
  }]);
})();