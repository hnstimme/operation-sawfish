(function (angular) {
    angular.module('app').config(function ($translateProvider) {
        $translateProvider.translations('de', {
            AUDIO_SUFFIX: 'deutsch',
            AUDIO_SUFFIX_OS: 'englisch',
            SWITCH_LANGUAGE: '[switch to english]',
            TITLE_H2: 'Die Bombardierung Heilbronns am 4. Dezember 1944',
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
            SHOW_FULL_VIDEO: 'Video in voller Länge ansehen',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN': 'Zielgebiet',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN_DESC': 'Das Zielgebiet umfasst die Altstadt, die Bahnhofsvorstadt, den Bezirk im Winkel zwischen Süd- und Oststraße, im Nordosten die Bereiche Pfühl-, Schiller- und Goethestraße sowie Böckingen mit Rangierbahnhof.',
            'TARGET_SELECTION_ZIELGEBIET-STADT': 'Zielgebiet',
            'TARGET_SELECTION_ZIELGEBIET-STADT_DESC': 'Das Zielgebiet umfasst die Altstadt, die Bahnhofsvorstadt, den Bezirk im Winkel zwischen Süd- und Oststraße, im Nordosten die Bereiche Pfühl-, Schiller- und Goethestraße sowie Böckingen mit Rangierbahnhof.',
            'TARGET_SELECTION_BRANDANFAELLIG': 'Brandanfälligstes Gebiet',
            'TARGET_SELECTION_BRANDANFAELLIG_DESC': 'Der wunde Punkt der Stadt: die dichtbevölkerte Altstadt, wo die Häuser besonders eng stehen.'
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
            SHOW_FULL_VIDEO: 'view the full-length version',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN': 'Target area',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN_DESC': 'The target area includes the old town, the district in the angle between Südstraße and Oststraße, in the northeast, the areas Pfühlstraße, Schillerstraße and Goethestraße as well as Böckingen with its switchyard.',
            'TARGET_SELECTION_ZIELGEBIET-STADT': 'Target area',
            'TARGET_SELECTION_ZIELGEBIET-STADT_DESC': 'The target area includes the old town, the district in the angle between Südstraße and Oststraße, in the northeast, the areas Pfühlstraße, Schillerstraße and Goethestraße as well as Böckingen with its switchyard.',
            'TARGET_SELECTION_BRANDANFAELLIG': 'Most burnable area',
            'TARGET_SELECTION_BRANDANFAELLIG_DESC': 'The city’s spore point. The densely populated old town where the buildings stand close to each other.'
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
