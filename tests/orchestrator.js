import retry from "async-retry";
import { faker } from "@faker-js/faker"


import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";

const waitForAllServices = async () => {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      await response.json();
    }
  }
};

const clearDatabase = async () => {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
};

const runPendingMigrations = async () => {
  await migrator.runPendingMigrations();
};

const createUser = async (userObject) => {
  return await user.create({
    username: userObject.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "valid_password"
  })
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser
};

export default orchestrator;
