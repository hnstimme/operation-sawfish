(function (angular) {
    angular.module('app').config(function ($translateProvider) {
        $translateProvider.translations('de', {
            LOCALE: 'DE',
            LOCALE_OS: 'EN',
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
            LANCASTER_LOADING_WEIGHT: 'Bis zu 9.000 kg Bomben.',
            BOMBS: 'Bomben',
            EXPLORE_BOMBS: 'Bomben erkunden',
            BOMBS_EXPLOSIVE_12000: '12000-lb-Sprengbomben',
            BOMBS_EXPLOSIVE_12000_DESC: 'Diese großen Sprengbomben waren mit über 5000 Kilogramm Sprengstoff befüllt. Fünf bis zehn dieser Bomben warfen die Briten über Heilbronn ab. Sie explodierten schon mehrere Meter über dem Boden. So sollten sie die Dächer von den Häusern reißen, damit später kleinere Bomben in die Häuser fallen.',
            BOMBS_EXPLOSIVES: 'Andere Sprengbomben',
            BOMBS_EXPLOSIVES_DESC: 'Über 1000 solcher Bomben fielen am 4. Dezember auf Heilbronn. Je nach Größe waren sie mit zwischen 500 und 1800 Kilo Sprengstoff befüllt. Manche der Bomben hatten eingebauten Zeitzünder, um erst später zu explodieren. Diese Bomben finden Arbeiter zum Teil heute noch auf Baustellen, weil die Zeitzünder nicht immer funktionierten.',
            BOMBS_FIRE: 'Stabbrandbomben',
            BOMBS_FIRE_DESC: 'Der große Teil der Bomben, die über Heilbronn fielen, waren solche Stabbrandbomben. Rund 200.000 dieser etwa 60 Zentimeter langen Stäbe warfen die Briten ab. Die Bomben waren mit Thermiten gefüllt, die schnell große Hitze entstehen lassen. So sollte ganz Heilbronn brennen. Reste dieser Bomben finden sich heute noch häufig auf Baustellen, zum Beispiel auf dem BuGa-Areal.',
            BOMBS_LIGHT: 'Leuchtbomben',
            BOMBS_LIGHT_DESC: 'Diese sogenannten Christbäume warfen die Flugzeuge an Fallschirmen ab. Die Bomben sanken nur langsam zur Erde. Sie hatten einen etwa neun Kilogramm schweren Leuchtsatz geladen, der rund vier Minuten lang brannte. Mit etwa 1000 dieser Bomben beleuchteten die Kampfflugzeuge den Himmel, um in der Nacht eine bessere Sicht auf Heilbronn zu haben.',
            BOMBS_MARKER: 'Zielmarkierungsbomben',
            BOMBS_MARKER_DESC: 'Diese Bomben waren meistens mit 60 Leuchtsätzen bestückt. Sie explodierten am Boden und setzten dann eine roten, grünen oder gelben Rauch frei. Etwa 13 dieser Bomben landeten in Heilbronn. Mit ihrer Hilfe sollten die Kampfflugzeuge ihre Ziele besser erkennen.',
            BOMBS_COMPARISON: 'Bomben im Vergleich',
            EXPLORE_DESTRUCTION: 'Zerstörte Stadt erkunden',
            TOTAL_DESTRUCTION: 'Totalschaden',
            PARTIAL_DESTRUCTION: 'Teilschaden',
            HEAVIEST_ATTACK: 'Schwerster Angriff',
            COMPARISON_LEGEND_TITLE: 'Der Luftkrieg über Deutschland'
        });
        $translateProvider.translations('en', {
            LOCALE: 'EN',
            LOCALE_OS: 'DE',
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
            LANCASTER_LOADING_WEIGHT: 'up to 9.000 kg',
            BOMBS: 'bombs',
            EXPLORE_BOMBS: 'learn more about the bombs',
            BOMBS_EXPLOSIVE_12000: '12000 lb explosive bombs',
            BOMBS_EXPLOSIVE_12000_DESC: 'The big explosive bombs were filled with more than 5000 kilograms dynamite. Five to ten of these bombs were dropped on Heilbronn.They exploded several meters above the ground in order to tear the roofs from buildings. Afterwards, smaller bombs could fall into the houses.',
            BOMBS_EXPLOSIVES: 'Other explosive bombs',
            BOMBS_EXPLOSIVES_DESC: 'More than 1000 of other explosive bombs were dropped on Heilbronn on December 4th. According to their size they were filled with 500 to 1800 kilograms dynamite. Some of the bombs were equipped with delayed fuses. These types can still be found today in construction works as the time fuses have not started in some cases.',
            BOMBS_FIRE: 'Stick-type incendiary bombs',
            BOMBS_FIRE_DESC: 'The majority of bombs that fell on Heilbronn were stick-type incendiary bombs. About 200.000 of these 60 centimeters long sticks were dropped. The bombs were filled with thermite, which quickly generates vast heat. By this, whole Heilbronn was supposed to catch fire. Today, remnants of these bombs are often found in construction works, for example, at the BuGa-disctrict in Heilbronn.',
            BOMBS_LIGHT: 'Flash bombs',
            BOMBS_LIGHT_DESC: 'The so-called “christmas trees”  were attached to small parachutes. Therefore, they came down to earth slowly. They were equipped with an approximately nine kilograms heavy flash entity which burned for about four minutes. With about 1000 of these bombs the air crafts lightned up the sky in order to have a better view on Heilbronn at night.',
            BOMBS_MARKER: 'target marker bombs',
            BOMBS_MARKER_DESC: 'These bombs usually were equipped with 60 flash enitites. They exploded on the ground and, next, discharged red, green or yellow smoke. About 13 of these bombs landed in Heilbronn. They were supposed to help the air crafts find their targets.',
            BOMBS_COMPARISON: 'Comparison of bombs',
            EXPLORE_DESTRUCTION: 'Show destroyed city',
            TOTAL_DESTRUCTION: 'Total desctruction',
            PARTIAL_DESTRUCTION: 'Partial desctruction',
            HEAVIEST_ATTACK: 'heaviest attack',
            COMPARISON_LEGEND_TITLE: 'The air war over Germany'
        });
        var getLocale = function () {
            var nav = window.navigator;
            return ((angular.isArray(nav.languages) ? nav.languages[0] : nav.language || nav.browserLanguage || nav.systemLanguage || nav.userLanguage) || '').split('-').join('_');
        };
        $translateProvider.determinePreferredLanguage(function () {
            return getLocale().indexOf('de') === 0 ? 'de' : 'en';
        });
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
                    var autoRestart = API.currentTime.getSeconds() > 0 && API.timeLeft.getSeconds() > 0;
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

    angular.module('app').run(function ($translate, $rootScope) {
        moment.locale($translate.use());
        $rootScope.changeLanguage = function () {
            $translate.use($translate.use() === 'en' ? 'de' : 'en');
            moment.locale($translate.use());
        };
    });
})(angular);
