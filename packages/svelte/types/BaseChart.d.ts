/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";
import { Chart as BC } from "@rocketsoftware/charts/chart";
import type {
  BaseChartOptions,
  ChartTabularData,
} from "@rocketsoftware/charts/interfaces";

export interface BaseChartProps<Chart = BC, ChartOptions = BaseChartOptions>
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["div"]> {
  /**
   * Provide a Carbon chart class to instantiate
   * @default undefined
   */
  Chart?: Chart;

  /**
   * Obtain a reference to the instantiated chart
   * @default null
   */
  chart?: null | Chart;

  /**
   * Set the chart data using the tabular data format
   * @default []
   */
  data?: ChartTabularData;

  /**
   * Set the chart options
   * @default {}
   */
  options?: ChartOptions;

  /**
   * Specify the id for the chart holder element
   * @default "chart-" + Math.random().toString(36)
   */
  id?: string;

  /**
   * Obtain a reference to the chart holder element
   * @default null
   */
  ref?: null | HTMLDivElement;
}

export default class BaseChart<
  Chart = BaseChart,
  ChartOptions = BaseChartOptions
> extends SvelteComponentTyped<
  BaseChartProps<Chart, ChartOptions>,
  {
    load: CustomEvent<Chart>;
    update: CustomEvent<{
      data: ChartTabularData;
      options: ChartOptions;
    }>;
    destroy: CustomEvent<any>;
  },
  {}
> {}
