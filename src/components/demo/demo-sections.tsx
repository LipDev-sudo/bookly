import type { DemoAppointment, DemoState } from "@/lib/demo-data";
import { AppointmentRow, EmptyState, currency } from "./demo-ui";

export function DemoAppointments({
  items,
  onReset,
}: {
  items: DemoAppointment[];
  onReset: () => void;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Agenda</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Horários fictícios agendados, concluídos e cancelados.
      </p>
      {items.length ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <AppointmentRow key={item.id} item={item} detailed />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="Agenda vazia"
          description="Restaure os dados fictícios para visualizar os horários de exemplo."
          onReset={onReset}
        />
      )}
    </section>
  );
}

export function DemoClients({
  data,
  onReset,
}: {
  data: DemoState;
  onReset: () => void;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
        Clientes
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Contatos fictícios usados exclusivamente nesta demonstração.
      </p>
      {data.clients.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.clients.map((client) => (
            <article
              key={client.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                {client.name.charAt(0)}
              </div>
              <h3 className="mt-4 font-bold">{client.name}</h3>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {client.email}
              </p>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
              <p className="mt-4 border-t border-border pt-3 text-xs font-semibold text-muted-foreground">
                {client.visits} visitas registradas
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum cliente"
          description="Restaure os registros para visualizar o cadastro de clientes."
          onReset={onReset}
        />
      )}
    </section>
  );
}

export function DemoServices({
  data,
  onReset,
}: {
  data: DemoState;
  onReset: () => void;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
        Serviços
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Catálogo coerente do Estúdio Aurora, com duração e preço fictícios.
      </p>
      {data.services.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold">{service.name}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    service.active
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {service.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="mt-8 flex items-end justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  {service.duration} min
                </span>
                <span className="text-xl font-bold">
                  {currency.format(service.price)}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum serviço"
          description="Restaure a demonstração para visualizar o catálogo fictício."
          onReset={onReset}
        />
      )}
    </section>
  );
}
