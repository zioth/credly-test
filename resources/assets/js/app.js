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
			};
		})

		// Send an API request to the Credly proxy.
		.factory('ApiRequest',  ['$http', function($http) {
			return {
				/**
				 * Send an API request to the Credly proxy.
				 *
				 * @param {String} action - The API action. For example, /contacts
				 * @param {String} method - 'GET' or 'POST'
				 * @param {Object=|null} - URL parameters as name:value pairs
				 */
				get: function _apiRequest(action, method, data) {
					var params = {
						method: method,
						url: action,
						params: data || {},
						cache: method != 'POST'
					};
					if (method == 'POST') {
						params.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
					}
					return $http(params);
				}
			};
		})


		// Main controller
		.controller('UIController', ['$scope', 'ApiRequest', function($scope, API) {
			var vm = this;
			var page = 1;

			// This was copied from Alex's demo. I have not implemented it for this project, so it's here as a placeholder.
			$scope.$on('loadMoreBadges', function() {
				vm.getBadges();
			});

			/**
			 * Get the badges created by the logged-in user
			 */
			vm.getBadges = function() {
				if ($scope.noMore) return;

				vm.isLoading = true;

				API.get('/badges', 'GET', {
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

			// Get the logged-in user's contacts
			vm.getContacts = function() {
				// TODO: loading state
				API.get('/contacts', 'GET', {
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

			vm.showBadges = function(memberid) {
				console.error(memberid);
			};

			// Authenticate
			$scope.login = function() {
				API.get('/authenticate', 'POST', {username:vm.username, password:vm.password}).then(function(res) {
					if (res.data && res.data.isLoggedIn) {
						_init();
					}
					else {
						vm.isLoggedIn = false;
						vm.loginFailed = true;
					}
				}, function(err) {
					vm.isLoggedIn = false;
					vm.loginFailed = true;
				});
			};


			/**
			 * Initialize data, and fetch JSON to render UI.
			 */
			function _init() {
				vm.isLoggedIn = true; // innocent until proven guilty.
				vm.loginFailed = false; // The last login attempt failed.
				vm.username = '';
				vm.password = '';
				vm.isLoading = false;
				vm.badges = [];
				vm.contacts = [];
				vm.getBadges();
				vm.getContacts();
			}

			_init();
		}]
	);
})();
