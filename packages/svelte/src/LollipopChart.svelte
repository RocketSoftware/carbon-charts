<script>
  export let chart = null;
  export let ref = null;

  import { LollipopChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={LollipopChart}
  bind:ref
  bind:chart
  on:load
  on:update
  on:destroy />
