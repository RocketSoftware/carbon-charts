<script>
  import { ScatterChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart {...$$restProps} Chart={ScatterChart} on:load on:update on:destroy />
