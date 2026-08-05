import React, { useState } from "react";
import { efulMatches } from "../data/fixtures";

export default function Fixture() {
  const [matches, setMatches] = useState(
    efulMatches.map((m) => ({
      ...m,
      golesLocal: "",
      golesRival: "",
      penalesLocal: "",
      penalesRival: "",
    })),
  );

  const handleInputChange = (id, field, value) => {
    if (value !== "" && (isNaN(value) || parseInt(value) < 0)) return;
    setMatches(
      matches.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const calculatePoints = (match) => {
    const { golesLocal, golesRival, penalesLocal, penalesRival, local } = match;

    if (golesLocal === "" || golesRival === "")
      return { total: 0, detalle: "" };

    const gl = parseInt(golesLocal);
    const gr = parseInt(golesRival);

    const esEfulLocal = local.toUpperCase() === "EFUL";
    const efulGoles = esEfulLocal ? gl : gr;
    const rivalGoles = esEfulLocal ? gr : gl;

    let puntosPartido = 0;
    let descPartido = "";

    if (efulGoles > rivalGoles) {
      puntosPartido = 3;
      descPartido = "Partido: Ganado (3 pts)";
    } else if (efulGoles < rivalGoles) {
      puntosPartido = 1;
      descPartido = "Partido: Perdido (1 pt)";
    } else {
      puntosPartido = 2;
      descPartido = "Partido: Empatado (2 pts)";
    }

    let puntosPenales = 0;
    let descPenales = "";

    if (penalesLocal !== "" && penalesRival !== "") {
      const pl = parseInt(penalesLocal);
      const pr = parseInt(penalesRival);
      const efulPen = esEfulLocal ? pl : pr;
      const rivalPen = esEfulLocal ? pr : pl;

      if (efulPen > rivalPen) {
        puntosPenales = 1;
        descPenales = " | Penales: Ganados (1 pt)";
      } else if (efulPen < rivalPen) {
        puntosPenales = 0;
        descPenales = " | Penales: Perdidos (0 pts)";
      } else {
        puntosPenales = 1;
        descPenales = " | Penales: Empatados (1 pt)";
      }
    }

    return {
      total: puntosPartido + puntosPenales,
      detalle: descPartido + descPenales,
    };
  };

  // Sumatoria total de puntos de todos los partidos cargados
  const totalPuntosGeneral = matches.reduce((acc, match) => {
    return acc + calculatePoints(match).total;
  }, 0);

  return (
    <div>
      <h2 className="section-title">Fixture EFUL - Zona de Partidos</h2>

      {/* Panel Superior Resumen de Puntos */}
      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "2px solid var(--color-primary)",
          borderRadius: "10px",
          padding: "12px 20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(255, 204, 0, 0.1)",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Estado General
          </span>
          <strong style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>
            Total Acumulado EFUL
          </strong>
        </div>
        <div
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--bg-primary)",
            padding: "6px 16px",
            borderRadius: "8px",
            fontWeight: "900",
            fontSize: "1.25rem",
          }}
        >
          {totalPuntosGeneral} pts
        </div>
      </div>

      <div>
        {matches.map((match) => {
          const score = calculatePoints(match);
          return (
            <div
              key={match.id}
              className="match-card"
              style={{ display: "block" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {match.dia}
                  </span>
                  <strong style={{ fontSize: "1.05rem" }}>
                    {match.local} vs {match.rival}
                  </strong>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginTop: "0.3rem",
                      flexWrap: "wrap",
                    }}
                  >
                    🕒 <strong>{match.hora} hs</strong> | ⚽ Cancha:{" "}
                    <strong>{match.cancha}</strong>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.coords.trim())}`,
                          "_blank",
                        )
                      }
                      style={{
                        backgroundColor: "rgba(255, 204, 0, 0.1)",
                        color: "var(--color-primary)",
                        border: "1px solid var(--color-primary)",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i className="fa-solid fa-location-arrow"></i> GPS
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Goles:
                    </span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="EF"
                      value={match.golesLocal}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "golesLocal",
                          e.target.value,
                        )
                      }
                      className="match-input"
                    />
                    <span>-</span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="Rival"
                      value={match.golesRival}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "golesRival",
                          e.target.value,
                        )
                      }
                      className="match-input"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Penales:
                    </span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="EF P."
                      value={match.penalesLocal}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "penalesLocal",
                          e.target.value,
                        )
                      }
                      className="match-input"
                    />
                    <span>-</span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="Rival P."
                      value={match.penalesRival}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "penalesRival",
                          e.target.value,
                        )
                      }
                      className="match-input"
                    />
                  </div>
                </div>
              </div>

              {match.golesLocal !== "" && match.golesRival !== "" && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--border-color)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    {score.detalle}
                  </span>
                  <span
                    style={{
                      fontWeight: "800",
                      color: "var(--color-primary)",
                      backgroundColor: "var(--bg-primary)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    Puntaje: +{score.total} pts
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
