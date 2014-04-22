module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),


		// License banner //
		banner: '/*! \n' +
			' * <%= pkg.name %>\n' +
			' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
			' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
			' */\n',

		archiveName: '<%= pkg.name %>_v<%= pkg.version %>.tar.gz',


		// Clean dist directory //
		clean: {
			dist: ['dist/', '*.tar.gz'],
		},


		// Compile Less file //
		less: {
			options: {
				strictMath: true
			},
			dist: {
				files: {
					'dist/style/swif.css': 'style/startup.less'
				}
			}
		},


		// Clean and organize css file //
		csscomb: {
			options: {
				config: 'grunt/.csscomb.json'
			},
			dist: {
				files: {
					'dist/style/swif.css': ['dist/style/swif.css']
				}
			}
		},


		// Target HTML  //
		targethtml: {
			dist: {
				files: {
					'dist/index.html': 'index.html'
				}
			}
		},


		// Copy files and folders //
		copy: {
			dist: {
				files: [
					{ src: ['app-*/**', 'fonts/**', 'js/**/*', 'i18n/**/*', 'templates/**/*', 'medias/**/*'], dest: 'dist/'},
					{ src: ['LICENSE', 'AUTHORS', 'properties.json'], dest: 'dist/'},
					{ src: ['config/*', '!config/configuration.json'], dest: 'dist/'},
					{ expand: true, cwd: 'style/vendors/', src: ['**/*.css', '**/*.png', '**/*.gif'], dest: 'dist/style/vendors/'}
				]
			}
		},


		// Check JS Files //
		jshint: {
			options: {
				jshintrc: 'grunt/.jshintrc'
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			jsonFile: {
				src: ['properties.json', 'package.json', 'config/*.json.*', 'i18n/**/*.json', 'grunt/.*.json', 'app-interventions/config/*.json', 'app-reservations/config/*.json'],
			},
			scripts_main: {
				src: ['js/**/*.js', '!js/libs/*', '!js/i18n/*']
			},
			scripts_inter: {
				src: ['app-interventions/js/**/*.js', 'app-interventions/main.js']
			},
			scripts_resa: {
				src: ['app-reservations/main.js', 'app-reservations/js/routers/*.js', 'app-reservations/js/models/*.js', 'app-reservations/js/collections/*.js']
			},
		},


		// Check CSS Files //
		csslint: {
			dist: {
				options: {
					csslintrc: 'grunt/.csslintrc'
				},
				src: ['dist/style/*.css']
			}
		},


		// Check Style JS Files //
		jscs: {
			options: {
				config: 'grunt/.jscsrc'
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			scripts: {
				src: ['js/views/modals/ModalPlaceView.js']
			}
		},



		// Compress the CSS file //
		cssmin: {
			dist: {
				options: {
					banner: '<%= banner %>',
					keepSpecialComments: 0,
					processImport: false
				},
				files: {
					'dist/style/swif.css': ['dist/style/swif.css']
				}
			}
		},


		// Minify JS files //
		uglify: {
			options: {
				report          : 'min',
				preserveComments: 'some',
				beautify: true
			},
			dist: {
				files: [{
					expand: true,
					cwd   : 'dist/',
					src   : ['**/*.js', '!**/libs/*'],
					dest  : 'dist/'
				}]
			}
		},


		// Add licence to the files //
		usebanner: {
			default: {
				options: {
					position: 'top',
					banner  : '<%= banner %>'
				},
				files: {
					src: ['js/**/*.js', '!js/libs/*', '!js/i18n/*', 'app-interventions/**/*.js', 'app-reservations/**/*.js', 'style/**/*.less', '!style/vendors/**/*.less']
				}
			}
		}
	});



	/** Check if the version in package.json and properties.json are equal
	*   && if the package version are equal to the last git Tag
	*/
	grunt.registerTask('checkVersion', 'Check if the version in package.json and properties.json are equal', function() {

		// Require semver //
		var semver = require('semver');


		// Get the Semver version in the package file //
		var packageVersion = grunt.file.readJSON('package.json').version;

		// Get the Semver version in the properties file //
		var propertiesVersion = grunt.file.readJSON('properties.json').version;

		// Check if the properties.json version is correct //
		if (!semver.valid(propertiesVersion)){
			grunt.fail.warn('Version in properties.json file is not correct');
			grunt.log.error(propertiesVersion);
		}

		// Check if the package.json version is correct //
		if (!semver.valid(packageVersion)){
			grunt.fail.warn('Version in package.json file is not correct');
			grunt.log.error(packageVersion);
		}



		// Check if the package.json version and properties.json version are equal //
		if (packageVersion !== propertiesVersion){
			grunt.fail.warn('Versions in properties.json and package.json are not equal');
			grunt.log.error(packageVersion + ' != ' + propertiesVersion);
		}


		grunt.log.writeln('Check version done without error.'.green);
		grunt.log.ok('App version ' + propertiesVersion);

	});



	// Load the Tasks //
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	grunt.registerTask('default', ['checkVersion', 'build-css', 'targethtml', 'copy', 'uglify']);
	grunt.registerTask('build-css', ['clean', 'less', 'csscomb', 'cssmin']);

	// Check tasks //
	grunt.registerTask('check', ['jshint', 'checkVersion']);
	grunt.registerTask('check-css', ['clean', 'less', 'csscomb', 'csslint']);

};
