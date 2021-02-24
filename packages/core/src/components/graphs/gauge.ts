// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { Roles, Events, GaugeTypes, ArrowDirections } from "../../interfaces";
import { Tools } from "../../tools";

// D3 Imports
import { select } from "d3-selection";
import { arc } from "d3-shape";

// arrow paths for delta
const ARROW_UP_PATH_STRING = "4,10 8,6 12,10";
const ARROW_DOWN_PATH_STRING = "12,6 8,10 4,6";

export class Gauge extends Component {
	type = "gauge";

	// We need to store our arcs so that addEventListeners() can access them
	arc: any;
	backgroundArc: any;

	init() {
		const eventsFragment = this.services.events;
	}

	getValue(): number {
		const data = this.model.getData();
		const value = data.find((d) => d.group === "value")?.value ?? null;
		return value;
	}

	getValueRatio(): number {
		const options = this.model.getOptions();
		let value = Tools.clamp(this.getValue(), 0, 100);
		const min = Tools.getProperty(options, "min");
		const max = Tools.getProperty(options, "max");

		if (min != null && max != null) {
			value = Tools.clamp(this.getValue(), min, max);
			return (value - min) / (max - min);
		} else {
			return value / 100;
		}
	}

	getDelta(): number {
		const data = this.model.getData();
		const delta = data.find((d) => d.group === "delta")?.value ?? null;
		return delta;
	}

	getArcRatio(): number {
		const options = this.model.getOptions();
		const type = Tools.getProperty(options, "gauge", "type");
		const arcRatio = type === GaugeTypes.FULL ? 1 : 0.5;
		return arcRatio;
	}

	getArcSize(): number {
		return this.getArcRatio() * Math.PI * 2;
	}

	getStartAngle(): number {
		const arcSize = this.getArcSize();
		if (arcSize === 2 * Math.PI) {
			return 0;
		}
		return -arcSize / 2;
	}

	// use provided arrow direction or default to using the delta
	getArrow(delta): string {
		const options = this.model.getOptions();
		const arrowDirection = Tools.getProperty(
			options,
			"gauge",
			"deltaArrow",
			"direction"
		);

		switch (arrowDirection) {
			case ArrowDirections.UP:
				return ARROW_UP_PATH_STRING;
			case ArrowDirections.DOWN:
				return ARROW_DOWN_PATH_STRING;
			default:
				return delta > 0
					? ARROW_UP_PATH_STRING
					: ARROW_DOWN_PATH_STRING;
		}
	}

	render(animate = true) {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();
		const { groupMapsTo } = options.data;

		const value = this.getValue();
		const valueRatio = this.getValueRatio();
		const arcSize = this.getArcSize();

		// angles for drawing the gauge
		const startAngle = this.getStartAngle();
		const rotationAngle = valueRatio * arcSize;
		const currentAngle = startAngle + rotationAngle;
		const endAngle = startAngle + arcSize;

		// Compute the outer radius needed
		const radius = this.computeRadius();
		const innerRadius = this.getInnerRadius();

		// draw the container and arc
		this.backgroundArc = arc()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.startAngle(currentAngle)
			.endAngle(endAngle);

		this.arc = arc()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.startAngle(startAngle)
			.endAngle(currentAngle);

		const subranges = Tools.getProperty(options, "subranges");
		//draw the subranges
		if (subranges != null) {
			this.drawSubranges(this.mapSubranges(subranges));
		}

		// draw the container
		DOMUtils.appendOrSelect(svg, "path.arc-background")
			.attr("d", this.backgroundArc)
			.attr("role", Roles.GROUP);

		// Add data arc
		const arcValue = svg.selectAll("path.arc-foreground").data([value]);

		arcValue
			.enter()
			.append("path")
			.attr("class", "arc-foreground")
			.merge(arcValue)
			.attr("d", this.arc)
			.attr("fill", (d) => self.model.getFillColor(d[groupMapsTo]))
			// a11y
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "value")
			.attr("aria-label", (d) => d.value);

		// Position Arc
		svg.attr("transform", `translate(${radius}, ${radius})`);

		// draw the value and delta to the center
		this.drawValueNumber();
		this.drawDelta();

		if (options.min != null && options.max != null) {
			this.drawMinMax();
		}

		arcValue.exit().remove();

		// Add event listeners
		this.addEventListeners();
	}

	/**
	 * draws the value number associated with the Gauge component in the center
	 */
	drawValueNumber() {
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();

		const arcType = Tools.getProperty(options, "gauge", "type");
		const disablePercentage = Tools.getProperty(
			options,
			"disablePercentage"
		);
		const value = this.getValue();
		const delta = this.getDelta();

		// Sizing and positions relative to the radius
		const radius = this.computeRadius();

		const valueFontSize = Tools.getProperty(
			options,
			"gauge",
			"valueFontSize"
		);
		// if there is a delta, use the size to center the numbers, otherwise center the valueNumber
		const deltaFontSize = Tools.getProperty(
			options,
			"gauge",
			"deltaFontSize"
		);

		const numberSpacing = Tools.getProperty(
			options,
			"gauge",
			"numberSpacing"
		);

		// circular gauge without delta should have valueNumber centered
		let numbersYPosition = 0;
		if (arcType === GaugeTypes.FULL && !delta) {
			numbersYPosition = deltaFontSize(radius);
		} else if (arcType === GaugeTypes.SEMI && delta) {
			// semi circular gauge we want the numbers aligned to the chart container
			numbersYPosition = -(deltaFontSize(radius) + numberSpacing);
		}

		// Add the numbers at the center
		const numbersGroup = DOMUtils.appendOrSelect(
			svg,
			"g.gauge-numbers"
		).attr("transform", `translate(0, ${numbersYPosition})`);

		// Add the big number
		const valueNumberGroup = DOMUtils.appendOrSelect(
			numbersGroup,
			"g.gauge-value-number"
		).attr("transform", "translate(-10, 0)"); // Optical centering for the presence of the smaller % symbol

		const numberFormatter = Tools.getProperty(
			options,
			"gauge",
			"numberFormatter"
		);
		const valueNumber = valueNumberGroup
			.selectAll("text.gauge-value-number")
			.data([value]);

		valueNumber
			.enter()
			.append("text")
			.attr("class", "gauge-value-number")
			.merge(valueNumber)
			.style("font-size", `${valueFontSize(radius)}px`)
			.attr("text-anchor", "middle")
			.text((d) => numberFormatter(d));

		// add the percentage symbol beside the valueNumber
		const {
			width: valueNumberWidth
		} = DOMUtils.getSVGElementSize(
			DOMUtils.appendOrSelect(svg, "text.gauge-value-number"),
			{ useBBox: true }
		);

		DOMUtils.appendOrSelect(valueNumberGroup, "text.gauge-value-symbol")
			.style("font-size", `${valueFontSize(radius) / 2}px`)
			.attr("x", valueNumberWidth / 2)
			.text(disablePercentage ? "" : "%");
	}

	/**
	 * adds the delta number for the gauge
	 */
	drawDelta() {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();
		const delta = this.getDelta();
		const disablePercentage = Tools.getProperty(
			options,
			"disablePercentage"
		);

		// Sizing and positions relative to the radius
		const radius = this.computeRadius();
		const deltaFontSize = delta
			? Tools.getProperty(options, "gauge", "deltaFontSize")
			: () => 0;

		// use numberFormatter here only if there is a delta supplied
		const numberFormatter = delta
			? Tools.getProperty(options, "gauge", "numberFormatter")
			: () => null;

		const arrowSize = Tools.getProperty(
			options,
			"gauge",
			"deltaArrow",
			"size"
		);
		const numberSpacing = Tools.getProperty(
			options,
			"gauge",
			"numberSpacing"
		);

		const numbersGroup = DOMUtils.appendOrSelect(svg, "g.gauge-numbers");

		// Add the smaller number of the delta
		const deltaGroup = DOMUtils.appendOrSelect(
			numbersGroup,
			"g.gauge-delta"
		).attr(
			"transform",
			`translate(0, ${deltaFontSize(radius) + numberSpacing})`
		);

		const deltaNumber = DOMUtils.appendOrSelect(
			deltaGroup,
			"text.gauge-delta-number"
		);

		deltaNumber.data(delta === null ? [] : [delta]);

		deltaNumber
			.enter()
			.append("text")
			.classed("gauge-delta-number", true)
			.merge(deltaNumber)
			.attr("text-anchor", "middle")
			.style("font-size", `${deltaFontSize(radius)}px`)
			.text(
				(d) =>
					`${numberFormatter(d)}` + `${disablePercentage ? "" : "?"}`
			);

		// Add the caret for the delta number
		const {
			width: deltaNumberWidth
		} = DOMUtils.getSVGElementSize(
			DOMUtils.appendOrSelect(svg, ".gauge-delta-number"),
			{ useBBox: true }
		);

		// check if delta arrow is disabled
		const arrowEnabled = Tools.getProperty(
			options,
			"gauge",
			"deltaArrow",
			"enabled"
		);
		const deltaArrow = deltaGroup
			.selectAll("svg.gauge-delta-arrow")
			.data(delta !== null && arrowEnabled ? [delta] : []);

		deltaArrow
			.enter()
			.append("svg")
			.merge(deltaArrow)
			.attr("class", "gauge-delta-arrow")
			.attr("x", -arrowSize(radius) - deltaNumberWidth / 2)
			.attr("y", -arrowSize(radius) / 2 - deltaFontSize(radius) * 0.35)
			.attr("width", arrowSize(radius))
			.attr("height", arrowSize(radius))
			.attr("viewBox", "0 0 16 16");

		// Needed to correctly size SVG in Firefox
		DOMUtils.appendOrSelect(deltaArrow, "rect.gauge-delta-arrow-backdrop")
			.attr("width", "16")
			.attr("height", "16")
			.attr("fill", "none");

		// Draw the arrow with status
		const status = Tools.getProperty(options, "gauge", "status");
		DOMUtils.appendOrSelect(deltaArrow, "polygon.gauge-delta-arrow")
			.attr(
				"class",
				status !== null ? `gauge-delta-arrow status--${status}` : ""
			)
			.attr("fill", () => (status === null ? "currentColor" : null))
			.attr("points", self.getArrow(delta));

		deltaArrow.exit().remove();
		deltaNumber.exit().remove();
	}

	drawMinMax() {
		const svg = this.getContainerSVG();
		const radius = this.computeRadius();
		const innerRadius = this.getInnerRadius();
		const arcWidth = radius - innerRadius;
		const options = this.model.getOptions();
		const min = Tools.getProperty(options, "min");
		const max = Tools.getProperty(options, "max");
		const minMaxFontSize = Tools.getProperty(
			options,
			"gauge",
			"minMaxFontSize"
		);

		const numberFormatter = Tools.getProperty(
			options,
			"gauge",
			"numberFormatter"
		);

		const numbersGroup = DOMUtils.appendOrSelect(svg, "g.guage-min-max");

		const minGroup = DOMUtils.appendOrSelect(numbersGroup, "g.gauge-min");

		const minNumber = DOMUtils.appendOrSelect(
			minGroup,
			"text.min-group-number"
		);

		minNumber.data(min === null ? [] : [min]);

		minNumber
			.enter()
			.append("text")
			.merge(minNumber)
			.attr("text-anchor", "middle")
			.style("font-size", `${minMaxFontSize(radius) / 1.5}px`)
			.text((d) => `${numberFormatter(d)}`)
			.attr(
				"x",
				-innerRadius + arcWidth + minNumber.node().getBBox().width / 2
			)
			.attr("y", 0);

		const maxGroup = DOMUtils.appendOrSelect(numbersGroup, "g.gauge-max");

		const maxNumber = DOMUtils.appendOrSelect(
			maxGroup,
			"text.max-group-number"
		);

		maxNumber.data(max === null ? [] : [max]);

		maxNumber
			.enter()
			.append("text")
			.merge(maxNumber)
			.attr("text-anchor", "middle")
			.style("font-size", `${minMaxFontSize(radius) / 1.5}px`)
			.text((d) => `${numberFormatter(d)}`)
			.attr(
				"x",
				innerRadius - arcWidth - maxNumber.node().getBBox().width / 2
			)
			.attr("y", 0);
	}

	mapSubranges(array) {
		const options = this.model.getOptions();
		const min = Tools.getProperty(options, "min");
		const max = Tools.getProperty(options, "max");

		const startAngle = this.getStartAngle();
		const arcSize = this.getArcSize();

		let newArray = array.map((obj, i) => {
			let rotationAngle;
			let endRotationAngle;
			if (min != null && max != null) {
				let newBegin = Tools.clamp(obj.begin, min, max);
				let newEnd = Tools.clamp(obj.end, min, max);
				let rotationRatio = (newBegin - min) / (max - min);
				let endRatio = (newEnd - min) / (max - min);

				rotationAngle = rotationRatio * arcSize;
				endRotationAngle = endRatio * arcSize;
			} else {
				let newBegin = Tools.clamp(obj.begin, 0, 100) / 100;
				let newEnd = Tools.clamp(obj.end, 0, 100) / 100;

				rotationAngle = newBegin * arcSize;
				endRotationAngle = newEnd * arcSize;
			}

			let currentAngle = startAngle + rotationAngle;
			let endAngle = startAngle + endRotationAngle;

			return {
				begin: currentAngle,
				end: endAngle,
				color: obj.color,
				beginLabel: obj.begin,
				endLabel: obj.end
			};
		});
		return newArray;
	}

	drawSubranges(subranges) {
		const options = this.model.getOptions();
		const svg = this.getContainerSVG();
		const radius = this.computeRadius();
		const innerRadius = this.getInnerRadius();
		const min = Tools.getProperty(options, "min");
		const max = Tools.getProperty(options, "max");

		const subrangeArc = arc()
			.innerRadius(innerRadius - 10)
			.outerRadius(radius + 10)
			.startAngle(function (d: any) {
				return d.begin;
			})
			.endAngle(function (d: any) {
				return d.end;
			});
		const subRangeGroup = DOMUtils.appendOrSelect(svg, "g.subrange-group");

		const subRange = subRangeGroup
			.selectAll("path.subrange")
			.data(subranges);

		subRange
			.enter()
			.append("path")
			.merge(subRange)
			.attr("class", "subrange")
			.attr("d", subrangeArc)
			.attr("fill", (d) => d.color);

		const subRangeLabelBegin = subRangeGroup
			.selectAll("text.subrange-label-begin")
			.data(subranges);

		subRangeLabelBegin
			.enter()
			.append("text")
			.attr("class", "subrange-label-begin")
			.merge(subRangeLabelBegin)
			.style("fill", (d) => (d.beginLabel === min ? "#00000000" : ""))
			.attr("transform", (d) => {
				let rotAngle = (d.begin * 180) / Math.PI;
				let marginValue = -innerRadius + 25;
				return (
					"rotate(" +
					rotAngle +
					") translate(0, " +
					marginValue +
					") rotate(" +
					-rotAngle +
					")"
				);
			})
			.text((d) => d.beginLabel);

		const subRangeLabelEnd = subRangeGroup
			.selectAll("text.subrange-label-end")
			.data(subranges);

		subRangeLabelEnd
			.enter()
			.append("text")
			.attr("class", "subrange-label-end")
			.merge(subRangeLabelEnd)
			.style("fill", (d) => (d.endLabel === max ? "#00000000" : ""))
			.attr("transform", (d) => {
				let rotAngle = (d.end * 180) / Math.PI;
				let marginValue = -innerRadius + 25;
				return (
					"rotate(" +
					rotAngle +
					") translate(0, " +
					marginValue +
					") rotate(" +
					-rotAngle +
					")"
				);
			})
			.text((d) => d.endLabel);
	}

	getInnerRadius() {
		// Compute the outer radius needed
		const radius = this.computeRadius();
		const arcWidth = Tools.getProperty(
			this.model.getOptions(),
			"gauge",
			"arcWidth"
		);
		return radius - arcWidth;
	}

	addEventListeners() {
		const self = this;
		this.parent
			.selectAll("path.arc")
			.on("mouseover", function (datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Gauge.ARC_MOUSEOVER, {
					element: select(this),
					datum
				});
			})
			.on("mousemove", function (datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Gauge.ARC_MOUSEMOVE, {
					element: hoveredElement,
					datum
				});
			})
			.on("click", function (datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Gauge.ARC_CLICK, {
					element: select(this),
					datum
				});
			})
			.on("mouseout", function (datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Gauge.ARC_MOUSEOUT, {
					element: hoveredElement,
					datum
				});
			});
	}

	// Helper functions
	protected computeRadius() {
		const options = this.model.getOptions();
		const arcType = Tools.getProperty(options, "gauge", "type");

		const { width, height } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true
		});
		const radius =
			arcType === GaugeTypes.SEMI
				? Math.min(width / 2, height)
				: Math.min(width / 2, height / 2);

		return radius;
	}
}
