const dbHandler = require('./dbHandler');

jest.setTimeout(30000); // 30 seconds

beforeAll(async () => {
  await dbHandler.connect();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});
