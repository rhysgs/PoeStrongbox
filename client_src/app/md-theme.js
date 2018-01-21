(function () {

  angular.module('PoeCurrencyAnalyserApp').config(['$mdThemingProvider', function ($mdThemingProvider) {
    var customPrimary = {
      '50': '#dfa295',
      '100': '#d99181',
      '200': '#d3806e',
      '300': '#cd6f5a',
      '400': '#c75e47',
      '500': '#BB5139',
      '600': '#a74933',
      '700': '#94402d',
      '800': '#803827',
      '900': '#6d2f21',
      'A100': '#e5b4a8',
      'A200': '#ebc5bc',
      'A400': '#f1d6cf',
      'A700': '#59271b'
    };
    $mdThemingProvider
      .definePalette('customPrimary',
      customPrimary);

    var customAccent = {
      '50': '#8a6e16',
      '100': '#a08019',
      '200': '#b6921d',
      '300': '#cca320',
      '400': '#ddb229',
      '500': '#e0ba3f',
      '600': '#e7ca6b',
      '700': '#ebd281',
      '800': '#eeda97',
      '900': '#f2e2ad',
      'A100': '#e7ca6b',
      'A200': '#E4C255',
      'A400': '#e0ba3f',
      'A700': '#f5e9c3'
    };
    $mdThemingProvider
      .definePalette('customAccent',
      customAccent);

    var customWarn = {
      '50': '#e92910',
      '100': '#d1250f',
      '200': '#b9210d',
      '300': '#a21c0b',
      '400': '#8a180a',
      '500': '#721408',
      '600': '#5a1006',
      '700': '#420c05',
      '800': '#2b0703',
      '900': '#130301',
      'A100': '#f03b23',
      'A200': '#f1503b',
      'A400': '#f36553',
      'A700': '#000000'
    };
    $mdThemingProvider
      .definePalette('customWarn',
      customWarn);

    var customBackground = {
      '50': '#ffffff',
      '100': '#ffffff',
      '200': '#ffffff',
      '300': '#f6f6f4',
      '400': '#ebeae5',
      '500': '#e0ded7',
      '600': '#d5d2c9',
      '700': '#cac6ba',
      '800': '#bfbaac',
      '900': '#b3af9e',
      'A100': '#ffffff',
      'A200': '#e0ded7',
      'A400': '#aaa6a2',
      'A700': '#a8a38f'
    };
    $mdThemingProvider
      .definePalette('customBackground',
      customBackground);

    $mdThemingProvider.theme('default')
      .primaryPalette('customPrimary')
      .accentPalette('customAccent')
      .warnPalette('customWarn')
      .backgroundPalette('customBackground');

  }]);

})();