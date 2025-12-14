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
			overview: {
				getHref: () => "/dashboard/analytics/overview",
			},
			availableCars: {
				getHref: () => "/dashboard/analytics/available-cars",
			},
			soldCars: {
				getHref: () => "/dashboard/analytics/sold-cars",
			},
			expenseCategories: {
				getHref: () => "/dashboard/analytics/expense-categories",
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
