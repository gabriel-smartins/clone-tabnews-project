import database from "infra/database";
import retry from "async-retry";
import migrator from "models/migrator.js";

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
  await migrator.runPendingMigrations()
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations
};

export default orchestrator;
