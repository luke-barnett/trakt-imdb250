define(['jquery'], function ($) {
	var BASE_PATH = '/api/';

	var paths = {
		IMDB250: BASE_PATH + 'imdb/top250',
		TRAKT: BASE_PATH + 'trakt/'
	};

	var _api = {};

	_api.IMDB250 = function () {
		return $.ajax(paths.IMDB250,
			{
				type: 'GET',
				contentType: 'application/json',
				dataType: 'json'
			});
	}

	_api.TraktMovies = function (username) {
		return $.ajax(paths.TRAKT + username,
			{
				type: 'GET',
				contentType: 'application/json',
				dataType: 'json'
			});
	};

	return _api;
});
