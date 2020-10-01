<script>
  import { MeterChart } from "@rocketsoftware/charts";
  import BaseChart from "./BaseChart.svelte";
</script>

<BaseChart {...$$restProps} Chart={MeterChart} on:load on:update on:destroy />
