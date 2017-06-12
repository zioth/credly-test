<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Http\Controllers\CredlyAPI;

// Main UI
Route::get('/', function () {
	return view('mainapp');
});

// Handle API calls individually instead of offering a full proxy, because I'm not sure whether I want to expose the whole API, including things like
// badge creation. A future, more feature-complete UI might combine these handlers into one.
Route::get('/me/badges/created', function(CredlyAPI $api) {
	return $api->proxy('me/badges/created');
});
Route::get('/me/contacts', function(CredlyAPI $api) {
	return $api->proxy('me/contacts');
});
Route::get('/members/{id}/badges', function($id) {
	$api = new CredlyAPI();
	return $api->proxy('members/' + $id + '/badges');
});
Route::post('/authenticate', function(CredlyAPI $api) {
	return $api->authenticate();
});
