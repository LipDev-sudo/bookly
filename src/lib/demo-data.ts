import { z } from "zod";

const appointmentStatusSchema = z.enum([
  "scheduled",
  "completed",
  "canceled",
]);

const demoBusinessSchema = z.object({
  name: z.string(),
  category: z.string(),
  owner: z.string(),
  city: z.string(),
});

const demoAppointmentSchema = z.object({
  id: z.string(),
  client: z.string(),
  service: z.string(),
  startsAt: z.string(),
  price: z.number().nonnegative(),
  status: appointmentStatusSchema,
});

const demoClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  visits: z.number().int().nonnegative(),
});

const demoServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number().int().positive(),
  price: z.number().nonnegative(),
  active: z.boolean(),
});

const demoStateSchema = z.object({
  business: demoBusinessSchema,
  appointments: z.array(demoAppointmentSchema),
  clients: z.array(demoClientSchema),
  services: z.array(demoServiceSchema),
});

export type DemoAppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type DemoAppointment = z.infer<typeof demoAppointmentSchema>;
export type DemoClient = z.infer<typeof demoClientSchema>;
export type DemoService = z.infer<typeof demoServiceSchema>;
export type DemoState = z.infer<typeof demoStateSchema>;

export type DemoMetrics = {
  scheduled: number;
  completed: number;
  canceled: number;
  revenue: number;
};

const DEMO_BUSINESS = {
  name: "Estúdio Aurora",
  category: "Cabelo e beleza",
  owner: "Carolina Mendes",
  city: "Recife, PE",
} as const;

export function createDemoState(): DemoState {
  return {
    business: { ...DEMO_BUSINESS },
    appointments: [
      {
        id: "a1",
        client: "Marina Costa",
        service: "Corte e finalização",
        startsAt: "Hoje, 14:00",
        price: 85,
        status: "scheduled",
      },
      {
        id: "a2",
        client: "Beatriz Nunes",
        service: "Escova modelada",
        startsAt: "Hoje, 15:30",
        price: 70,
        status: "scheduled",
      },
      {
        id: "a3",
        client: "Juliana Alves",
        service: "Tratamento de hidratação",
        startsAt: "Amanhã, 09:00",
        price: 120,
        status: "scheduled",
      },
      {
        id: "a4",
        client: "Camila Rocha",
        service: "Coloração",
        startsAt: "Hoje, 10:00",
        price: 180,
        status: "completed",
      },
      {
        id: "a5",
        client: "Renata Lima",
        service: "Tratamento de hidratação",
        startsAt: "Hoje, 11:30",
        price: 120,
        status: "completed",
      },
      {
        id: "a6",
        client: "Marina Costa",
        service: "Escova modelada",
        startsAt: "Ontem, 16:00",
        price: 70,
        status: "canceled",
      },
    ],
    clients: [
      {
        id: "c1",
        name: "Marina Costa",
        email: "marina.costa@example.com",
        phone: "(81) 99999-0101",
        visits: 6,
      },
      {
        id: "c2",
        name: "Beatriz Nunes",
        email: "beatriz.nunes@example.com",
        phone: "(81) 99999-0102",
        visits: 4,
      },
      {
        id: "c3",
        name: "Juliana Alves",
        email: "juliana.alves@example.com",
        phone: "(81) 99999-0103",
        visits: 3,
      },
      {
        id: "c4",
        name: "Camila Rocha",
        email: "camila.rocha@example.com",
        phone: "(81) 99999-0104",
        visits: 8,
      },
      {
        id: "c5",
        name: "Renata Lima",
        email: "renata.lima@example.com",
        phone: "(81) 99999-0105",
        visits: 5,
      },
    ],
    services: [
      {
        id: "s1",
        name: "Corte e finalização",
        duration: 60,
        price: 85,
        active: true,
      },
      {
        id: "s2",
        name: "Escova modelada",
        duration: 45,
        price: 70,
        active: true,
      },
      {
        id: "s3",
        name: "Coloração",
        duration: 120,
        price: 180,
        active: true,
      },
      {
        id: "s4",
        name: "Tratamento de hidratação",
        duration: 50,
        price: 120,
        active: true,
      },
    ],
  };
}

export function createEmptyDemoState(): DemoState {
  return {
    business: { ...DEMO_BUSINESS },
    appointments: [],
    clients: [],
    services: [],
  };
}

export function parseDemoState(serialized: string): DemoState {
  try {
    return demoStateSchema.parse(JSON.parse(serialized));
  } catch {
    throw new Error("Os dados salvos da demonstração são inválidos.");
  }
}

export function completeNextAppointment(state: DemoState): DemoState {
  let completed = false;

  return {
    ...state,
    appointments: state.appointments.map((appointment) => {
      if (!completed && appointment.status === "scheduled") {
        completed = true;
        return { ...appointment, status: "completed" };
      }

      return appointment;
    }),
  };
}

export function getDemoMetrics(state: DemoState): DemoMetrics {
  const metrics: DemoMetrics = {
    scheduled: 0,
    completed: 0,
    canceled: 0,
    revenue: 0,
  };

  for (const appointment of state.appointments) {
    metrics[appointment.status] += 1;

    if (appointment.status === "completed") {
      metrics.revenue += appointment.price;
    }
  }

  return metrics;
}

export const DEMO_STORAGE_KEY = "horavia-demo-v1";
