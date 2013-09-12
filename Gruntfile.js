module.exports = function (grunt) {
	grunt.initConfig({
		pkg   : grunt.file.readJSON('package.json'),
		uglify: {
			dist: {
				files: {
					//'js/swif.min.js': ['js/**/*.js','!js/libs/**', '!js/**.min.js'],
					'dist/js/collections.min.js': ['js/collections/**/*.js'],
					'dist/js/helpers.min.js': ['js/helpers/**/*.js'],
					'dist/js/models.min.js': ['js/models/**/*.js'],
					'dist/js/routers.min.js': ['js/routers/**/*.js'],
					'dist/js/views.min.js': ['js/views/**/*.js'],
					'dist/js/app.min.js': ['js/app.js'],
					'dist/js/generics.min.js': [
						'js/models/GenericModel.js',
						'js/collections/GenericCollection.js',
						'js/views/lists/GenericListView.js',
						'js/views/modals/GenericModalView.js'
					]
				}
			},
			options: {
				compress: true,
				mangle: false
			}
		},
		// LESS compilation options
		less: {

			dist: {
				files: {
					"css/swif.css": "css/startup.less"
				},
				options: {
					compress: true,
					yuicompress: true
				}
			}

		},
		targethtml: {
			dist: {
				files : {
					'dist/index.html': 'index.html'
				}
			}
		}

	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-contrib-copy');

};