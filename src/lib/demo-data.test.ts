import { describe, expect, it } from "vitest";
import {
  completeNextAppointment,
  createDemoState,
  createEmptyDemoState,
  getDemoMetrics,
  parseDemoState,
} from "./demo-data";

describe("Horavia demo state", () => {
  it("creates a coherent Estúdio Aurora workspace", () => {
    const state = createDemoState();

    expect(state.business.name).toBe("Estúdio Aurora");
    expect(state.appointments).toHaveLength(6);
    expect(state.clients).toHaveLength(5);
    expect(state.services.map((service) => service.name)).toEqual([
      "Corte e finalização",
      "Escova modelada",
      "Coloração",
      "Tratamento de hidratação",
    ]);
  });

  it("parses a valid serialized workspace", () => {
    const state = createDemoState();

    expect(parseDemoState(JSON.stringify(state))).toEqual(state);
  });

  it("rejects malformed persisted data", () => {
    expect(() => parseDemoState('{"appointments":"invalid"}')).toThrow(
      "Os dados salvos da demonstração são inválidos.",
    );
  });

  it("derives operational metrics from appointments", () => {
    expect(getDemoMetrics(createDemoState())).toEqual({
      scheduled: 3,
      completed: 2,
      canceled: 1,
      revenue: 300,
    });
  });

  it("creates independent empty collections", () => {
    const first = createEmptyDemoState();
    const second = createEmptyDemoState();

    expect(first.appointments).toEqual([]);
    expect(first.clients).toEqual([]);
    expect(first.services).toEqual([]);
    expect(first.appointments).not.toBe(second.appointments);
  });

  it("completes only the first scheduled appointment", () => {
    const state = createDemoState();
    const next = completeNextAppointment(state);

    expect(next.appointments[0].status).toBe("completed");
    expect(next.appointments[1].status).toBe("scheduled");
    expect(state.appointments[0].status).toBe("scheduled");
  });
});
