<script>
  import { StackedAreaChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={StackedAreaChart}
  on:load
  on:update
  on:destroy />
