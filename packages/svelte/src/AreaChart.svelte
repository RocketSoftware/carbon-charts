<script>
	export let chart = null;
	export let ref = null;

	import { AreaChart } from "@rocketsoftware/charts";
	import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
	{...$$restProps}
	Chart={AreaChart}
	bind:ref
	bind:chart
	on:load
	on:update
	on:destroy />
