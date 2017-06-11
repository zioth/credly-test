/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
/*
require('./bootstrap');

window.Vue = require('vue');
*/
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

angular.module('CredlyDisplayer', [
		'ngAnimate'
	], function(interpolateProvider) {
		// Remove the conflict with Laravel -- both use double-curly-brackets for interpolation.
		//interpolateProvider.startSymbol('{%');
		//interpolateProvider.endSymbol('%}');
	})
	.value('BROADCAST_SPEED', 1000)
	.value('SCROLL_LIMIT', 1000)
	.value('SCROLL_LIMIT_REACHED_EVENT_NAME', 'InfiniteScrollLimitReached')
	.value('ELEMENT_TYPE_SCROLL', 'scrollElement')
	.value('ELEMENT_TYPE_EXPANDING', 'expandingElement')
	.value('ERROR_INVALID_CONFIG', 'Missing or invalid config.  InfiniteScroll requires config.expandingElement to be set.')
	.factory('InfiniteScroll', [
		'$rootScope',
		'$document',
		'$timeout',
		'BROADCAST_SPEED',
		'SCROLL_LIMIT',
		'SCROLL_LIMIT_REACHED_EVENT_NAME',
		'ELEMENT_TYPE_SCROLL',
		'ELEMENT_TYPE_EXPANDING',
		'ERROR_INVALID_CONFIG',
		function(
			$rootScope,
			$document,
			$timeout,
			BROADCAST_SPEED,
			SCROLL_LIMIT,
			SCROLL_LIMIT_REACHED_EVENT_NAME,
			ELEMENT_TYPE_SCROLL,
			ELEMENT_TYPE_EXPANDING,
			ERROR_INVALID_CONFIG
		) {

		/**
		 * Infinite Scroll
		 *
		 * Infinitely scroll, broadcasting events as we go.
		 * Scroll fires when browser bottom is scrollBuffer distance from container bottom.
		 *
		 * @param config JSON Config object with the following defaults:
		 * {
		 *  expandingElement:             required                               String representing CSS selector for element whose bottom we are watching, or element object.
		 *  scrollElement:                default: window                        String representing CSS selector for element being scrolled, or element object.
		 *  broadcastSpeed:               default: 1000                          Time between broadcasts in milliseconds, set to 0 for no delay
		 *  scrollLimit:                  default: 1000                           Distance remaining to be scrolled before broadcasting instance.config.eventName
		 *  eventName:  default: InfiniteScrollLimitReached    Name of event to broadcast on rootscope when scroll limit is reached using default event handler
		 *  onScrollLimitReached:         default: defaultScrollLimitReachedHandler()   broadcasts instance.config.eventName on rootscope
		 * }
		 * @constructor
		 */
		function InfiniteScroll(config) {
			var instance = this;

			// tracker for instance elements
			instance.elements = [];

			/**
			 * Bind Scroll Limit Watcher
			 *
			 * Attaches the specified raw onScroll handler to watch for scroll limit reached.
			 *
			 * @param scrollLimitWatcher function to watch for scrollLimitReached and broadcast
			 */
			instance.bindScrollLimitWatcher = function (scrollLimitWatcher) {
				var element = instance.getElement(ELEMENT_TYPE_SCROLL, true);

				if (! element) {
					element = $document;
				}

				element.on('scroll', scrollLimitWatcher);
			};

			/**
			 * Scroll Limit Watcher
			 *
			 * Callback for raw onScroll event on the scrollElement.  Broadcasts instance.config.eventName.
			 *
			 * @param event
			 */
			instance.scrollLimitWatcher = function (event) {
				var expandingElementBox = instance.getElement(ELEMENT_TYPE_EXPANDING, true).getBoundingClientRect();

				if (expandingElementBox.bottom - instance.config.scrollLimit <= 0) {
					instance.broadcast();
				}
			};

			/**
			 * Set Element
			 *
			 * Sets the instance element of the specified type. Allowed types are:
			 *
			 *       ELEMENT_TYPE_SCROLL = scrollElement
			 *       ELEMENT_TYPE_EXPANDING = expandingElement
			 *
			 * @param string|object element If string, css selector, otherwise HTML object whose dimensions are used
			 *                      in determining scrollLimitReached
			 * @return this
			 */
			instance.setElement = function (elementType, element) {
				if (typeof element == 'string') {
					// if element is a string, assume it's a selector
					element = $(element);
				}

				// angularize and attach the element onto the instance
				instance.elements[elementType] = angular.element(element);

				return instance;
			};

			/**
			 * Get Element
			 *
			 * Returns an instance element of a specified types.  Allowed types are:
			 *
			 *       ELEMENT_TYPE_SCROLL = scrollElement
			 *       ELEMENT_TYPE_EXPANDING = expandingElement
			 *
			 * @param elementType
			 * @param raw boolean, set to true to get back the raw non-angular element
			 * @returns {*}
			 */
			instance.getElement = function (elementType, raw) {
				return raw ? instance.elements[elementType][0] : instance.elements[elementType];
			};

			/**
			 * Set Config
			 *
			 * Validates and sets config properties.
			 *
			 * @param config JSON Config object with the same values as the constructor
			 * @return this
			 * @throws ERROR_INVALID_CONFIG
			 */
			instance.setConfig = function (config) {
				if (! (config && config.expandingElement)) {
					throw ERROR_INVALID_CONFIG;
				}

				// extract elements from config
				instance.setElement(ELEMENT_TYPE_EXPANDING, config.expandingElement);
				instance.setElement(ELEMENT_TYPE_SCROLL, config.scrollElement);

				// bind rest of default config params
				instance.config = {
					broadcastSpeed:              (config && config.broadcastSpeed) ? config.broadcastSpeed : BROADCAST_SPEED,
					scrollLimit:                 (config && config.scrollLimit) ? config.scrollLimit : SCROLL_LIMIT,
					eventName: (config && config.eventName) ? config.eventName : SCROLL_LIMIT_REACHED_EVENT_NAME,
					onScrollLimitReached:        (config && config.onScrollLimitReached) ? config.onScrollLimitReached : instance.defaultScrollLimitReachedHandler
				};

				return instance;
			};

			/**
			 * Set Config Param
			 *
			 * Sets a single config property.  To set elements, use setElement() instead.
			 *
			 * @param configParamName Property name.
			 * @param configParamValue Property value.
			 * @return this
			 */
			instance.setConfigParam = function (configParamName, configParamValue) {
				instance.config[configParamName] = configParamValue;

				return instance;
			};

			/**
			 * Broadcast
			 *
			 * Default scrollLimitReahed event handler
			 *
			 * @return this
			 */
			instance.broadcast = function () {
				if (instance.broadcastLocked) {
					// broadcast is throttled
					return instance;
				}

				$rootScope.$broadcast(instance.config.eventName);
				instance.broadcastLocked = true;

				$timeout(function () {
					instance.broadcastLocked = false;
				}, instance.config.broadcastSpeed);

				return instance;
			};

			// registers the elements to the instance, sets the scrolling configuration
			instance.setConfig(config);

			// bind to instance.element.on('scroll') to check for scrollLimitReached
			instance.bindScrollLimitWatcher(instance.scrollLimitWatcher);
		}

		return InfiniteScroll;
	}])
	.directive('infiniteScroll', ['InfiniteScroll', function (InfiniteScroll) {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				new InfiniteScroll({
					expandingElement: elem,
					eventName: attr.eventName,
					scrollLimit: 'scrollLimit' in attr ? parseInt(attr.scrollLimit) : null
				});
			}
		}
	}])
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
