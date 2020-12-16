// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";

// D3 Imports
import { scaleLinear } from "d3-scale";
import { Roles } from "../../interfaces";
import { defaultMaxListeners } from "stream";

export class Meter extends Component {
	type = "meter";

	render(animate = true) {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();
		const data = this.model.getDisplayData();
		const status = this.model.getStatus();
		const { width } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true
		});
		const { groupMapsTo } = options.data;

		const min = Tools.getProperty(options, "meter", "min");
		const max = Tools.getProperty(options, "meter", "max");
		const subranges = Tools.getProperty(options, "meter", "subranges");

		if (subranges != null) {
			this.drawSubrange();
		}

		// each meter has a scale for the value but no visual axis
		const xScale = scaleLinear()
			.domain([min != null ? min : 0, max != null ? max : 100])
			.range([0, width]);

		// draw the container to hold the value
		DOMUtils.appendOrSelect(svg, "rect.container")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", Tools.getProperty(options, "meter", "height"));

		// value larger than 100 will display as 100% on meter chart
		const maximumBarWidth = data.value >= (max != null ? max : 100);

		// rect with the value binded
		const value = svg.selectAll("rect.value").data([data]);

		// if user provided a color for the bar, we dont want to attach a status class
		const userProvidedScale = Tools.getProperty(options, "color", "scale");

		// draw the value bar
		value
			.enter()
			.append("rect")
			.classed("value", true)
			.merge(value)
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", Tools.getProperty(options, "meter", "height"))
			.attr(
				"class",
				status != null && !userProvidedScale
					? `value status--${status}`
					: ""
			)
			.transition(
				this.services.transitions.getTransition(
					"meter-bar-update",
					animate
				)
			)
			.attr("width", (d) =>
				maximumBarWidth ? xScale(100) : xScale(d.value)
			)
			.attr("fill", (d) => self.model.getFillColor(d[groupMapsTo]))
			// a11y
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "value")
			.attr("aria-label", (d) => d.value);

		// draw the peak
		const peakValue = Tools.getProperty(options, "meter", "peak");

		// update the peak if it is less than the value, it should be equal to the value
		const updatedPeak =
			peakValue !== null && peakValue < data.value
				? data.value
				: peakValue;
		// dont display peak if there isnt one
		const peakData =
			updatedPeak === null || maximumBarWidth ? [] : [updatedPeak];

		// if a peak is supplied within the domain, we want to render it
		const peak = svg.selectAll("line.peak").data(peakData);

		peak.enter()
			.append("line")
			.classed("peak", true)
			.merge(peak)
			.attr("y1", 0)
			.attr("y2", Tools.getProperty(options, "meter", "height"))
			.transition(
				this.services.transitions.getTransition(
					"peak-line-update",
					animate
				)
			)
			.attr("x1", (d) => xScale(d))
			.attr("x2", (d) => xScale(d))
			// a11y
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "peak")
			.attr("aria-label", (d) => d);

		peak.exit().remove();

		if (min != null && max != null) {
			const minText = DOMUtils.appendOrSelect(svg, "text.minimum");
			minText.data(min);

			minText
				.enter()
				.append("text")
				.attr("class", "minimum")
				.merge(minText)
				.text(min)
				.attr("x", 0)
				.attr("y", subranges != null ? 30 : 20);

			const maxText = DOMUtils.appendOrSelect(svg, "text.maximum");
			maxText.data(max);

			maxText
				.enter()
				.append("text")
				.attr("class", "maximum")
				.merge(maxText)
				.text(max)
				.attr("x", xScale(max) - maxText.node().getComputedTextLength())
				.attr("y", subranges != null ? 30 : 20);
		}

		// this forces the meter chart to only take up as much height as needed (if no height is provided)
		this.services.domUtils.setSVGMaxHeight();
	}

	drawSubrange() {
		const options = this.model.getOptions();
		const subranges = Tools.getProperty(options, "meter", "subranges");
		const min = Tools.getProperty(options, "meter", "min");
		const max = Tools.getProperty(options, "meter", "max");
		const data = this.model.getDisplayData();
		const svg = this.getContainerSVG();
		const { width } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true
		});

		const xScale = scaleLinear()
			.domain([min != null ? min : 0, max != null ? max : 100])
			.range([0, width]);

		const maximumBarWidth = data.value >= (max != null ? max : 100);

		const subrange = svg.selectAll("rect.subrange").data(subranges);

		subrange
			.enter()
			.append("rect")
			.classed("subrange", true)
			.merge(subrange)
			.attr("x", (d) => xScale(d.begin))
			.attr("y", -5)
			.attr("height", Tools.getProperty(options, "meter", "height") + 10)
			.attr("width", (d) =>
				maximumBarWidth ? xScale(100) : xScale(d.end - d.begin)
			)
			.attr("fill", (d) => d.color)
			// a11y
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "value")
			.attr("aria-label", (d) => d.value);
	}
}
