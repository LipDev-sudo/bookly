export type DemoAppointmentStatus = "scheduled" | "completed" | "canceled";

export type DemoAppointment = {
  id: string;
  client: string;
  service: string;
  startsAt: string;
  price: number;
  status: DemoAppointmentStatus;
};

export type DemoClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
};

export type DemoService = {
  id: string;
  name: string;
  duration: number;
  price: number;
  active: boolean;
};

export type DemoState = {
  appointments: DemoAppointment[];
  clients: DemoClient[];
  services: DemoService[];
};

export function createDemoState(): DemoState {
  return {
    appointments: [
      { id: "a1", client: "Marina Costa", service: "Corte + finalizacao", startsAt: "Today, 14:00", price: 85, status: "scheduled" },
      { id: "a2", client: "Rafael Lima", service: "Barba completa", startsAt: "Tomorrow, 10:00", price: 45, status: "scheduled" },
      { id: "a3", client: "Camila Rocha", service: "Coloracao", startsAt: "Jul 12, 16:00", price: 180, status: "completed" },
      { id: "a4", client: "Lucas Melo", service: "Corte masculino", startsAt: "Jul 9, 11:00", price: 60, status: "completed" },
    ],
    clients: [
      { id: "c1", name: "Marina Costa", email: "marina@example.com", phone: "(81) 99999-0101", visits: 6 },
      { id: "c2", name: "Rafael Lima", email: "rafael@example.com", phone: "(81) 99999-0102", visits: 3 },
      { id: "c3", name: "Camila Rocha", email: "camila@example.com", phone: "(81) 99999-0103", visits: 8 },
      { id: "c4", name: "Lucas Melo", email: "lucas@example.com", phone: "(81) 99999-0104", visits: 2 },
    ],
    services: [
      { id: "s1", name: "Corte + finalizacao", duration: 60, price: 85, active: true },
      { id: "s2", name: "Barba completa", duration: 35, price: 45, active: true },
      { id: "s3", name: "Coloracao", duration: 120, price: 180, active: true },
      { id: "s4", name: "Consultoria de imagem", duration: 45, price: 120, active: false },
    ],
  };
}

export const DEMO_STORAGE_KEY = "bookly-demo-v1";
