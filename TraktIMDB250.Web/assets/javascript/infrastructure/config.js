requirejs.config({
	baseUrl: '/assets/javascript',
	paths: {
		'jquery': 'vendor/jquery/dist/jquery',
		'bootstrap': 'vendor/bootstrap-sass/assets/javascripts/bootstrap',
		'knockout': 'vendor/knockout/dist/knockout',
		'knockout-mapping': 'vendor/knockout-mapping/knockout.mapping',
		'underscore': 'vendor/underscore/underscore',
		'moment': 'vendor/moment/moment',
		'api': 'infrastructure/api',
		'bindings': 'infrastructure/bindings'
	},
	shim: {
		'bootstrap': ['jquery'],
		'knockout': ['jquery']
	},
	urlArgs: "build=" + version
});
