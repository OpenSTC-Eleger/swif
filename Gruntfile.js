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
				//src: ['app-reservations/js/**/*.js', 'app-reservations/main.js']
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


		// Archive the dist //
		compress : {
			dist : {
				options : {
					mode   : 'tgz',
					level  : 9,
					archive: '<%= archiveName %>',
					pretty : true
				},
				files : [
					{ expand: true, src : '**/*', cwd : 'dist/' }
				]
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
		},


		// Create AUTHORS file //
		contributors: {
			master: {
				branch: 'master',
				chronologically: true
			}
		},


		// Hooks to run check task before each commit //
		githooks: {
			all: {
				'pre-commit': 'check',
			}
		},


		// Display notifications messages //
		notify: {
			check: {
				options: {
					title  : 'Check done without error',
					message: 'Changes can be commited and pushed!'
				}
			},
			build: {
				options: {
					title  : 'Build done without error',
					message: 'v<%= pkg.version %> ready for production!'
				}
			}
		},
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 0
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

		// Get the last Git Tag version //
		var shell = require('shelljs');
		var cmdOutput = shell.exec('git describe --tags `git rev-list --tags --max-count=1`', {'silent': true});

		if (cmdOutput.code !== 0){
			grunt.fail.fatal('Git software are require');
		}

		var lastTagVersion = cmdOutput.output.replace(/(\r\n|\n|\r)/gm, '');


		// Check if the last Git Tag is correct //
		if (!semver.valid(lastTagVersion)){
			grunt.fail.warn('Last Git tag Version is not correct');
			grunt.log.error(lastTagVersion);
		}

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


		if (semver.gt(lastTagVersion, packageVersion)){
			grunt.fail.warn('App version are lower than the last Git tag');
			grunt.log.error(packageVersion + ' != ' + lastTagVersion);
		}
		else if (semver.lt(lastTagVersion, packageVersion)){
			grunt.fail.warn('App version are greater than the last Git tag');
			grunt.log.error(packageVersion + ' != ' + lastTagVersion);
		}


		grunt.log.writeln('Check version done without error.'.green);
		grunt.log.ok('App version ' + propertiesVersion);

	});



	// Load the Tasks //
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
	grunt.task.run('notify_hooks');


	// Build taks //
	grunt.registerTask('default', ['jshint', 'checkVersion', 'build-css', 'targethtml', 'copy', 'uglify', 'compress', 'notify:build']);
	grunt.registerTask('build-docker', ['build-css', 'targethtml', 'copy', 'uglify']);
	grunt.registerTask('build-css', ['clean', 'less', 'csscomb', 'cssmin']);


	// Check tasks //
	grunt.registerTask('check', ['jshint', 'checkVersion', 'notify:check']);
	grunt.registerTask('check-css', ['clean', 'less', 'csscomb', 'csslint']);

};