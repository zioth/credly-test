<?php
namespace App\Http\Controllers;
//use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class CredlyAPI extends Controller {
	/**
	 * Proxy for the Credly API. Currently only handles GET requests. See web.php for usages of this function.
	 *
	 * @param {string} action - The action part of the API (for example, '/me/contacts')
	 * @returns {string} JSON response from Credly API.
	 *
	 * TODO: Auto-detect method based on the passed-in action and parameters.
	 */
	public function proxy($action) {
		$args = Request::all();
		// From authentication. If the cookie is missing or the token is expired, the client will handle the error and present a login page.
		// TODO: Optimize: If there's no cookie, many requests will fail.
		array_push($args, 'access_token=' . Cookie::get('credly_token'));

		$method = 'GET';

		$curl = curl_init();

		curl_setopt_array($curl, [
			CURLOPT_URL => "https://api.credly.com/v1.1/$action?" . join('&', $args),
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => $method,
			CURLOPT_HTTPHEADER => [
				'x-api-key: ' . env('CREDLY_API_KEY'),
				'x-api-secret: ' . env('CREDLY_API_SECRET')
			]
		]);

		$curl_response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);

		$results = [];

		if (!$err && is_string($curl_response)) {
			$jsonResults = json_decode($curl_response);

			if (json_last_error() === JSON_ERROR_NONE) {
				$results = $jsonResults;
			}
		}

		return $action!='me/badges/created' ? "https://api.credly.com/v1.1/$action?" . join('&', $args) . '---' . $args[0] : response()->json($results);
	}


	/**
	 * Send an authentication request, and store the resulting token in a cookie encrypted by the Illuminate framework.
	 * Takes HTTP parameters username and password.
	 *
	 * @returns {string} JSON response with one member - isLoggedIn
	 *
	 * TODO: Create new middleware to do integrated Laravel authentication.
	 */
	public function authenticate() {
		$curl = curl_init();

		curl_setopt_array($curl, [
			CURLOPT_URL => "https://api.credly.com/v1.1/authenticate",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => 'POST',
			CURLOPT_HTTPHEADER => [
				'x-api-key: ' . env('CREDLY_API_KEY'),
				'x-api-secret: ' . env('CREDLY_API_SECRET')
			]
		]);

		curl_setopt($curl, CURLOPT_USERPWD, Input::get('username', '') . ":" . Input::get('password', ''));
		$curl_response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);

		if (!$err && is_string($curl_response)) {
			$jsonResults = json_decode($curl_response);

			if (json_last_error() === JSON_ERROR_NONE) {
				if ($jsonResults->data && $jsonResults->data->token) {
					Cookie::queue(Cookie::make('credly_token', $jsonResults->data->token, 525600));
					return '{"isLoggedIn": true}';
				}
			}
		}

		return '{"isLoggedIn": false}';
	}
}
