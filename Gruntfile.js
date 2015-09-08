'use strict';


module.exports = function(grunt) { 
  require('load-grunt-tasks')(grunt); 
  require('time-grunt')(grunt); 
  grunt.initConfig({ 
    connect: {
      options: {
        port: 9000, 
        hostname: 'localhost',
        livereload: 35729
      },
      all: {
        options: {
          open: true,
          base: [
            'src/'
          ]
        }
      }
    }, 
    watch: { 
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        }, 
        files: [
          'src/*.html',
          'src/*.css',
          'src/*.js',
          'src/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  });

  // Creates the 'serve' task
  grunt.registerTask('serve', [
    'connect:all',
    'watch'
  ]);
};