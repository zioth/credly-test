/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
//require('./bootstrap');

//window.Vue = require('vue');
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
/*
Vue.component('example', require('./components/Example.vue'));

const app = new Vue({
	el: '#app'
});
*/

(function() {
'use strict';

angular.module('CredlyDisplayer', ['ngAnimate'])
	.filter('imageFilter', function() {
		return function(input, size) {
			var ret = input.replace(/(_\d+)\./, '.');
			var endIndex = ret.lastIndexOf('.');
			return ret.substring(0, endIndex) + '_' + size + ret.substring(endIndex);
		}
	})
	.factory('Badge', ['$http', function($http) {
		return {
			getBadges: function(params) {
				if (typeof params === 'undefined') params = {};

				return $http({
					method: 'GET',
					url: '/badges',
					params: params,
					cache: true
				});
			}
		}
	}])
	.controller('BadgesController', ['$scope', 'Badge', function($scope, Badge) {
		var vm = this;
		var page = 1;
vm.moo = 'MOOOOOOOOO!';

		$scope.$on('loadMoreBadges', function() {
			vm.getBadges();
		});

		vm.getBadges = function() {
			if ($scope.noMore) return;

			vm.isLoading = true;

			Badge.getBadges({
				order_direction: 'DESC',
				page: page++,
				per_page: 12
			}).then(
				function(res) {
					vm.isLoading = false;
					if (res.data.data) {
						vm.badges = vm.badges.concat(res.data.data);
					}
					$scope.noMore = vm.badges.length >= res.data.paging.total_results;
				},
				function(err) {
					vm.isLoading = false;
					console.error('Oops');
				}
			);
		};

		vm.isLoading = false;
		vm.badges = [];
		vm.getBadges();
	}]);
})();
