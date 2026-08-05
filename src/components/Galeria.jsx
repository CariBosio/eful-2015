import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Galeria.css';

export default function Galeria() {
  const [fotos, setFotos] = useState([]);
  const [autorInput, setAutorInput] = useState('');
  const [subiendo, setSubiendo] = useState(false);

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

  // Función para manejar la subida de fotos a Supabase Storage y Base de Datos
  const handleSubirFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);
    try {
      // 1. Subir la imagen al Bucket de Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('galeria-efuls')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública de la imagen
      const { data: publicURLData } = supabase.storage
        .from('galeria-efuls')
        .getPublicUrl(fileName);

      const urlPublica = publicURLData.publicUrl;

      // 3. Guardar el registro en la tabla 'fotos_mundialito'
      const nuevaFoto = {
        url: urlPublica,
        autor: autorInput.trim() || 'Familiar anónimo',
        fecha: new Date().toLocaleDateString()
      };

      const { error: dbError } = await supabase
        .from('fotos_mundialito')
        .insert([nuevaFoto]);

      if (dbError) throw dbError;

      // 4. Limpiar input y actualizar la grilla
      setAutorInput('');
      fetchFotos();
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
      alert('Hubo un error al subir la foto. Intentalo de nuevo.');
    } finally {
      setSubiendo(false);
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
          {subiendo ? 'Subiendo...' : '➕ Subir Foto'}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleSubirFoto} 
            style={{ display: 'none' }} 
            disabled={subiendo}
          />
        </label>
      </div>

      {/* Grilla de Fotos */}
      <div className="fotos-grid">
        {fotos.map((foto) => (
          <div key={foto.id} className="foto-card">
            <img src={foto.url} alt="Recuerdo del mundialito" />
            <div className="foto-info">
              <span className="foto-autor">👤 {foto.autor}</span>
              <span className="foto-fecha">📅 {foto.fecha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}