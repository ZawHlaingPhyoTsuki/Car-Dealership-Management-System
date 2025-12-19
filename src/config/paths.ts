export const paths = {
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
			carProfitSummary: {
				getHref: () => "/dashboard/analytics/car-profit-summary",
			},
		},
	},
} as const;
