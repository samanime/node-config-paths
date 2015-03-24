module.exports = {
    dest: 'dist',
    build: 'build',

    app: {
        source: "app",
        dest: "%dest%/%app.source%",

        styles: {
            source: "%app.source%/styles/main.less",
            dest: "%app.dest%/styles",
            watch: "%app.source%/styles/**/*.less"
        },

        scripts: {
            source: "%app.source%/scripts/**/*.js",
            dest: "%app.dest%/scripts",
            destFile: "app.js",
            watch: "%app.scripts.source%"
        },

        assets: {
            source: "%app.source%/assets/**/*",
            dest: "%app.dest%/assets",
            watch: "%app.assets.source%"
        },

        views: {
            source: "%app.source%/views/**/*.hbs",
            dest: "%build%/app/views.js",
            watch: "%app.views.source%"
        }
    },

    web: {

    },

    common: {

    }
};