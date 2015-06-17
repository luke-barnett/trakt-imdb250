define(['knockout'], function (ko) {
	ko.bindingHandlers.tickicon = {
		update: function (element, valueAccessor) {
			var value = ko.unwrap(valueAccessor());

			var innerHTML = "";

			if (value != undefined) {
				if (value) {
					innerHTML = '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>';
				}
				else {
					innerHTML = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
				}
			}

			element.innerHTML = innerHTML;
		}
	};

	ko.bindingHandlers.initialisedValue = {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			valueAccessor()(element.getAttribute('value'));
			ko.bindingHandlers.value.init(element, valueAccessor, allBindings, viewModel, bindingContext);
		},
		update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			ko.bindingHandlers.value.update(element, valueAccessor, allBindings, viewModel, bindingContext);
		}
	};

	ko.bindingHandlers.enterkey = {
		init: function (element, valueAccessor, allBindings, viewModel) {
			$(element).keypress(function (event) {
				var keyCode = (event.which ? event.which : event.keyCode);
				if (keyCode === 13) {
					valueAccessor().call(viewModel);
					return false;
				}
				return true;
			});
		}
	};
});
