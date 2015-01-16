'use strict';

var jsFiles = ['color.js', 'color.masks.js', 'color.hsla.js'];
var jsConcat = 'color.concat.js';

jsFiles = jsFiles.map(function (file) {
  return 'dev/' + file;
});

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    concat: {
      dist: {
        src: jsFiles,
        dest: jsConcat
      }
    },
    uglify: {
      core: {
        options: {
          mangle: true
        },
        files: {
          'color.min.js': [jsConcat]
        }
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  //Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};
