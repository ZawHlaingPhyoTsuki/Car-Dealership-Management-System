export const paths = {
	home: {
		getHref: () => "/",
	},

	login: {
		getHref: () => "/login",
	},

	dashboard: {
		root: {
			getHref: () => "/dashboard",
		},
		cars: {
			getHref: () => "/dashboard/cars",
		},
		carSharers: {
			getHref: () => "/dashboard/car-sharers",
		},
		expenses: {
			getHref: () => "/dashboard/expenses",
		},
		employees: {
			getHref: () => "/dashboard/employees",
		},
		analytics: {
			availableCars: {
				getHref: () => "/dashboard/analytics/available-cars",
			},
			soldCars: {
				getHref: () => "/dashboard/analytics/sold-cars",
			},
			carProfitSummary: {
				getHref: () => "/dashboard/analytics/car-profit-summary",
			},
			sharersTotal: {
				getHref: () => "/dashboard/analytics/sharers-total",
			},
		},
		account: {
			getHref: () => "/dashboard/account",
		},
		help: {
			getHref: () => "/dashboard/help",
		},
	},
} as const;
