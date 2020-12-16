export const meterData = [
	{
		group: "Dataset 1",
		value: 56
	}
];

export const meterOptionsWithStatus = {
	title: "Meter Chart - with statuses",
	meter: {
		peak: 80,
		status: {
			ranges: [
				{ range: [0, 50], status: "success" },
				{ range: [50, 60], status: "warning" },
				{ range: [60, 100], status: "danger" }
			]
		}
	},
	height: "100px"
};

export const meterOptionsCustomColor = {
	title: "Meter Chart - statuses and custom color",
	meter: {
		statusBar: {
			percentageIndicator: {
				useStatusColor: true,
				useValueColor: true
			}
		},
		peak: 70,
		status: {
			ranges: [
				{ range: [0, 40], status: "success" },
				{ range: [40, 60], status: "warning" },
				{ range: [60, 100], status: "danger" }
			]
		}
	},
	color: {
		scale: {
			"Dataset 1": "#925699"
		}
	},
	height: "100px"
};

export const meterOptionsNoStatus = {
	title: "Meter Chart - no status",
	meter: {
		peak: 70
	},
	height: "100px"
};

export const meterOptionsSubranges = {
	title: "Meter Chart - subranges",
	meter: {
		statusBar: {
			percentageIndicator: {
				removePercentage: true,
				useValueColor: true
			}
		},
		min: 0,
		max: 100,
		subranges: [
			{ begin: 85, end: 95, color: "orange" },
			{ begin: 95, end: 100, color: "red" }
		]
	},
	height: "100px"
};
