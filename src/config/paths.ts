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
		},
		account: {
			getHref: () => "/dashboard/account",
		},
		newAccount: {
			getHref: () => "/dashboard/account/new",
		},
	},
} as const;
