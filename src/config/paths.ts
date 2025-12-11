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
		expenses: {
			getHref: () => "/dashboard/expenses",
		},
		employees: {
			getHref: () => "/dashboard/employees",
		},
		analytics: {
			getHref: () => "/dashboard/analytics",
			availableCars: {
				getHref: () => "/dashboard/analytics/available-cars",
			},
			soldCars: {
				getHref: () => "/dashboard/analytics/sold-cars",
			},
			soldCars2: {
				getHref: () => "/dashboard/analytics/sold-cars2",
			},
			carCosts: {
				getHref: () => "/dashboard/analytics/car-costs",
			},
			expenseCategories: {
				getHref: () => "/dashboard/analytics/expense-categories",
			},
			profitSummary: {
				getHref: () => "/dashboard/analytics/profit-summary",
			},
		},
		account: {
			getHref: () => "/dashboard/account",
		},
		newAccount: {
			getHref: () => "/dashboard/account/new",
		},
		help: {
			getHref: () => "/dashboard/help",
		},
	},
} as const;
