<?php /* The main UI. In this file, curly braces refer to Angular interpolation, not Blade. */ ?>
<div class="main-wrapper container" ng-controller="BadgesController as badgesController">
	<div
		class="row badges-main-wrapper"
		infinite-scroll
		event-name="loadMoreBadges"
		ng-class="{'loading': badgesController.isLoading}"
		>
		<a
			class="badge-image"
			href="https://credly.com/recipients/{{ badge.id }}"
			target="_blank"
			ng-repeat="badge in badgesController.badges">
			<div class="clearfix" ng-if="$index % 3 == 0"></div>
			<div class="col-xs-4">
				<div>{{ badge.title }}</div>
				<img ng-src="{{ badge.image_url | imageFilter: 13 }}" />
			</div>
		</a>
		<div class="loader loader--style2" title="1" ng-show="badgesController.isLoading">
		  <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
			 width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
		  <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
			<animateTransform attributeType="xml"
			  attributeName="transform"
			  type="rotate"
			  from="0 25 25"
			  to="360 25 25"
			  dur="0.6s"
			  repeatCount="indefinite"/>
			</path>
		  </svg>
		</div>
	</div>
	<div><div>TEST MEEEEE</div>--- {{ moo }} ---</div>
</div>
