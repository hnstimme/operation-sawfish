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
            EXPLORE_AIRPLANES: 'Flugzeuge erkunden',
            MANUFACTURER: 'Hersteller',
            CREW: 'Besatzung',
            TOP_SPEED: 'Höchstgeschwindigkeit',
            CRUISING_SPEED: 'Reisegeschwindigkeit',
            RANGE: 'Reichweite',
            LOADING_WEIGHT: 'Ladegewicht',
            TWO_PERSONS: 'Zwei Personen',
            SEVEN_PERSONS: 'Sieben Personen',
            AT: 'bei',
            BOMB_LOADING: 'Bombenladung',
            VIDEO_DESCRIPTION: 'Diese stummen Filmaufnahmen stammen von der britischen Royal Air Force. Sie zeigen den Luftangriff vom 4. Dezember 1944 auf Heilbronn aus der Perspektive eines Bombers. Das Video dauert 3 Minuten und 26 Sekunden. Es wurde als Beobachtungsvideo aufgenommen. Dazu saßen in einem der Bomber hinter dem Piloten zwei Aufklärer mit Videokameras. Mit den Aufnahmen wollten die Engländer analysieren, wie erfolgreich ihr Luftangriff war. Das Video ist auch im Heilbronner Haus der Stadtgeschichte zu sehen.',
            SHOW_FULL_VIDEO: 'Video in voller Länge ansehen',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN': 'Zielgebiet',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN_DESC': 'Das Zielgebiet umfasst die Altstadt, die Bahnhofsvorstadt, den Bezirk im Winkel zwischen Süd- und Oststraße, im Nordosten die Bereiche Pfühl-, Schiller- und Goethestraße sowie Böckingen mit Rangierbahnhof.',
            'TARGET_SELECTION_ZIELGEBIET-STADT': 'Zielgebiet',
            'TARGET_SELECTION_ZIELGEBIET-STADT_DESC': 'Das Zielgebiet umfasst die Altstadt, die Bahnhofsvorstadt, den Bezirk im Winkel zwischen Süd- und Oststraße, im Nordosten die Bereiche Pfühl-, Schiller- und Goethestraße sowie Böckingen mit Rangierbahnhof.',
            'TARGET_SELECTION_BRANDANFAELLIG': 'Brandanfälligstes Gebiet',
            'TARGET_SELECTION_BRANDANFAELLIG_DESC': 'Der wunde Punkt der Stadt: die dichtbevölkerte Altstadt, wo die Häuser besonders eng stehen.',
            MOSQUITO_DESC_1: 'Die zweimotorige Mosquito war ein aus Holz gebautes Flugzeug,',
            MOSQUITO_DESC_2: 'das eine Geschwindigkeit von über 600 km/h erreichen',
            MOSQUITO_DESC_3: 'konnte und zunächst hauptsächlich als Aufklärer-Flugzeug',
            MOSQUITO_DESC_4: 'im Einsatz war. Die Schnellbombervariante konnte knapp',
            MOSQUITO_DESC_5: '1000 Kilogramm Bomben transportieren.',
            LANCASTER_DESC_1: 'Die viermotorige Avro Lancaster war der bekannteste',
            LANCASTER_DESC_2: 'Langstreckenbomber der Royal Air Force im Zweiten Weltkrieg.',
            LANCASTER_LOADING_WEIGHT: 'Bis zu 9.000 kg Bomben.'
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
            ORIGIN: 'Source',
            EXPLORE_MAP: 'explore map',
            EXPLORE_AIRPLANES: 'explore airplanes',
            MANUFACTURER: 'Manufacturer',
            CREW: 'Crew',
            TOP_SPEED: 'Top speed',
            CRUISING_SPEED: 'Cruising speed',
            RANGE: 'Range',
            LOADING_WEIGHT: 'Loading weight',
            TWO_PERSONS: 'two persons',
            SEVEN_PERSONS: 'seven persons',
            AT: 'at',
            BOMB_LOADING: 'bomb load',
            VIDEO_DESCRIPTION: 'The air attack on Heilbronn was filmed by an observer of the Royal Air Force. Source: Municipal Archive Heilbronn',
            SHOW_FULL_VIDEO: 'view the full-length version',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN': 'Target area',
            'TARGET_SELECTION_ZIELGEBIET-BOECKINGEN_DESC': 'The target area includes the old town, the district in the angle between Südstraße and Oststraße, in the northeast, the areas Pfühlstraße, Schillerstraße and Goethestraße as well as Böckingen with its switchyard.',
            'TARGET_SELECTION_ZIELGEBIET-STADT': 'Target area',
            'TARGET_SELECTION_ZIELGEBIET-STADT_DESC': 'The target area includes the old town, the district in the angle between Südstraße and Oststraße, in the northeast, the areas Pfühlstraße, Schillerstraße and Goethestraße as well as Böckingen with its switchyard.',
            'TARGET_SELECTION_BRANDANFAELLIG': 'Most burnable area',
            'TARGET_SELECTION_BRANDANFAELLIG_DESC': 'The city’s spore point. The densely populated old town where the buildings stand close to each other.',
            MOSQUITO_DESC_1: 'The two-engined Mosquito was a wooden aircraft',
            MOSQUITO_DESC_2: 'that could reach a speed of more than 600 km/h.',
            MOSQUITO_DESC_3: 'First it was mainly used as a reconnaissance aircraft.',
            MOSQUITO_DESC_4: 'The high-speed bomber type could carry',
            MOSQUITO_DESC_5: 'nearly 1000 kilograms bombs.',
            LANCASTER_DESC_1: 'The four-engined Avro Lancaster was the most common long-range',
            LANCASTER_DESC_2: 'bomber by the Royal Air Force during Second World War.',
            LANCASTER_LOADING_WEIGHT: 'up to 9.000 kg'
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
