(function () {
  'use strict';

  var maxResults = 10;
  var pulls = {};

  angular.module('PoeCurrencyAnalyserApp').directive('ratioAnalyser', ratioAnalyser);

  function ratioAnalyser() {
    return {
      restrict: 'E',
      templateUrl: '/templates/components/currency-analyser/ratio-analyser.dir',
      controller: ['$rootScope', '$scope', '$state', '$http', '$timeout', Controller],
      controllerAs: 'ratioAnalyser',
      scope: {}
    }
  }

  function Controller($rootScope, $scope, $state, $http, $timeout) {
    var calcTimer = null;
    var calcTimeout = 1000;
    var _rad = {
      transactions: {
        buy: true,
        sell: true
      },
      league: null,
      pull: null,
      ratios: [],
      currencies: [],
      depth: 2,
      ratio: null,
      analysed: 0,
      minSellers: 10,
      benchmarkRatio: null,
      investing: null,
      exiting: null,
      investAmount: 100,
      results: [],
      allResults: [],
      bestResult: null,
      loading: 0,
      RequestCalculation: RequestCalculation,
      GetActiveCurrencyPool: GetActiveCurrencyPool,
      ShowMore: ShowMore
    };
    $scope._rad = _rad;
    $scope.leagueId = $state.params.leagueId;

    $scope.$watch('_rad.currencies', function () {
      RequestCalculation();
    }, true);

    $scope.$on('$destroy', function() {
      $rootScope.$emit('reset-league');
    });

    GetPull();

    function SaveSearch(pull, from, to, minSellers, amount) {
      console.log('saving search', arguments);
      var postData = null;
      try {
        postData = {
          visitId: $rootScope.visitId,
          pullId: pull.id,
          currencyFromId: from.id,
          currencyToId: to.id,
          minSellers: minSellers || 0,
          amount: amount || 0
        }
      } catch (e) {
        console.log(e);
        return;
      }

      $http({
        method: 'POST',
        url: '/api/visitor/' + encodeURIComponent($rootScope.visitorId) + '/search',
        data: postData
      }).then(function success(response) {

      }, function failed(response) {

      });
    }

    function GetPull() {
      if (pulls[$scope.leagueId]) {
        SetPull(pulls[$scope.leagueId]);
        return;
      }

      _rad.loading++;
      $http({
        method: 'GET',
        url: '/api/leagues/' + encodeURIComponent($scope.leagueId) + '/pull'
      }).then(function success(response) {
        pulls[$scope.leagueId] = response.data;
        SetPull(response.data);
        _rad.loading--;
      }, function failed(response) {
        _rad.loading--;
      });
    }

    function SetPull(data) {
      _rad.currencies = data.currencies;
      _rad.ratios = data.ratios;
      _rad.league = data.league;
      _rad.pull = data.pull;

      $rootScope.$broadcast('currencies-recieved', _rad.currencies);
      $rootScope.$broadcast('league-recieved', _rad.league);
      $rootScope.$broadcast('pull-recieved', _rad.pull);
      AssignCurrencies(_rad.ratios, _rad.currencies);
    }

    function RequestCalculation() {
      if (calcTimer) {
        $timeout.cancel(calcTimer);
        _rad.loading--;
      }
      _rad.loading++;
      calcTimer = $timeout(function () {
        calcTimer = null;
        Calculate();
        _rad.loading--;
      }, calcTimeout);
    }

    function Calculate() {
      if (!_rad.ratios || !_rad.currencies || !_rad.investing || !_rad.exiting) return;
      var currencies = GetActiveCurrencyPool();
      _rad.benchmarkRatio = {
        ratio: GetRatio(_rad.investing.id, _rad.exiting.id),
        count: 0
      };
      if (_rad.benchmarkRatio.ratio && _rad.benchmarkRatio.ratio.sellers >= _rad.minSellers)
        _rad.benchmarkRatio.count = Math.floor(_rad.investAmount * _rad.benchmarkRatio.ratio.ratio);
      var tree = {
        currency: _rad.investing,
        prev: null,
        ratio: null,
        finalCount: _rad.investAmount,
        remainder: 0,
        finalRatio: 1
      }
      _rad.results = [];
      _rad.allResults = [];
      _rad.analysed = 0;
      GenerateCombinations(currencies, tree, 0);
      _rad.bestResult = BestResult();
      _rad.results = _rad.allResults.slice(0, maxResults);

      SaveSearch(_rad.pull, _rad.investing, _rad.exiting, _rad.minSellers, _rad.investAmount);
    }

    function GenerateCombinations(lastCurrencies, prev, depth) {
      if (!lastCurrencies || !prev || isNaN(depth)) return;
      depth++;

      if (depth > _rad.depth)
        return;

      if (prev.finalCount <= 0)
        return;

      var currencies = lastCurrencies.slice();
      currencies.splice(currencies.indexOf(prev.currency), 1);
      for (var i = 0; i < currencies.length; i++) {
        var next = MakeTreeNode(currencies[i], prev);
        if (next)
          GenerateCombinations(currencies, next, depth);
      }
      if (prev.currency.id === _rad.exiting.id)
        return;


      var next = MakeTreeNode(_rad.exiting, prev);
      if (next) {
        GenerateCombinations(currencies, next, depth);
        AddResult(next);
      }
    }

    function MakeTreeNode(currency, prev) {
      _rad.analysed++;
      var sellRatio = _rad.transactions.sell ? GetRatio(currency.id, prev.currency.id) : null;
      var buyRatio = _rad.transactions.buy ? GetRatio(prev.currency.id, currency.id) : null;

      var ratio = null;
      if (buyRatio && sellRatio) {
        ratio = buyRatio.ratio >= (1 / sellRatio.ratio) ? buyRatio : sellRatio;
      } else {
        ratio = buyRatio || sellRatio;
      }

      if (!ratio) {
        return null;
      }
      var sell = ratio === sellRatio;
      var tree = {
        currency: currency,
        prev: prev,
        ratio: ratio,
        sell: sell,
        finalCount: Math.floor(prev.finalCount * (sell ? 1 / ratio.ratio : ratio.ratio)),
        used: 0,
        finalRatio: prev.finalRatio * (sell ? 1 / ratio.ratio : ratio.ratio),
      };
      return tree;
    }

    function BestResult() {
      if (!_rad.results.length) return null;
      var best = _rad.results[0];
      for (var i = 1; i < _rad.results.length; i++) {
        if (_rad.results[i].finalRatio > best.finalRatio) {
          best = _rad.results[i];
        }
      }
      return best;
    }

    function AddResult(tree) {
      if (!tree || tree.finalCount <= 0)
        return;
      var curr = tree;
      var result = {
        chain: [],
        finalCount: curr.finalCount,
        profit: ((curr.finalCount / _rad.investAmount) * 100).toFixed(2) + '%',
        finalRatio: curr.finalRatio
      }
      while (curr) {
        if (curr.prev) {
          result.chain.splice(0, 0, {
            currency: curr.currency,
            prev: curr.prev,
            ratio: curr.ratio,
            finalCount: curr.finalCount,
            finalRatio: curr.finalRatio,
            cleanRatio: ToRatio(curr.prev.finalCount, curr.finalCount),
            sell: curr.sell,
            url: PoeTradeUrl(_rad.league, curr.ratio.from, curr.ratio.to)
          });
          if (curr.ratio.sellers < _rad.minSellers) {
            console.log(curr);
          }
        }
        curr = curr.prev;
      }

      for (var i = 0; i < _rad.allResults.length; i++) {
        if (_rad.allResults[i].finalCount > result.finalCount) continue;
        _rad.allResults.splice(i, 0, result);
        return;
      }
      _rad.allResults.push(result);
    }

    function ShowMore() {
      console.log('all: ', _rad.allResults);
      console.log('more: ', _rad.allResults.slice(_rad.results.length, _rad.results.length + maxResults));
      _rad.results = _rad.results.concat(_rad.allResults.slice(_rad.results.length, _rad.results.length + maxResults));
    }

    function GetRatio(fromId, toId) {
      if (isNaN(fromId) || isNaN(toId)) return null;
      for (var i = 0; i < _rad.ratios.length; i++)
        if (_rad.ratios[i].from.id === fromId && _rad.ratios[i].to.id === toId && _rad.ratios[i].ratio && _rad.ratios[i].sellers >= _rad.minSellers) {
          return _rad.ratios[i];
        }
      return null;
    }

    function GetActiveCurrencyPool() {
      var result = [];
      for (var i = 0; i < _rad.currencies.length; i++)
        if (_rad.currencies[i].active)
          result.push(_rad.currencies[i]);
      return result;
    }
  }

  function PoeTradeUrl(league, from, to) {
    return 'http://currency.poe.trade/search?league=' + encodeURIComponent(league.name) + '&online=x&want=' + encodeURIComponent(to.id) + '&have=' + encodeURIComponent(from.id);
  }

  function ToRatio(a, b) {
    if (isNaN(a) || isNaN(b)) {
      return '?';
    }
    return '1:' + (b / a).toFixed(2);
  }

  function AssignCurrencies(ratios, currencies) {
    for (var i = 0; i < ratios.length; i++) {
      ratios[i].from = FindKV('id', ratios[i].currency_from_id, currencies);
      ratios[i].to = FindKV('id', ratios[i].currency_to_id, currencies);
    }
  }

  function FindKV(key, value, arr) {
    if (typeof key !== 'string' || !(arr instanceof Array)) {
      return null;
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] == value) {
        return arr[i];
      }
    }
    return null;
  }
})();