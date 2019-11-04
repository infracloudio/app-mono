'use strict';
/* jshint camelcase:false*/

var app = angular.module('micro-www', []);

app.controller('mainCtrl',
  function ($scope, $log, env_factory, factory) {
    $scope.apiConnectionStatus = {
      'state': 'Success',
      'msg'  : 'Connection to API MicroService SUCCEEDED'
    };
    $scope.log = $log;
    $scope.env = {};
    $scope.apiMessage = '';
    $scope.apiVersion = '';
    $scope.apiBuildnum = '';
    $scope.apiAccessTime = null;
    $scope.fullAPIResponse = false;

    env_factory.get()
      .success(function (data) {
        if (data.NODE_ENV)
          $scope.env.environment = data.NODE_ENV;

        if (data.API_URL)
          $scope.env.api_url = data.API_URL;
        else
          $scope.env.api_url = 'http://localhost:3001';

        if ($scope.env.environment === 'dev')
          $log.info($scope.env);
        factory.info($scope.env.api_url)
          .success(function (data) {
            $scope.apiVersion = data.version;
            $scope.apiBuildnum = data.buildnumber;

            if (data.message)
              $scope.apiMessage = data.message;

            if (!isNaN(Date.parse(data.time)))
              $scope.apiAccessTime = new Date(data.time).toLocaleTimeString();
          })
          .error(function () {
            $scope.apiConnectionStatus = {
              'state': 'error',
              'msg': 'Connection to API MicroService, FAILED'
            };
          }
        );
      })
      .error(function (reason) {
        $log.error(reason);
      }
    );
  }
);

app.factory('factory',
  function ($http) {
    return {
      info: function (url) {
        console.log(url);
        return $http.get(url + '/info');
      }
    };
  }
);

app.factory('env_factory',
  function ($http) {
    return {
      get: function () {
        return $http.get('/env');
      }
    };
  }
);
