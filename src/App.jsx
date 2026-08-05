import React, { useState, useEffect } from "react";
import Fixture from "./components/Fixture";
import Plantel from "./components/Plantel";
import "./index.css";
import { gsap } from "gsap";
import LogoSplash from "./components/LogoSplash";

export default function App() {
  const [tab, setTab] = useState("fixture");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Bloquear scroll al cargar
    document.body.classList.add("splash-active");

    // 1. Ocultar e iniciar valores de cada parte del SVG para la entrada
    gsap.set(".eful-logo-anim", { opacity: 1, scale: 1 });
    gsap.set(".app-container", { opacity: 0, visibility: "hidden" });

    gsap.set("#bg-circle", {
      scale: 0,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set("#yellow-circle", {
      scale: 0,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set("#mask-stripes", { x: -300, y: -300, opacity: 0 });
    gsap.set("#outer-circle", {
      scale: 0,
      opacity: 0,
      rotation: -180,
      transformOrigin: "center center",
    });
    gsap.set("#inner-circle", {
      scale: 0,
      opacity: 0,
      rotation: 180,
      transformOrigin: "center center",
    });
    gsap.set("#text-school", {
      y: -80,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set("#text-eful", { x: -150, opacity: 0 });
    gsap.set("#text-1986", { x: 150, opacity: 0 });
    gsap.set("#ball", {
      scale: 0,
      opacity: 0,
      transformOrigin: "center center",
    });
    gsap.set("#player-group", {
      y: -200,
      scale: 0.6,
      opacity: 0,
      rotation: 0,
      transformOrigin: "60% 45%",
    });
    gsap.set("#player-shin", { rotation: 0, transformOrigin: "1467px 1318px" });

    // 2. Línea de tiempo principal de la animación
    const tl = gsap.timeline({
      onComplete: () => {
        setShowSplash(false);
        document.body.classList.remove("splash-active"); // Restaura el scroll
      },
    });

    // 3. Secuencia Coreográfica AWARDS:
    tl
      // A. Círculo de fondo amarillo entra suave pero firme
      .to("#bg-circle", {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
      })
      // B. Los círculos de borde negro entran rotando en direcciones opuestas (efecto hipnótico)
      .to(
        "#outer-circle",
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.6,
          ease: "elastic.out(1, 0.75)",
        },
        "-=0.8",
      )
      .to(
        "#inner-circle",
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.6,
          ease: "elastic.out(1, 0.75)",
        },
        "-=1.4",
      )
      // C. El círculo naranja interior y las rayas entran en diagonal
      .to(
        "#yellow-circle",
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=1.0",
      )
      .to(
        "#mask-stripes",
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
        },
        "-=0.9",
      )
      // D. La tipografía de la Escuela cae desde arriba con un rebote elástico
      .to(
        "#text-school",
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.8)",
        },
        "-=0.8",
      )
      // E. EFUL y 1986 entran desde los laterales cruzándose de forma elegante
      .to(
        "#text-eful",
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.8",
      )
      .to(
        "#text-1986",
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=1.0",
      )
      // F. La pelota de fútbol hace un pop elástico muy enérgico
      .to(
        "#ball",
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "elastic.out(1.2, 0.6)",
        },
        "-=0.6",
      )
      // G. El jugador cae con gravedad y rebota al tocar la pelota
      .to(
        "#player-group",
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "bounce.out",
        },
        "-=0.9",
      )

      // === ANIMACIÓN DE LA PATADA Y ZOOM DE LA PELOTA HACIA LA PANTALLA ===

      // H. El jugador se echa hacia atrás preparándose para el tiro (pivote en la cadera "60% 45%")
      // La pierna doblada (#player-shin) se dobla un poco más hacia atrás
      .to(
        "#player-group",
        {
          rotation: 12,
          x: 20,
          y: -10,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "+=0.3",
      )
   
      // I. El jugador golpea el balón moviéndose hacia adelante con inercia
          .to("#player-group", {
        rotation: -18,
        x: -35,
        y: 15,
        duration: 0.15,
        ease: "power1.in",
      })

      // J. La pelota vuela hacia la pantalla (zoom gigante y fadeout)
      .to(
        "#ball",
        {
          scale: 100,
          opacity: 0,
          duration: 1.4,
          ease: "power2.in",
          transformOrigin: "center center",
        },
        "-=0.05",
      )

      // K. El resto de las partes del logo se desvanecen suavemente
      .to(
        [
          "#bg-circle",
          "#yellow-circle",
          "#mask-stripes",
          "#outer-circle",
          "#inner-circle",
          "#text-school",
          "#text-eful",
          "#text-1986",
          "#player-group",
        ],
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=1.3",
      )

      // L. El fondo negro del splash screen se desvanece a transparente
      .to(
        "#splash-screen",
        {
          backgroundColor: "rgba(18, 18, 18, 0)",
          duration: 1.4,
          ease: "power2.inOut",
        },
        "-=1.4",
      )

      // M. Aparece progresivamente la interfaz de la aplicación de fondo (Fixture, etc.)
      .to(
        ".app-container",
        {
          opacity: 1,
          visibility: "visible",
          duration: 1.4,
          ease: "power2.out",
        },
        "-=1.4",
      );
  }, []);

  // useEffect(() => {
  //   // Bloquear scroll mientras revisamos el logo
  //   document.body.classList.add('splash-active');

  //   // Mantenemos el logo visible, centrado y a tamaño completo sin animarlo
  //   gsap.set(".eful-logo-anim", { scale: 1, opacity: 1 });
  //   gsap.set(".app-container", { opacity: 0, visibility: "hidden" });

  //   // Si querés que pase directamente a la app después de unos segundos de revisión,
  //   // podés descomentar la línea de abajo o dejarlo abierto de forma fija:

  //   /*
  //   const timer = setTimeout(() => {
  //     setShowSplash(false);
  //     document.body.classList.remove('splash-active');
  //     gsap.to(".app-container", { opacity: 1, visibility: "visible", duration: 0.5 });
  //   }, 5000); // Se queda 5 segundos y entra a la app

  //   return () => clearTimeout(timer);
  //   */
  // }, []);

  return (
    <div>
      {/* Splash Screen Condicional: Aparece sí o sí en cada recarga */}
      {showSplash && (
        <div id="splash-screen" className="splash-container">
          <LogoSplash />
        </div>
      )}

      {/* Contenedor Principal de la App */}
      <div
        className="app-container"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <header className="header">
          <h1>EFUL Categoría 2015</h1>
          <p>Mundialito de Invierno 2026 - El Norte</p>
        </header>

        <nav className="nav">
          <button
            onClick={() => setTab("fixture")}
            className={`nav-btn ${tab === "fixture" ? "active" : ""}`}
          >
            📅 Fixture & Resultados
          </button>
          <button
            onClick={() => setTab("plantel")}
            className={`nav-btn ${tab === "plantel" ? "active" : ""}`}
          >
            ⭐ Plantel Oficial
          </button>
        </nav>

        <main className="main-content">
          {tab === "fixture" ? <Fixture /> : <Plantel />}
        </main>
      </div>
    </div>
  );
}
