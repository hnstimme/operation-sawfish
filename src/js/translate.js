(function (angular) {
    angular.module('app').config(function ($translateProvider) {
        $translateProvider.translations('de', {
            AUDIO_SUFFIX: 'deutsch',
            AUDIO_SUFFIX_OS: 'englisch',
            SWITCH_LANGUAGE: '[switch to english]',
            TITLE_H2: 'The destruction of Heilbronn on December 4th, 1944',
            CHAPTER: 'Kapitel',
            CHAPTER_1: 'Heilbronn brennt',
            CHAPTER_2: 'Der Plan',
            CHAPTER_3: 'Der Anflug',
            CHAPTER_4: 'Der Angriff',
            CHAPTER_5: 'Zerstörte Stadt',
            CHAPTER_6: 'Der Luftkrieg',
            ORIGIN: 'Quelle',
            EXPLORE_MAP: 'Karte erkunden',
            VIDEO_DESCRIPTION: 'Diese stummen Filmaufnahmen stammen von der britischen Royal Air Force. Sie zeigen den Luftangriff vom 4. Dezember 1944 auf Heilbronn aus der Perspektive eines Bombers. Das Video dauert 3 Minuten und 26 Sekunden. Es wurde als Beobachtungsvideo aufgenommen. Dazu saßen in einem der Bomber hinter dem Piloten zwei Aufklärer mit Videokameras. Mit den Aufnahmen wollten die Engländer analysieren, wie erfolgreich ihr Luftangriff war. Das Video ist auch im Heilbronner Haus der Stadtgeschichte zu sehen.',
            SHOW_FULL_VIDEO: 'Video in voller Länge ansehen'
        });
        $translateProvider.translations('en', {
            AUDIO_SUFFIX: 'englisch',
            AUDIO_SUFFIX_OS: 'deutsch',
            SWITCH_LANGUAGE: '[deutsche Version]',
            TITLE_H2: 'The destruction of Heilbronn on December 4th, 1944',
            CHAPTER: 'Chapter',
            CHAPTER_1: 'Heilbronn on Fire',
            CHAPTER_2: 'The Plan',
            CHAPTER_3: 'The Approach',
            CHAPTER_4: 'The Attack',
            CHAPTER_5: 'Heilbronn Destroyed',
            CHAPTER_6: 'The Air War',
            ORIGIN: 'source',
            EXPLORE_MAP: 'explore map',
            VIDEO_DESCRIPTION: 'The air attack on Heilbronn was filmed by an observer of the Royal Air Force. Source: Municipal Archive Heilbronn',
            SHOW_FULL_VIDEO: 'view the full-length version'
        });
        $translateProvider.preferredLanguage('de');
    });

    angular.module('app').directive("switchVideoOnLanguageChange", function ($rootScope, $translate, $timeout) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attrs, API) {
                $rootScope.$on('$translateChangeSuccess', function () {
                    var newVideogularSources = [];
                    var fromSuffix = $translate.instant('AUDIO_SUFFIX_OS');
                    var toSuffix = $translate.instant('AUDIO_SUFFIX');
                    scope.videogularConfig.sources.forEach(function (source) {
                        newVideogularSources.push({
                            src: source.src.replace(new RegExp(fromSuffix, "g"), toSuffix),
                            type: source.type
                        })
                    });
                    var autoRestart = API.currentTime.getSeconds() > 0;
                    API.stop();
                    API.clearMedia();
                    scope.videogularConfig.sources = newVideogularSources;
                    if (autoRestart) {
                        $timeout(function () {
                            API.play();
                        });
                    }
                });
            }
        }
    });
})(angular);
