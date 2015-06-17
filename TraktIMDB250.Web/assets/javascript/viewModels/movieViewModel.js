define(['knockout', 'knockout-mapping', 'moment'], function (ko, koMap, moment) {
	return function (data) {
		var _vm = {};

		if (data) {
			koMap.fromJS(data, null, _vm);
		}

		_vm.watched = ko.observable(null);

		_vm.url = ko.computed(function () {
			return 'http://www.imdb.com/title/' + ko.unwrap(_vm.IMDBId);
		});

		return _vm;
	}
});
