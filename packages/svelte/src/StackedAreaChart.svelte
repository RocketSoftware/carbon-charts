<script>
  export let chart = null;
  export let ref = null;

  import { StackedAreaChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={StackedAreaChart}
  bind:ref
  bind:chart
  on:load
  on:update
  on:destroy />
