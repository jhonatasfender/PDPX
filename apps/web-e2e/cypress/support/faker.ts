import { faker } from "@faker-js/faker";

export const fakeUser = () => ({
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 12 }),
  name: faker.person.fullName(),
});

export { faker };
