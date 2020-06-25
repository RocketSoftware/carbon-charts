import React from "react";

import { GaugeChart as GC } from "@rocketsoftware/charts";
import BaseChart from "./base-chart";

export default class GaugeChart extends BaseChart {
	componentDidMount() {
		this.chart = new GC(
			this.chartRef,
			{
				data: this.props.data,
				options: this.props.options
			}
		);
	}

	render() {
		return (
			<div
				ref={chartRef => this.chartRef = chartRef}
				className="chart-holder">
			</div>
		);
	}
}
