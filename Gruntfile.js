'use strict';

var jsFiles = ['color', 'color.masks', 'color.parse', 'color.normalize', 'color.__Factory__', 'color.hsla'];
var jsConcat = 'color.concat.js';

jsFiles = jsFiles.map(function (file) {
  return 'dev/' + file + '.js';
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
