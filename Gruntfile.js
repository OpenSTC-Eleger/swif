module.exports = function (grunt) {
	grunt.initConfig({
		pkg       : grunt.file.readJSON('package.json'),
		// LESS compilation options
		less      : {

			dist: {
				files  : {
					"dist/css/swif.css": "css/startup.less"
				},
				options: {
					compress   : true,
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
		copy      : {
			dist: {
				files: {
					'dist/': [
                                          'startup.js',
                                          'app-interventions/**',
                                          'app-reservations/**',
                                          'fonts/**',
                                          'js/*.js',
                                          'js/**/*.js',
                                          'js/libs/**.js','i18n/**', 'templates/**','config/*', 'properties.json', 'font/*','css/vendors/*.css', 'css/images/**']
				}
			}
		}


	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-targethtml');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['less','targethtml','copy']);
};
