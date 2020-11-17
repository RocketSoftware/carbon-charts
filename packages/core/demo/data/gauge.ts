export const gaugeData = [
	{ group: "value", value: 42 },
	{ group: "delta", value: -13.37 }
];

export const gaugeDataNoDelta = [{ group: "value", value: 67 }];

// guage no custom color
export const gaugeOptionsSemi = {
	title: "Gauge semicircular -- danger status",
	resizable: true,
	height: "250px",
	width: "100%",
	min: 0,
	max: 100,
	subranges: [
		{ 
			begin: 20, 
			end: 40, 
			color: "yellow" 
		},
		{
		  begin: 40,
		  end: 60,
		  color: "orange"
		},
		{
			begin: 60,
			end: 65,
			color: "red"
		},
	],
	disablePercentage: true,
	gauge: {
		type: "semi",
		status: "danger"
	}
};

// guage with custom color
export const gaugeOptionsCircular = {
	title: "Gauge circular -- warning status",
	resizable: true,
	height: "250px",
	gauge: {
		status: "warning",
		type: "full"
	}
};

// guage with custom color
export const gaugeOptionsCircularNoDelta = {
	title: "Gauge circular without delta",
	resizable: true,
	height: "250px",
	gauge: {
		type: "full"
	},
	color: {
		scale: {
			value: "#891EE8"
		}
	}
};
