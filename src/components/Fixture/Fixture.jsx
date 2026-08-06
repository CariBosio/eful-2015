import React, { useState } from "react";
import { efulMatches } from "../../data/fixtures";
import "./Fixture.css";

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

  const totalPuntosGeneral = matches.reduce((acc, match) => {
    return acc + calculatePoints(match).total;
  }, 0);

  return (
    <div className="fixture-container">
      <h2 className="section-title">Fixture EFUL - Zona de Partidos</h2>

      {/* Panel Superior Resumen de Puntos */}
      <div className="fixture-summary-card">
        <div>
          <span className="summary-subtitle">Estado General</span>
          <strong className="summary-title">Total Acumulado EFUL</strong>
        </div>
        <div className="summary-badge">
          {totalPuntosGeneral} pts
        </div>
      </div>

      <div className="matches-list">
        {matches.map((match) => {
          const score = calculatePoints(match);
          return (
            <div key={match.id} className="match-card">
              <div className="match-main-row">
                <div>
                  <span className="match-day">{match.dia}</span>
                  <strong className="match-teams">
                    {match.local} vs {match.rival}
                  </strong>
                  <div className="match-details-info">
                    🕒 <strong>{match.hora} hs</strong> | ⚽ Cancha:{" "}
                    <strong>{match.cancha}</strong>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.coords.trim())}`,
                          "_blank",
                        )
                      }
                      className="btn-gps"
                    >
                      <i className="fa-solid fa-location-arrow"></i> GPS
                    </button>
                  </div>
                </div>

                <div className="match-inputs-container">
                  <div className="input-group-row">
                    <span className="input-label">Goles:</span>
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

                  <div className="input-group-row">
                    <span className="input-label">Penales:</span>
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
                <div className="match-score-footer">
                  <span className="score-detail-text">{score.detalle}</span>
                  <span className="score-points-badge">
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