module.exports = function (grunt) {
	grunt.initConfig({
		pkg   : grunt.file.readJSON('package.json'),
		uglify: {
			build: {
				files: {
					'js/swif.min.js': ['js/**/*.js','!js/lib/**', '!js/**.min.js']
				}
			},
			options: {
				compress: true
			}
		},
		less: {
			options: {
				compress: true,
				yuicompress: true
			},
			build: {
				files: {
					"css/swif.css": "css/startup.less"
				}
			}

		}

	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');

};