<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Cookie;
use App\Http\Requests;
use App\Http\Controllers\Controller;

//TODO: Auto-detect method
//TODO: Don't allow arbitrary actions -- maybe some need more security?
class CredlyAPI extends Controller {
	public function index($action) {
		$args = array();
		//array_push($args, 'include_authorized=0');
		$data = $this->getData($action, join('&', $args), 'GET');

		return response()->json($data);
	}

	// TODO: Create new middleware to do integrated Laravel authentication.
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

	/*public function authenticate($username, $password) {
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
				// TODO: Don't put these in source control.
				'x-api-key: ' . env('CREDLY_API_KEY'),
				'x-api-secret: ' . env('CREDLY_API_SECRET')
			]
		]);

		curl_setopt($curl, CURLOPT_USERPWD, $username . ":" . $password);
		$curl_response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		$results = '';

		if (! $err && is_string($curl_response)) {
			$jsonResults = json_decode($curl_response);

			if (json_last_error() === JSON_ERROR_NONE) {
				$results = $jsonResults->data->token;
			}
		}

		return $results;
	}*/

	/**
	 * Proxy the Credly API from the client.
	 */
	public function getData($action, $args, $method='GET') {
		$curl = curl_init();

		curl_setopt_array($curl, [
			CURLOPT_URL => "https://api.credly.com/v1.1/$action?$args",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => $method,
			CURLOPT_HTTPHEADER => [
				'x-api-key: c6b764f37bc6755a176eceb524854298',
				'x-api-secret: pUiQ2r0W3aCvoNlDeOB882j5ARW2KSqYIm7naLMEFCYVG4hkvCVIVHPVhSb5PMBTUX9x4yPefH2apwYlTfdApnDGzq0pmh5x4d37mH11a0XV6qGLSIfI/H85HYK62E4L5H60WKQfIBAiIJQdICnXT2sCHkWkX9p3ZbarDllV/9o='
			]
		]);

		// From authentication. If the cookie is missing or the token is expired, the client will handle the error and present a login page.
		array_push($args, 'access_token=' . Cookie::get('credly_token'));

		$curl_response = curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);

		$results = [];

		if (! $err && is_string($curl_response)) {
			$jsonResults = json_decode($curl_response);

			if (json_last_error() === JSON_ERROR_NONE) {
				$results = $jsonResults;
			}
		}

		return $results;
	}
}
