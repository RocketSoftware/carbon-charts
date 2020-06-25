<script>
  import { GroupedBarChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={GroupedBarChart}
  on:load
  on:update
  on:destroy />
