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
use App\Http\Controllers;

Route::get('/', function () {
	return view('mainapp');
});

Route::get('/me/badges/created', function(CredlyAPI $api) {
	return $api->proxy('me/badges/created');
});
Route::get('/me/contacts', function(CredlyAPI $api) {
	return $api->proxy('me/contacts');
});
Route::get('//members/{id}/badges', function($id, CredlyAPI $api) {
	return $api->proxy('me/contacts');
});
Route::post('/authenticate', function(CredlyAPI $api) {
	return $api->authenticate();
});
