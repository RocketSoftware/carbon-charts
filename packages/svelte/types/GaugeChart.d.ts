import { GaugeChart as GC } from "@rocketsoftware/charts";
import type { GaugeChartOptions } from "@rocketsoftware/charts/interfaces";
import BaseChart from "./BaseChart";

export default class GaugeChart extends BaseChart<GC, GaugeChartOptions> {}
