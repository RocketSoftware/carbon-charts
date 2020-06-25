<script>
  import { SimpleBarChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart
  {...$$restProps}
  Chart={SimpleBarChart}
  on:load
  on:update
  on:destroy />
