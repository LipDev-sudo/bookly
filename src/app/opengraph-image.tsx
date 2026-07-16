import { ImageResponse } from "next/og";
import { SITE_SLOGAN } from "@/lib/site";

export const alt = "Horavia — agenda e gestão de atendimentos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fffdf8",
          color: "#102c2a",
          padding: "76px 84px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 78,
              height: 78,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              background: "#175f59",
              color: "#fffdf8",
              fontSize: 48,
              fontWeight: 800,
            }}
          >
            H
          </div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 800 }}>
            Horavia
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {SITE_SLOGAN}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#526c69" }}>
            Agenda, clientes e serviços em um fluxo claro.
          </div>
        </div>
        <div
          style={{
            width: 160,
            height: 10,
            display: "flex",
            borderRadius: 999,
            background: "#f26b3e",
          }}
        />
      </div>
    ),
    size,
  );
}
