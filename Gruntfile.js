/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 28/06/13 22:04
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        connect: {
            server: {
                options: {
                    // For mobile testing. Change to your private IP.
                    hostname: "localhost",
                    port: 8080,
                    base: "."
                }
            }
        },
        watch: {}
    });

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");

    //Dev
    grunt.registerTask("default", ["connect","watch"]);
};