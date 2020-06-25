<script>
  import { AreaChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={AreaChart}
  on:load
  on:update
  on:destroy />
