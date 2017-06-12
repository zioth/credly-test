<!doctype html>
<html lang="{{ app()->getLocale() }}" ng-app="CredlyDisplayer">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>Eli's Credly App</title>

		<link rel="stylesheet" type="text/css" href="/css/app.css">
	</head>
	<body ng-controller="UIController as uiController">
		{{-- verbatim to allow Angular interpolation --}}
		@verbatim
			<div class="app_title">Eli's Credly App</div>
			<div class="login_form" ng-class="{'loggedIn': uiController.isLoggedIn}">
				<div ng-show="uiController.loginFailed" class="error">Your username or password was invalid. Please try again.</div>
				<form name="form" ng-submit="login()" role="form">
					<div class="form-group">
						<label for="username">Username</label>
						<input type="text" name="username" id="username" class="form-control" ng-model="uiController.username" required />
					</div>
					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" name="password" id="password" class="form-control" ng-model="uiController.password" required />
					</div>
					<div class="form-actions">
						<button type="submit" class="btn btn-primary">Login</button>
						<!-- TODO
							<img ng-if="vm.dataLoading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
						-->
					</div>
				</form>
			</div>
			<div class="main_wrapper" ng-class="{'loggedIn': uiController.isLoggedIn}">
				<div class="columns">
					<div
						class="badges_column ui_column"
						ng-class="{'loading': uiController.loadingCount>0}"
						>
						<div class="app_subtitle">My Created Badges</div>
						<a
							class="badge_box"
							href="https://credly.com/recipients/{{ badge.id }}"
							target="_blank"
							ng-repeat="badge in uiController.badges">
								<img ng-src="{{ badge.image_url | imageFilter: 13 }}" ng-attr-title="{{ badge.title }}"/>
						</a>
					</div>
					<div
						class="contacts_column ui_column"
						event-name="loadMoreContacts"
						ng-class="{'loading': uiController.loadingCount>0}">
						<div class="app_subtitle">My Contacts</div>
						<div
							class="member_box"
							ng-class="{'is_member': contact.is_member}"
							ng-repeat="contact in uiController.contacts"
						>
							<div ng-switch on="contact.is_member" >
								<div ng-switch-when="true">
									<img class="avatar" ng-src="{{ contact.member.avatar }}"/>
									<div class="display_name member_overlay">{{ contact.member.display_name }}</div>
								</div>
								<div ng-switch-default>
									<div class="avatar non_member"></div>
									<div class="display_name member_overlay">{{ contact.first_name }} {{ contact.last_name }}</div>
								</div>
							</div>

							<div ng-switch on="!!uiController.memberBadges[contact.contact_member_id]" class="member_badges member_overlay">
								<div ng-switch-when="true" class="badges">
									<img
										class="cbadge"
										ng-src="{{ badge.src }}"
										ng-attr-title="{{ badge.title }} : {{ badge.short_description }}"
										ng-repeat="badge in uiController.memberBadges[contact.contact_member_id]"
									/>
								</div>
								<div ng-switch-default class="show_badges" ng-click="uiController.showBadges(contact.contact_member_id)">
									Show Badges
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Based on the spinner from Alex's interview demo -->
			<div class="loader" title="" ng-show="uiController.loadingCount>0">
			  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				 width="100px" height="100px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
			  <path fill="#CCC" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
				<animateTransform attributeType="xml"
				  attributeName="transform"
				  type="rotate"
				  from="0 25 25"
				  to="360 25 25"
				  dur="0.8s"
				  repeatCount="indefinite"/>
				</path>
			  </svg>
			</div>



		<div class="row" ng-controller="MainCtrl">
			<div class="col-xs-6">
				<ul>
					<li ui-draggable="true" drag="man"
						drag-channel="customImage2"
						drop-validate="dropValidateHandler($drop, $event, $data)"
						drag-hover-class="on-drag-hover-custom"
						drag-image-element-id="getCustomDragElementId($index)"
						on-drop-success="dropSuccessHandler($event,$index,men)"
						ui-on-drop="onDrop($event,$data,men,$index)"
						drop-channel="customImage1"
						ng-repeat="man in men track by $index">
						{{man}}
					</li>
				</ul>
			</div>
			<div class="col-xs-6">
				<ul>
					<li ui-draggable="true" drag="woman"
						drag-channel="customImage1"
						drop-validate="dropValidateHandler($drop, $event, $data)"
						drag-hover-class="on-drag-hover-custom"
						drag-image-element-id="getCustomDragElementId($index)"
						ui-on-drop="onDrop($event,$data,women,$index)"
						drop-channel="customImage2"
						on-drop-success="dropSuccessHandler($event,$index,women)"
						ng-repeat="woman in women track by $index">
						{{woman}}
					</li>
				</ul>
			</div>
		</div>


		@endverbatim

		{{-- TODO: Integrate angular into Laraview project instead of taking this shortcut --}}
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-animate.min.js"></script>
		<script type="text/javascript" src="/js/app.js"></script>
		<script type="text/javascript" src="/js/angular-dragdrop.js"></script>
	</body>
</html>
