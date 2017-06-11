<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class CredlyAPI extends Controller {
	public function index($action) {
		//http_build_query($_GET)
		//return $this->getData($response, 'badges', $args, 'GET');

		//Getting params:
		//Request::input('argument1')


//Request::all()
		$args = array();
		//TODO Get from client, put in cookie
		//$token = $this->authenticate('junk1@zioth.com', 'greycoat');
		//array_push($args, 'access_token=' . $token);
		//array_push($args, 'include_authorized=0');
		$data = $this->getData($action, join('&', $args), 'GET');

		//$msg = "This is a simple message.";
		return response()->json($data);
			//->json(array('msg'=> $msg), 200);
	}


	//TODO: Auto-detect method
	//TODO: Don't allow arbitrary actions -- maybe some need more security?
	public function authenticate($username, $password) {
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
	}

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
				// TODO: Don't put these in source control.
				'x-api-key: c6b764f37bc6755a176eceb524854298',
				'x-api-secret: pUiQ2r0W3aCvoNlDeOB882j5ARW2KSqYIm7naLMEFCYVG4hkvCVIVHPVhSb5PMBTUX9x4yPefH2apwYlTfdApnDGzq0pmh5x4d37mH11a0XV6qGLSIfI/H85HYK62E4L5H60WKQfIBAiIJQdICnXT2sCHkWkX9p3ZbarDllV/9o='
			]
		]);

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
