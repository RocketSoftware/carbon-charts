<template>
	<div class="ccv-gauge-chart"></div>
</template>

<script>
import { GaugeChart } from '@rocketsoftware/charts';
import CcvBaseChart from './ccv-base-chart.vue';

export default {
	name: 'CcvGaugeChart',
	extends: CcvBaseChart,
	mounted() {
		this.coreChart = new GaugeChart(this.$el, {
			data: this.data,
			options: this.options,
		});
	},
};
</script>
