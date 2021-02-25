<script lang="ts">
  import { RadarChart } from "../types";
  import type { RadarChart as RC } from "@rocketsoftware/charts";
  import { radarData as data, radarOptions } from "@rocketsoftware/charts/demo/data";

  let chart: RC = null;
  let ref = null;

  const options = radarOptions as any;
</script>

<RadarChart
	bind:chart
	bind:ref
	on:load={e => {
		console.log(e.detail);
	}}
	on:update={e => {
		console.log(e.detail);
	}}
	on:destroy={e => {
		console.log(e.detail);
	}}
	{data}
	{options} />

<svelte:component
	this={RadarChart}
	on:load={e => {
		console.log(e.detail);
	}}
	on:update={e => {
		console.log(e.detail);
	}}
	on:destroy={e => {
		console.log(e.detail);
	}}
	{data}
	{options} />
