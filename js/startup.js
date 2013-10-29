/******************************************
* Require JS Configuration
*/
require.config({

	paths: {
		jquery           : 'libs/jQuery-2.0.3-min',
		underscore       : 'libs/underscore-1.5.2-min',
		backbone         : 'libs/backbone-1.1.0',
		
		moment           : 'libs/moment-2.3.1',
		underscoreString : 'libs/underscore-string-2.3.2',
		localStorage     : 'libs/backbone-localStorage-1.1.7',
		nprogress        : 'libs/NProgress-0.1.2',
		bootstrap        : 'libs/bootstrap-3.0.0',

		app              : 'app',
		main             : 'main'
		
	},

	shim: {
		'underscore': {
			deps : ['underscoreString'],
			exports: '_',
		},
		'backbone': {
			deps   : ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		'nprogress': {
			deps   : ['jquery'],
			exports: 'NProgress'
		}
	}

});





require([
	'main'
], function(main){


	// Start The App //
	main.init('fr');

});