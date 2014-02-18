module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),


		// LESS compilation options
		less: {

			dist: {
				files: {
					'dist/css/swif.css': 'css/startup.less'
				},
				options: {
					compress: true,
					yuicompress: true
				}
			}

		},

		targethtml: {
			dist: {
				files: {
					'dist/index.html': 'index.html'
				}
			}
		},

		copy: {
			dist: {
				files: {
					'dist/': [
						'startup.js',
						'app-interventions/**',
						'app-reservations/**',
						'fonts/**',
						'js/*.js',
						'js/**/*.js',
						'js/libs/**.js',
						'i18n/**',
						'templates/**',
						'config/*',
						'properties.json',
						'font/*',
						'css/vendors/*.css',
						'css/images/**'
					]
				}
			}
		},

		// Check JS Files //
		jshint: {
			options: {
				strict       : true,
				unused       : true,
				quotmark     : 'single',
				indent       : 4,
				undef        : true,
				noempty      : true,
				freeze       : true,
				curly        : true,
				latedef      : true,
				maxcomplexity: 15,
				trailing     : true,
				browser      : true,
				jquery       : true,
				devel        : true,
				globals      : { 'requirejs': false, 'module': false, 'require': false, 'define': false, '_': false, 'Backbone': false }
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			jsonFile: {
				options: {
					quotmark: 'double'
				},
				src: ['properties.json', 'package.json', 'config/*.json', 'i18n/**/*.json', 'app-interventions/config/*.json', 'app-reservations/config/*.json'],
			},
			scripts_main: {
				src: ['startup.js', 'js/**/*.js', '!js/libs/*', '!js/i18n/*']
			},
			scripts_inter: {
				//src: ['app-interventions/js/**/*.js', 'app-interventions/main.js']
				src: ['app-interventions/main.js', 'app-interventions/js/routers/*.js', 'app-interventions/js/models/*.js', 'app-interventions/js/collections/*.js']
			},
			scripts_resa: {
				//src: ['app-reservations/js/**/*.js', 'app-reservations/main.js']
				src: ['app-reservations/main.js', 'app-reservations/js/routers/*.js', 'app-reservations/js/models/*.js', 'app-reservations/js/collections/*.js']
			},

		},

		// Check Style JS File
		jscs: {
			options: {
				'disallowKeywords'                        : ['with'],
				'requireLeftStickedOperators'             : [','],
				'disallowLeftStickedOperators'            : ['?', '+', '-', '/', '*', '=', '==', '===', '!=', '!==', '>', '>=', '<', '<='],
				'disallowRightStickedOperators'           : ['?', '/', '*', ':', '=', '==', '===', '!=', '!==', '>', '>=', '<', '<='],
				'disallowSpaceAfterPrefixUnaryOperators'  : ['++', '--', '+', '-', '~'],
				'disallowSpaceBeforePostfixUnaryOperators': ['++', '--'],
				'requireRightStickedOperators'            : ['!'],
				'requireSpaceAfterBinaryOperators'        : ['+', '-', '/', '*', '=', '==', '===', '!=', '!=='],
				'requireSpaceAfterKeywords'               : ['if', 'else', 'for', 'while', 'do', 'switch', 'return', 'try', 'catch'],
				'requireSpaceBeforeBinaryOperators'       : ['+', '-', '/', '*', '=', '==', '===', '!=', '!=='],
				'requireSpacesInFunctionExpression'       : { 'beforeOpeningCurlyBrace': true },
				'requireKeywordsOnNewLine'                : ['else'],
				'disallowSpacesInFunctionExpression'      : { 'beforeOpeningRoundBrace': true },
				'validateLineBreaks'                      : 'LF',
				'force': true
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			scripts: {
				src: ['js/models/*.js']
			}
		},


		githooks: {
			all: {
				// Will run the jshint and test:unit tasks at every commit
				'pre-commit': 'check',
			}
		}


	});


	// Load the Tasks //
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});


	grunt.registerTask('default', ['less', 'targethtml', 'copy']);
	grunt.registerTask('check', ['jshint']);
};
