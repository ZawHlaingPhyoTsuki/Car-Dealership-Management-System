import { faker } from "@faker-js/faker";

export interface DummyEmployee {
	id: string;
	name: string;
	email: string;
	position: string;
	phone: string | null;
	address: string | null;
	salary: number; // Int in Prisma
	startDate: Date;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

export const generateDummyEmployees = (count: number = 15): DummyEmployee[] => {
	const positions = [
		"Sales Manager",
		"Sales Associate",
		"Mechanic",
		"Service Advisor",
		"Finance Manager",
		"Detailer",
		"Receptionist",
		"Lot Porter",
	];

	return Array.from({ length: count }, (_, _i) => ({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: faker.internet.email(),
		position: faker.helpers.arrayElement(positions),
		phone: faker.phone.number(),
		address: faker.location.streetAddress(),
		salary: faker.number.int({ min: 30000, max: 120000 }),
		startDate: faker.date.past({ years: 5 }),
		createdAt: faker.date.past({ years: 3 }),
		updatedAt: faker.date.recent({ days: 30 }),
		deletedAt: faker.datatype.boolean(0.2)
			? faker.date.recent({ days: 10 })
			: null,
	}));
};
