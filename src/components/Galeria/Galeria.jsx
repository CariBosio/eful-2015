import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./Galeria.css";

export default function Galeria() {
  const [multimedia, setMultimedia] = useState([]);
  const [autorInput, setAutorInput] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  useEffect(() => {
    fetchMultimedia();
  }, []);

  const fetchMultimedia = async () => {
    const { data, error } = await supabase
      .from("fotos_mundialito")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error al cargar galería:", error);
    } else {
      setMultimedia(data || []);
    }
  };

  const handleSubirArchivos = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendo(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${i}_${file.name}`;

        const esVideo = file.type.startsWith("video/");
        const tipoArchivo = esVideo ? "video" : "imagen";

        const { error: uploadError } = await supabase.storage
          .from("galeria-efuls")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from("galeria-efuls")
          .getPublicUrl(fileName);

        const urlPublica = publicURLData.publicUrl;

        const nuevoItem = {
          url: urlPublica,
          tipo: tipoArchivo,
          autor: autorInput.trim() || "Anónimo",
          fecha: new Date().toLocaleDateString(),
        };

        const { error: dbError } = await supabase
          .from("fotos_mundialito")
          .insert([nuevoItem]);

        if (dbError) throw dbError;
      }

      setAutorInput("");
      fetchMultimedia();
    } catch (error) {
      console.error("Error en el proceso de subida:", error);
      alert("Hubo un error al subir algún archivo. Intentalo de nuevo.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  return (
    <div className="galeria-container">
      <div className="galeria-header">
        <h2>
          <i className="fa-solid fa-camera"></i> Galería - EFUL
        </h2>
        <p>¡Subí tus fotos y videos de la cancha!</p>
      </div>

      {/* Panel de Carga */}
      <div className="upload-card">
        <input
          type="text"
          placeholder="Tu nombre / Quién saca..."
          value={autorInput}
          onChange={(e) => setAutorInput(e.target.value)}
          className="input-autor"
          disabled={subiendo}
        />
        <label className={`btn-upload ${subiendo ? "disabled" : ""}`}>
          <i className="fa-solid fa-images"></i>
          {subiendo ? " Subiendo archivos..." : " Subir Fotos / Videos"}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleSubirArchivos}
            style={{ display: "none" }}
            disabled={subiendo}
          />
        </label>
      </div>

      {/* Grilla de Multimedia */}
      <div className="fotos-grid">
        {multimedia.map((item) => (
          <div
            key={item.id}
            className="foto-card"
            onClick={() => setItemSeleccionado(item)}
          >
            <div className="media-thumbnail-wrapper">
              {item.tipo === "video" ? (
                <>
                  <video
                    src={item.url}
                    className="grid-media-item"
                    preload="metadata"
                    muted
                  />
                  <div className="video-play-badge">▶</div>
                </>
              ) : (
                <img
                  src={item.url}
                  alt="Recuerdo EFUL"
                  className="grid-media-item"
                  loading="lazy"
                />
              )}
            </div>

            <div className="foto-info">
              <span className="foto-autor">
                <i className="fa-solid fa-user"></i> {item.autor}
              </span>
              <span className="foto-fecha">
                <i className="fa-solid fa-calendar-days"></i> {item.fecha}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Vista Ampliada (Lightbox) */}
      {itemSeleccionado && (
        <div
          className="modal-overlay"
          onClick={() => setItemSeleccionado(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setItemSeleccionado(null)}
            >
              ×
            </button>

            {itemSeleccionado.tipo === "video" ? (
              <video
                src={itemSeleccionado.url}
                controls
                autoPlay
                className="modal-media-element"
              />
            ) : (
              <img
                src={itemSeleccionado.url}
                alt="Ampliada"
                className="modal-media-element"
              />
            )}

            <div className="modal-info">
              <span>
                <i className="fa-solid fa-user"></i> {itemSeleccionado.autor}
              </span>
              <span>
                <i className="fa-solid fa-calendar"></i>{" "}
                {itemSeleccionado.fecha}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
