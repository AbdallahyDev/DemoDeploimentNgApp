module.exports = function (grunt) {
    grunt.initConfig({
        systemjs: {
            dist: {
                options: {
                    sfx: true,
                    baseURL: "./",
                    configFile: "./build.config.js",
                    minify: true,
                    sourceMaps: false
                },
                files: [{
                    "src": "./dist/main.js",
                    "dest": "./build/main.js"
                }]
            },
            dev: {
                options: {
                    sfx: true,
                    baseURL: "./",
                    configFile: "./build.config.js",
                    minify: false,
                    sourceMaps: true,
                    build: {
                        mangle: false
                    }
                }, 
                files: [{
                    "src": "./dist/main.js",
                    "dest": "./build/dev.js"
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-systemjs-builder');

    grunt.registerTask('build', ['systemjs']);
};
