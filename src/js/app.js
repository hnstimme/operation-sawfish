(function (angular) {
    angular.module('app', [
        'angular-loading-bar',
        'ngRoute',
        'ngSanitize',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.poster',
        'angulartics',
        'angulartics.google.analytics',
        'djds4rce.angular-socialshare'
    ]);

    angular.module('app').run(function ($FB) {
        $FB.init('1588324454735392');
    });
})(angular);


