# Interactive Talkie Operation Sawfish

Source code of the interactive talkie [Operation Sawfish](http://sawfish.stimme.de) by the German local newspaper "Heilbronner Stimme".

Based on [Talkie by Kiln](http://www.kiln.it/talkie/) and inspired by [InFlight](http://www.theguardian.com/world/ng-interactive/2014/aviation-100-years) and [Verbotene Flugrouten](http://interaktiv.morgenpost.de/abseits-der-flugrouten/).

The webapp is built with [AngularJS](https://angularjs.org), a Javascript framework by Google, which suites for single page web applications. The responsive part is realized with [CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries).
The [Talkie Framework](http://www.kiln.it/talkie/) by Kiln simplifies the synchronisation of animations and sound. [Videogular](http://www.videogular.com), a HTML5 video player for projects based on AngularJS, enables the adaption of the audio control elements. For the English version we worked with [Angular Translate](http://angular-translate.github.io) to load translation tables dynamically.
We basically worked with [Mapbox Studio](https://www.mapbox.com/mapbox-studio/#darwin) and [LeafletJS](http://leafletjs.com) and we used [Google Earth](https://www.google.com/earth/) for georeferencing and digitalizing the analog maps. To draw lines and polygons on the maps we used [WalkwayJS](https://github.com/ConnorAtherton/walkway). The SVG graphics are embedded inline and animated with [D3JS](http://d3js.org). Talkie.js simplifies the animation of the elements. 


# Benötigte Software

- node.js

# Globale node.js Module installieren

    npm install -g gulp bower


# Projekt-Dependencies installieren / aktualisieren

    npm install
    bower install

# Lokalen Entwicklungsserver starten

    gulp

# License

The MIT License (MIT)

Copyright (c) 2014 Heilbronner Stimme

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
