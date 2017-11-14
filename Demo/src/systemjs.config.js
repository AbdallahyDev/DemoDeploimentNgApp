/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': '/node_modules/',
            "jquery": "jquery/dist/jquery.js"
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            'app': 'build',

            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js', 
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js', 

            // other libraries
            'rxjs': 'npm:rxjs',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
            'ng2-smart-table': 'npm:ng2-smart-table/bundles/table.umd.js',
            'ng2-completer': 'npm:ng2-completer/ng2-completer.umd.js',
            'lodash': 'npm:lodash',
            'less': 'npm:less',
            'moment': 'npm:moment/moment.js',
            'ng2-bootstrap': 'npm:ng2-bootstrap/bundles/ng2-bootstrap.umd.js',
            'angular2-fontawesome': 'npm/angular2-fontawesome/bundles/angular2-fontawesome.umd.min.js',
            //'ng2-bs3-modal': 'npm/ng2-bs3-modal/bundles/ng2-bs3-modal.min.js'
            'ng2-bs3-modal': 'node_modules/ng2-bs3-modal',
            'angular2-recaptcha': 'npm:/angular2-recaptcha'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js',
                meta: {
                    './*.js': {
                        loader: 'src/systemjs-angular-loader.js'
                    }
                }
            },
            rxjs: {
                defaultExtension: 'js'
            },
            lodash: {
                main: 'lodash.js',
                defaultExtension: 'js'
            },
            less: {
                main: 'dist/less.js',
                defaultExtension: 'js'
            },
            'moment': {
                main: 'moment.js',
                defaultExtension: 'js'
            },
            'angular2-fontawesome': {
                defaultExtension: 'js'
            },
            'ng2-bs3-modal': {
                defaultExtension: 'js'
            },
            'angular2-recaptcha': {
                defaultExtension: 'js', main: 'index'
            }
        }
    });
})(this);
