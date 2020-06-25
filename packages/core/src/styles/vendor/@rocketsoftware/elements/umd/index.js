(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@rocketsoftware/colors'), require('@rocketsoftware/themes'), require('@rocketsoftware/layout'), require('@rocketsoftware/motion'), require('@rocketsoftware/type')) :
	typeof define === 'function' && define.amd ? define(['exports', '@rocketsoftware/colors', '@rocketsoftware/themes', '@rocketsoftware/layout', '@rocketsoftware/motion', '@rocketsoftware/type'], factory) :
	(factory((global.CarbonElements = {}),global.RocketsoftwareColors,global.RocketsoftwareThemes,global.RocketsoftwareLayout,global.RocketsoftwareMotion,global.RocketsoftwareType));
}(this, (function (exports,colors,themes,layout,motion,type) { 'use strict';

	/**
	 * Copyright IBM Corp. 2018, 2018
	 *
	 * This source code is licensed under the Apache-2.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	Object.keys(colors).forEach(function (key) { exports[key] = colors[key]; });
	Object.keys(themes).forEach(function (key) { exports[key] = themes[key]; });
	Object.keys(layout).forEach(function (key) { exports[key] = layout[key]; });
	Object.keys(motion).forEach(function (key) { exports[key] = motion[key]; });
	Object.keys(type).forEach(function (key) { exports[key] = type[key]; });

	Object.defineProperty(exports, '__esModule', { value: true });

})));
