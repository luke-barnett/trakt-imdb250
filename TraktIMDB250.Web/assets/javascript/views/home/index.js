define(['knockout', 'knockout-mapping', 'underscore', 'api', 'viewModels/movieViewModel', 'bindings'], function (ko, koMap, _, API, MovieViewModel) {
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
			var watched = ko.unwrap(movie.watched);
			return watched != null && !watched;
		})
	});

	_vm.watchedPercentage = ko.computed(function () {
		var unwatchedCount = ko.unwrap(_vm.unwatchedMovies).length;
		var moviesCount = ko.unwrap(_vm.top250movies).length;

		return unwatchedCount / moviesCount;
	});

	_vm.watchedPercentage.formatted = ko.computed(function () {
		return (ko.unwrap(_vm.watchedPercentage) * 100).toFixed(2) + "%";
	});

	_vm.getWatched = function () {
		var traktUsername = ko.unwrap(_vm.traktUsername);

		if (!!traktUsername) {
			window.location.href = "/" + traktUsername;
		}
		else {
			window.location.href = "/";
		}
	};

	_vm.reset = function () {
		_vm.top250movies.valueWillMutate();

		_.each(ko.unwrap(_vm.top250movies), function (movie) {
			movie.watched(null);
		});

		_vm.top250movies.valueHasMutated();
	}

	API.IMDB250().success(function (movies) {
		var _mapping = {
			create: function (options) {
				return new MovieViewModel(options.data);
			}
		}

		koMap.fromJS(movies, _mapping, _vm.top250movies);

		var traktUsername = ko.unwrap(_vm.traktUsername);

		if (!!traktUsername) {
			API.TraktMovies(ko.unwrap(_vm.traktUsername)).success(function (traktMovies) {
				_vm.top250movies.valueWillMutate();

				_.each(ko.unwrap(_vm.top250movies), function (movie) {
					var match = _.find(traktMovies, function (traktMovie) {
						return ko.unwrap(movie.IMDBId) == traktMovie.movie.ids.imdb;
					});

					movie.watched(!!match);
				});

				_vm.top250movies.valueHasMutated();
			}).error(function () {
				_vm.reset();
			});
		}
	});

	ko.applyBindings(_vm);
});
