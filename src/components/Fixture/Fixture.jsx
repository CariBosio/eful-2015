import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { efulMatches } from "../../data/fixtures";
import "./Fixture.css";

export default function Fixture() {
  const [matches, setMatches] = useState(
    efulMatches.map((m) => ({
      ...m,
      goles_local: "",
      goles_rival: "",
      penales_local: "",
      penales_rival: "",
    })),
  );

  const [esAdmin, setEsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Contraseña de administrador
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    fetchResultados();
  }, []);

  const fetchResultados = async () => {
    const { data, error } = await supabase
      .from("resultados_partidos")
      .select("*");
    if (data) {
      setMatches((prev) =>
        prev.map((m) => {
          const resultadoGuardado = data.find((d) => d.id === m.id);
          return resultadoGuardado ? { ...m, ...resultadoGuardado } : m;
        }),
      );
    }
  };

  const handleInputChange = async (id, field, value) => {
    if (value !== "" && (isNaN(value) || parseInt(value) < 0)) return;

    setMatches(
      matches.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );

    const { error } = await supabase.from("resultados_partidos").upsert({
      id: id,
      [field]: value === "" ? null : parseInt(value),
    });

    if (error) console.error("Error al guardar:", error);
  };

  const handleAdminClick = () => {
    if (esAdmin) {
      setEsAdmin(false);
    } else {
      setPasswordInput("");
      setErrorPassword(false);
      setShowModal(true);
    }
  };

  // Función unificada para cerrar el modal limpiando todo
  const handleCloseModal = () => {
    setShowModal(false);
    setPasswordInput("");
    setErrorPassword(false);
  };

  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setEsAdmin(true);
      setShowModal(false);
      setErrorPassword(false);
    } else {
      setErrorPassword(true);
    }
  };

  const calculatePoints = (match) => {
    const { goles_local, goles_rival, penales_local, penales_rival, local } =
      match;

    if (
      goles_local === "" ||
      goles_rival === "" ||
      goles_local == null ||
      goles_rival == null
    )
      return { total: 0, detalle: "" };

    const gl = parseInt(goles_local);
    const gr = parseInt(goles_rival);

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

    if (
      penales_local !== "" &&
      penales_rival !== "" &&
      penales_local != null &&
      penales_rival != null
    ) {
      const pl = parseInt(penales_local);
      const pr = parseInt(penales_rival);
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
      <div className="fixture-header-row">
        <h2 className="section-title">Fixture EFUL - Partidos</h2>

        {/* Botón con candado dinámico */}
        <button
          className="btn-admin-trigger"
          onClick={handleAdminClick}
          title={esAdmin ? "Bloquear edición" : "Acceso Administrador"}
        >
          <i className={`fa-solid ${esAdmin ? "fa-lock-open" : "fa-lock"}`}></i>
        </button>
      </div>

      {/* Modal de Acceso Admin */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.className === "modal-overlay") {
              handleCloseModal();
            }
          }}
        >
          <div className="modal-content">
            <h3>🔐 Acceso de Administrador</h3>
            <p className="modal-info-text">
              ⚠️ Solo los administradores pueden cargar y modificar los
              resultados.
            </p>
            <p>Ingresá la contraseña para habilitar la carga:</p>
            <form onSubmit={handleVerifyPassword}>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  className="modal-input"
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              {errorPassword && (
                <span className="modal-error">Contraseña incorrecta</span>
              )}
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Panel Superior Resumen de Puntos */}
      <div className="fixture-summary-card">
        <div>
          <span className="summary-subtitle">Estado General</span>
          <strong className="summary-title">Total Acumulado EFUL</strong>
        </div>
        <div className="summary-badge">{totalPuntosGeneral} pts</div>
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
                      className="btn-gps"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.coords.trim())}`,
                          "_blank",
                        )
                      }
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
                      disabled={!esAdmin}
                      value={match.goles_local ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "goles_local",
                          e.target.value,
                        )
                      }
                      className={`match-input ${!esAdmin ? "read-only" : ""}`}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="Rival"
                      disabled={!esAdmin}
                      value={match.goles_rival ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "goles_rival",
                          e.target.value,
                        )
                      }
                      className={`match-input ${!esAdmin ? "read-only" : ""}`}
                    />
                  </div>

                  <div className="input-group-row">
                    <span className="input-label">Penales:</span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="EF P."
                      disabled={!esAdmin}
                      value={match.penales_local ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "penales_local",
                          e.target.value,
                        )
                      }
                      className={`match-input ${!esAdmin ? "read-only" : ""}`}
                    />
                    <span>-</span>
                    <input
                      type="text"
                      maxLength="2"
                      placeholder="Rival P."
                      disabled={!esAdmin}
                      value={match.penales_rival ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          match.id,
                          "penales_rival",
                          e.target.value,
                        )
                      }
                      className={`match-input ${!esAdmin ? "read-only" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {match.goles_local !== "" &&
                match.goles_rival !== "" &&
                match.goles_local != null &&
                match.goles_rival != null && (
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
