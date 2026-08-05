import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Galeria.css';

export default function Galeria() {
  const [fotos, setFotos] = useState([]);
  const [autorInput, setAutorInput] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null); // Estado para la foto en grande

  // Cargar fotos desde Supabase al iniciar el componente
  useEffect(() => {
    fetchFotos();
  }, []);

  const fetchFotos = async () => {
    const { data, error } = await supabase
      .from('fotos_mundialito')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al cargar fotos:', error);
    } else {
      setFotos(data || []);
    }
  };

  // Función para manejar la subida múltiple de fotos
  const handleSubirFotos = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendo(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${i}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('galeria-efuls')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('galeria-efuls')
          .getPublicUrl(fileName);

        const urlPublica = publicURLData.publicUrl;

        const nuevaFoto = {
          url: urlPublica,
          autor: autorInput.trim() || 'Anónimo',
          fecha: new Date().toLocaleDateString()
        };

        const { error: dbError } = await supabase
          .from('fotos_mundialito')
          .insert([nuevaFoto]);

        if (dbError) throw dbError;
      }

      setAutorInput('');
      fetchFotos();
    } catch (error) {
      console.error('Error en el proceso de subida múltiple:', error);
      alert('Hubo un error al subir alguna de las fotos. Intentalo de nuevo.');
    } finally {
      setSubiendo(false);
      e.target.value = '';
    }
  };

  return (
    <div className="galeria-container">
      <div className="galeria-header">
        <h2>📸 Galería del Mundialito - EFUL 2015</h2>
        <p>¡Subí tus fotos de la cancha para que todos las puedan ver!</p>
      </div>

      {/* Panel de Carga */}
      <div className="upload-card">
        <input 
          type="text" 
          placeholder="Tu nombre / Quién saca la foto..." 
          value={autorInput}
          onChange={(e) => setAutorInput(e.target.value)}
          className="input-autor"
          disabled={subiendo}
        />
        <label className={`btn-upload ${subiendo ? 'disabled' : ''}`}>
          {subiendo ? 'Subiendo fotos...' : '➕ Subir Fotos'}
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleSubirFotos} 
            style={{ display: 'none' }} 
            disabled={subiendo}
          />
        </label>
      </div>

      {/* Grilla de Fotos */}
      <div className="fotos-grid">
        {fotos.map((foto) => (
          <div 
            key={foto.id} 
            className="foto-card"
            onClick={() => setFotoSeleccionada(foto)} // Al hacer click se abre en grande
          >
            <img src={foto.url} alt="Recuerdo del mundialito" />
            <div className="foto-info">
              <span className="foto-autor">👤 {foto.autor}</span>
              <span className="foto-fecha">📅 {foto.fecha}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Vista Ampliada (Lightbox) */}
      {fotoSeleccionada && (
        <div className="modal-overlay" onClick={() => setFotoSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setFotoSeleccionada(null)}>×</button>
            <img src={fotoSeleccionada.url} alt="Ampliada" />
            <div className="modal-info">
              <span>👤 {fotoSeleccionada.autor}</span>
              <span>📅 {fotoSeleccionada.fecha}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}