/******************************************
* Require JS Configuration
*/
require.config({

	paths: {
		jquery             : 'libs/jQuery-2.0.3-min',
		underscore         : 'libs/underscore-1.5.2-min',
		backbone           : 'libs/backbone-1.1.0',
		
		moment             : 'libs/moment-2.3.1',
		'underscore.string': 'libs/underscore-string-2.3.2',
		localStorage       : 'libs/backbone-localStorage-1.1.7',
		nprogress          : 'libs/NProgress-0.1.2',
		bootstrap          : 'libs/bootstrap-3.0.0',
		less               : 'libs/less-1.5.0-min',
		
		app                : 'app',
		main               : 'main'
		
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps   : ['jquery', 'underscore', 'underscore.string'],
			exports: 'Backbone',
			init : function(JQuery, _, UnderscoreString){
				_.mixin(UnderscoreString);
			}
		},
		'nprogress': {
			deps   : ['jquery'],
			exports: 'NProgress'
		}
	},

	packages: [
	{
		name: 'css',
		location: 'require-css',
		main: 'css'
	},
	{
		name: 'less',
		location: 'require-less',
		main: 'less'
  }
]

});





require([
	'main', 'less'
], function(main){


	// Start The App //
	main.init('fr');

});