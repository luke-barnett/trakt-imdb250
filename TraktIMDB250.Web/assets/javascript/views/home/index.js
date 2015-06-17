define(['knockout', 'knockout-mapping', 'underscore', 'api', 'viewModels/movieViewModel'], function (ko, koMap, _, API, MovieViewModel) {
	var _vm = {};

	_vm.traktUsername = ko.observable();
	_vm.top250movies = ko.observableArray();

	_vm.orderedMovies = ko.computed(function () {
		var movies = ko.unwrap(_vm.top250movies);

		return _.sortBy(movies, function (movie) {
			return ko.unwrap(movie.Rank);
		});
	});

	_vm.unwatchedMovies = ko.computed(function () {
		var movies = ko.unwrap(_vm.top250movies);

		return _.filter(movies, function (movie) {
			return ko.unwrap(!movie.watched);
		})
	});

	_vm.getWatched = function () {
		API.TraktMovies(ko.unwrap(_vm.traktUsername)).success(function (traktMovies) {
			_.each(ko.unwrap(_vm.top250movies), function (movie) {
				var match = _.find(traktMovies, function (traktMovie) {
					return ko.unwrap(movie.IMDBId) == traktMovie.movie.ids.imdb;
				});

				movie.watched(!!match);
			});
		}).error(function () {
			_vm.reset();
		});
	};

	_vm.reset = function () {
		_.each(ko.unwrap(_vm.top250movies), function (movie) {
			movie.watched(null);
		});
	}

	API.IMDB250().success(function (movies) {
		var _mapping = {
			create: function (options) {
				return new MovieViewModel(options.data);
			}
		}

		koMap.fromJS(movies, _mapping, _vm.top250movies);
	});

	ko.applyBindings(_vm);
});
