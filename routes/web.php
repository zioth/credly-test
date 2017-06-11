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

Route::get('/', function () {
	return view('mainapp');
});

Route::get('/badges', function(App\Http\Controllers\CredlyAPI $api) {
	return $api->index('me/badges/created');
});
Route::get('/contacts', function(App\Http\Controllers\CredlyAPI $api) {
	return $api->index('me/contacts');
});

Route::get('/authenticate', function(App\Http\Controllers\CredlyAPI $api) {
	return $api->authenticate();
});
