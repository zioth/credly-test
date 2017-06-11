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
	.factory('Badges', ['$http', function($http) {
		return {
			get: function(params) {
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
	.factory('Contacts', ['$http', function($http) {
		return {
			get: function(params) {
				if (typeof params === 'undefined') params = {};

				return $http({
					method: 'GET',
					url: '/contacts',
					params: params,
					cache: true
				});
			}
		}
	}])
	.controller('BadgesController', ['$scope', 'Badges', 'Contacts', function($scope, Badges, Contacts) {
		var vm = this;
		var page = 1;

		$scope.$on('loadMoreBadges', function() {
			vm.getBadges();
		});

		vm.getBadges = function() {
			if ($scope.noMore) return;

			vm.isLoading = true;

			Badges.get({
				order_direction: 'DESC',
				page: 1,
				per_page: 20
			}).then(
				function(res) {
					vm.isLoading = false;
					vm.isLoggedIn = !res.data || !res.data.meta || res.data.meta.status_code != 401;
					if (res.data.data) {
						vm.badges = vm.badges.concat(res.data.data);
					}
					if (res.data && res.data.paging) {
						$scope.noMore = vm.badges.length >= res.data.paging.total_results;
					}
				},
				function(err) {
					vm.isLoading = false;
				}
			);
		};

		vm.getContacts = function() {
			// TODO: loading state
			Contacts.get({
				order_direction: 'DESC',
				page: 1,
				per_page: 20
			}).then(
				function(res) {
					vm.isLoading = false;
					vm.isLoggedIn = !res.data || !res.data.meta || res.data.meta.status_code != 401;
					if (res.data.data) {
						vm.contacts = vm.contacts.concat(res.data.data);
					}
					if (res.data && res.data.paging) {
						$scope.noMore = vm.contacts.length >= res.data.paging.total_results;
					}
				},
				function(err) {
					vm.isLoading = false;
				}
			);
		};

		vm.isLoggedIn = true; // innocent until proven guilty
		vm.username = '';
		vm.password = '';
		$scope.login = function() {
			console.error('moo');
		};

		vm.isLoading = false;
		vm.badges = [];
		vm.contacts = [];
		vm.getBadges();
		vm.getContacts();
		//TODO DEBUG:
		window._DEBUGTEST = vm;
	}]);
})();
