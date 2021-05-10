<script>
  export let chart = null;
  export let ref = null;

  import { BulletChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={BulletChart}
  bind:ref
  bind:chart
  on:load
  on:update
  on:destroy />
