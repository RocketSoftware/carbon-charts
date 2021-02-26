<template>
	<div class="ccv-boxplot-chart"></div>
</template>

<script>
import { BoxplotChart } from '@rocketsoftware/charts';
import CcvBaseChart from './ccv-base-chart.vue';

export default {
	name: 'CcvBoxplotChart',
	extends: CcvBaseChart,
	mounted() {
		this.coreChart = new BoxplotChart(this.$el, {
			data: this.data,
			options: this.options,
		});
	},
};
</script>
