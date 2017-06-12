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
		.filter('imageFilter', _imageFilter)

		// Send an API request to the Credly proxy.
		.factory('ApiRequest',  ['$http', _apiRequestFactory])

		// Main controller
		.controller('UIController', ['$scope', 'ApiRequest', _uiController]
	);


	/**
	 * Initialize data, and fetch JSON to render UI.
	 */
	function _init(vm) {
		vm.isLoggedIn = true; // innocent until proven guilty.
		vm.loginFailed = false; // The last login attempt failed.
		vm.username = '';
		vm.password = '';
		vm.loadingCount = 0;
		vm.badges = [];
		vm.contacts = [];
		vm.memberBadges = {};
		vm.getBadges();
		vm.getContacts();
	}


	/**
	 * Main controller
	 *
	 * @param {Object} $scope - Angular scope
	 * @param {ApiRequest} API - Api request factory
	 */
	function _uiController($scope, API) {
		var vm = this;

		// This was copied from Alex's interview demo, but I did not have time to reimplement the infinite scroll code.
		$scope.$on('loadMoreBadges', function() {
			vm.getBadges();
		});

		vm.getBadges = _getBadges.bind(vm, $scope, API);
		vm.getContacts = _getContacts.bind(vm, API);
		vm.showBadges = _showBadges.bind(vm, API);
		$scope.login = _login.bind(vm, API);

		_init(vm);
	}


	/**
	 * Factory to generate Credly API request code.
	 *
	 * @param {Object} $http - Angular HTTP object
	 */
	function _apiRequestFactory($http) {
		return {
			/**
			 * Send an API request to the Credly proxy.
			 *
			 * @param {String} action - The API action. For example, /contacts
			 * @param {String} method - 'GET' or 'POST'
			 * @param {Object=|null} - URL parameters as name:value pairs
			 */
			get: function(action, method, data) {
				var params = {
					method: method,
					url: action,
					params: data || {}
				};
				if (method == 'POST') {
					params.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
				}
				return $http(params);
			}
		}
	}


	/**
	 * Get the badges created by the logged-in user
	 *
	 * @param {Object) $scope - Angular scope
	 * @param {ApiRequest) API - The Credly API request object.
	 *
	 * Scope: uiController
	 */
	function _getBadges($scope, API) {
		var vm = this;
		if (!vm.isLoggedIn) {
			return;
		}

		vm.loadingCount++;

		API.get('/me/badges/created', 'GET', {
			order_direction: 'ASC',
			page: 1,
			per_page: 20
		}).then(
			function(res) {
				vm.loadingCount--;
				vm.isLoggedIn = !res.data || !res.data.meta || res.data.meta.status_code != 401;
				if (res.data.data) {
					vm.badges = vm.badges.concat(res.data.data);
				}
			},
			function(err) {
				vm.loadingCount--;
			}
		);
	}


	/**
	 * Get the logged-in user's contacts
	 *
	 * @param {ApiRequest) API - The Credly API request object.
	 *
	 * Scope: uiController
	 */
	function _getContacts(API) {
		var vm = this;
		if (!vm.isLoggedIn) {
			return;
		}
		vm.loadingCount++;

		API.get('/me/contacts', 'GET', {
			order_direction: 'ASC',
			page: 1,
			per_page: 20
		}).then(
			function(res) {
				vm.loadingCount--;
				vm.isLoggedIn = !res.data || !res.data.meta || res.data.meta.status_code != 401;
				if (res.data.data) {
					vm.contacts = vm.contacts.concat(res.data.data);
				}
			},
			function(err) {
				vm.loadingCount--;
			}
		);
	}


	/**
	 * Get a sample set of badges for a member. No need to get all of them.
	 *
	 * @param {ApiRequest) API - The Credly API request object.
	 *
	 * Scope: uiController
	 */
	function _showBadges(API, memberid) {
		var vm = this;
		//TODO: Add a loading state

		API.get('/members/' + memberid + '/badges', 'GET', {
			order_direction: 'ASC',
			page: 1,
			per_page: 10
		}).then(
			function(res) {
				vm.isLoggedIn = !res.data || !res.data.meta || res.data.meta.status_code != 401;
				if (vm.isLoggedIn) {
					var obj = vm.memberBadges[memberid] = [];
					if (res.data.data && res.data.data.length) {
						for (var x=0; x<res.data.data.length; x++) {
							var badge = res.data.data[x].badge;
							obj.push({
								src: badge.image_url,
								title: badge.title,
								short_description: badge.short_description
							});
						}
					}
				}
			},
			function(err) {
			}
		);
	}


	/**
	 * Authenticate the user
	 *
	 * @param {ApiRequest) API - The Credly API request object.
	 *
	 * Scope: uiController
	 */
	function _login(API) {
		var vm = this;
		//TODO BUG: Why do username&password get appended to the URL? Angular docs say that $http() doesn't work like that.
		API.get('/authenticate', 'POST', {username:vm.username, password:vm.password}).then(function(res) {
			if (res.data && res.data.isLoggedIn) {
				// Reset the app, including the logged in state.
				_init(vm);
			}
			else {
				vm.isLoggedIn = false;
				vm.loginFailed = true;
			}
		}, function(err) {
			vm.isLoggedIn = false;
			vm.loginFailed = true;
		});
	}


	/**
	 * Image filter (taken from Alex's interview demo)
	 */
	function _imageFilter() {
		return function(input, size) {
			var ret = input.replace(/(_\d+)\./, '.');
			var endIndex = ret.lastIndexOf('.');
			return ret.substring(0, endIndex) + '_' + size + ret.substring(endIndex);
		};
	}
})();
