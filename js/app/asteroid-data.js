/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _AsteroidsData = __webpack_require__(1);

var _AsteroidsData2 = _interopRequireDefault(_AsteroidsData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _AsteroidsData2.default();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsteroidsData = function () {
    function AsteroidsData() {
        _classCallCheck(this, AsteroidsData);

        // Retrieve the hazardous asteroids array from the local storage
        this.asteroidArray = JSON.parse(localStorage.getItem("hazardousAsteroids"));
        // Retrieve the selected asteroid from the local storage
        this.selectedAsteroids = JSON.parse(localStorage.getItem("asteroids"));

        // Loop through all selected asteroids
        for (var j = 0; j < this.selectedAsteroids.length; j++) {

            for (var i = 0; i < this.asteroidArray.length; i++) {
                // Find the selected asteroid and its data
                if (this.asteroidArray[i].name === this.selectedAsteroids[j]) {
                    // Fetch all close encounters from 1900 to 1999 for selected asteroid
                    this.fetchCloseEncounters(this.asteroidArray[i].links.self, this.selectedAsteroids[j]);
                }
            }
        }

        document.getElementById("goBack").onclick = this.goBack.bind(this);
    }

    _createClass(AsteroidsData, [{
        key: "fetchCloseEncounters",
        value: function fetchCloseEncounters(url, asteroidName) {
            var dataFrom1900To1999 = [];

            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', url);

            xhr2.send(null);

            var self = this; // Save a reference of "this" keyword for future use

            xhr2.onreadystatechange = function () {
                var DONE = 4;
                var OK = 200;
                if (xhr2.readyState === DONE) {
                    if (xhr2.status === OK) {
                        var res = JSON.parse(xhr2.responseText);
                        var closeApproaches = res.close_approach_data; // Store all close approaches

                        // Find all close approaches from 1900 to 1999
                        for (var i = 0; i < closeApproaches.length; i++) {
                            var date = closeApproaches[i].close_approach_date; // Extract the date of close approach
                            var year = +date.substring(0, 4); // Extract only the year from a date and turn it into number with + operator

                            if (year >= 1900 && year <= 1999) {
                                dataFrom1900To1999.push(closeApproaches[i]); // Save only those in the time span from 1900 to 1999
                            }
                        }

                        // Get the number of close approaches
                        var numberOfCloseApproaches = dataFrom1900To1999.length;

                        // Pick the color based on the number of the approaches
                        var color = self.pickColor.call(self, numberOfCloseApproaches);

                        // Create the chart based on a number
                        self.createChart.call(this, numberOfCloseApproaches, color, asteroidName);
                    } else {
                        console.log('Error: ' + xhr2.status); // An error occurred during the request.
                    }
                }
            };
        }
    }, {
        key: "pickColor",
        value: function pickColor(number) {
            var color = void 0;

            if (number < 25) {
                color = "green";
            } else if (number > 25 && number < 45) {
                color = "yellow";
            } else if (number > 45 && number < 75) {
                color = "orange";
            } else {
                color = "red";
            }

            return color;
        }
    }, {
        key: "createChart",
        value: function createChart(closeApproaches, color, asteroidName) {
            // Save a reference to a chartName and chartAsteroid elements
            var chartName = document.getElementById("chart__name");
            var chartAsteroid = document.getElementById("chart__asteroid");

            var span = document.createElement("span");
            span.setAttribute("class", "selectedAsteroid");
            var nameText = document.createTextNode(asteroidName);
            span.appendChild(nameText);
            chartName.appendChild(span);
            var br = document.createElement("br");
            chartName.appendChild(br);

            // Create div with the class "chart__asteroid"
            var div = document.createElement("div");
            div.setAttribute("class", "chart__asteroid");

            // Create inner div with the class "chart__number", text with number of close approaches, append it to div
            var innerDiv = document.createElement("div");
            innerDiv.setAttribute("class", "chart__number");
            div.appendChild(innerDiv);

            // Append the final div to chartAsteroid element
            chartAsteroid.appendChild(div);

            // Add width and background color
            if (closeApproaches <= 100) {
                innerDiv.style.width = "" + closeApproaches + "%";
                innerDiv.style.backgroundColor = color;
                innerDiv.innerHTML = "" + closeApproaches + "";
            } else {
                innerDiv.style.width = "100%";
                innerDiv.style.backgroundColor = color;
                innerDiv.innerHTML = "" + closeApproaches + "";
            }
        }
    }, {
        key: "goBack",
        value: function goBack() {
            window.location = "index.html"; // Go back to index page
        }
    }]);

    return AsteroidsData;
}();

exports.default = AsteroidsData;

/***/ })
/******/ ]);