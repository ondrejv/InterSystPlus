module.exports = function(grunt) {
    var lessMainFile = [
    'media/css/src/bootstrap.less'
    ];

    var lessEditFile = [
    'media/css/src/edit.less' // loaded just on Page and Desing tab
    ];

    var lessFiles = [
    'media/css/src/*.less',
    'media/css/src/**/*.less'
    ];

    var lesscssTasks = [
    'buildCSSDev',
    'buildCSSMin',
    'csslint'
    ];

    var jsFiles = [
        'media/js/src/*.js'
    ];
    
    var jsTasks = [
    'concat',
    'uglify'
    ]

    grunt.initConfig({
        watch: {
            lesscss: {
                files: lessFiles,
                options: {
                    livereload: true
                },
                tasks: lesscssTasks
            },
            js: {
                files: jsFiles,
                tasks: jsTasks
            }
        },
        less: {
            lessMin: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    'media/css/isp.min.css': lessMainFile
                }
            },
            lessDev: {
                files: {
                    'media/css/isp.dev.css': lessMainFile,
                    'media/css/edit.min.css': lessEditFile
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 version', 'ie 9', '> 1%']
            },
            dev: {
                src: 'media/css/isp.dev.css',
                dest: 'media/css/isp.dev.pref.css'
            },
            min: {
                src: 'media/css/isp.min.css',
                dest: 'media/css/isp.min.pref.css'
            }
        },
        csslint: {
            src: ['media/css/isp.dev.pref.css'],
            options: {
                csslintrc: '.csslintrc'
            }
        },
        devUpdate: {
            main: {
                options: {
                    updateType: 'report', //just report outdated packages
                    reportUpdated: false, //don't report up-to-date packages
                    semver: true, //stay within semver when updating
                    packages: {
                        devDependencies: true, //only check for devDependencies
                        dependencies: false
                    },
                    packageJson: null, //use matchdep default findup to locate package.json
                    reportOnlyPkgs: [] //use updateType action on all packages
                }
            }
        },
        concat: {
            options: {
                separator: ';\n',
            },
            dist: {
                src: [
                'media/js/src/respond-min.js',
                'media/js/src/modernizr-custom-min.js',
                'media/js/src/jquery-cubeportfolio.js',
                'media/js/src/kenticoplugins-controls-tabs.js',
                'media/js/src/responsive-tables.js',
                'media/js/src/isp.js'
                ],
                dest: 'media/js/isp-con.js',
            },
        },
        uglify: {
            my_target: {
              files: {
                'media/js/isp-con.min.js': 'media/js/isp-con.js'
              }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-dev-update');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.task.registerTask('default', ['watch']);

    grunt.task.registerTask('Grunt', [
        'devUpdate',
        'buildCSSDev',
        'buildCSSMin',
        'csslint',
        'watch'
        ]);
    grunt.task.registerTask('buildCSSDev', ['less:lessDev', 'autoprefixer:dev']);
    grunt.task.registerTask('buildCSSMin', ['less:lessMin', 'autoprefixer:min']);
}