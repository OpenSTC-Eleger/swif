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
				globals      : { 'module': false, 'require': false, 'define': false, '_': false, 'Backbone': false }
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			jsonFile: {
				options: {
					quotmark: 'double'
				},
				src: ['config/*.json', 'i18n/**/*.json']
			},
			scripts_main: {
				src: ['js/**/*.js', '!js/libs/*', '!js/i18n/*']
			},
			scripts_inter: {
				//src: ['app-interventions/js/**/*.js', 'app-interventions/main.js']
			},
			scripts_resa: {
				//src: ['app-reservations/js/**/*.js', 'app-reservations/main.js']
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
		}


	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs-checker');

	grunt.registerTask('default', ['less', 'targethtml', 'copy']);
	grunt.registerTask('check', ['jshint']);
	grunt.registerTask('full-check', ['jshint', 'jscs']);
};
