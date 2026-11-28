import { EventEmitter } from "node:events";
import { Pool } from "pg";
import { DatabaseService } from "./database.service";

jest.mock("pg", () => ({ Pool: jest.fn() }));

function harness() {
  const client = Object.assign(new EventEmitter(), {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    release: jest.fn(),
  });
  const pool = { on: jest.fn(), connect: jest.fn().mockResolvedValue(client), end: jest.fn() };
  (Pool as unknown as jest.Mock).mockImplementation(() => pool);
  return { service: new DatabaseService("postgresql://unused"), client };
}

describe("DatabaseService SSL configuration", () => {
  it("disables SSL by default and uses rejectUnauthorized=false when enabled", () => {
    const poolMock = Pool as unknown as jest.Mock;
    poolMock.mockReset();
    poolMock.mockImplementation(() => ({ on: jest.fn(), connect: jest.fn(), end: jest.fn() }));
    new DatabaseService("postgresql://unused");
    new DatabaseService("postgresql://unused", true);
    expect(poolMock).toHaveBeenNthCalledWith(1, {
      connectionString: "postgresql://unused",
      ssl: false,
    });
    expect(poolMock).toHaveBeenNthCalledWith(2, {
      connectionString: "postgresql://unused",
      ssl: { rejectUnauthorized: false },
    });
  });

  it("strips ssl and sslmode query params so connectionString cannot override ssl", () => {
    const poolMock = Pool as unknown as jest.Mock;
    poolMock.mockReset();
    poolMock.mockImplementation(() => ({ on: jest.fn(), connect: jest.fn(), end: jest.fn() }));
    new DatabaseService(
      "postgresql://user:pass@host/db?sslmode=require&ssl=true&application_name=vv",
      true,
    );
    expect(poolMock).toHaveBeenCalledWith({
      connectionString: "postgresql://user:pass@host/db?application_name=vv",
      ssl: { rejectUnauthorized: false },
    });
  });
});

describe("DatabaseService.transaction", () => {
  it("handles a reset on a checked-out client without an unhandled event", async () => {
    const { service, client } = harness();
    const reset = new Error("read ECONNRESET");
    await expect(service.transaction(async () => {
      client.emit("error", reset);
      return "unused";
    })).rejects.toBe(reset);
    expect(client.release).toHaveBeenCalledWith(reset);
  });

  it("keeps the original query error when rollback fails", async () => {
    const { service, client } = harness();
    const queryError = new Error("query failed");
    const rollbackError = new Error("socket closed");
    client.query.mockResolvedValueOnce({}); // BEGIN
    client.query.mockRejectedValueOnce(queryError);
    client.query.mockRejectedValueOnce(rollbackError);
    await expect(service.transaction(async (connection) => connection.query("SELECT 1"))).rejects.toBe(queryError);
    expect(client.release).toHaveBeenCalledWith(rollbackError);
  });

  it("releases a healthy client after commit", async () => {
    const { service, client } = harness();
    await expect(service.transaction(async () => 42)).resolves.toBe(42);
    expect(client.release).toHaveBeenCalledWith(undefined);
  });
});
