# 🌌 Galaxxx Core Suite v1.5.0

Librería de software modular compuesta por plugins independientes y encapsulados. Diseñada para potenciar interfaces web mediante utilidades avanzadas de seguridad, rendimiento, efectos visuales y telemetría nativa sin dependencias externas.

---

## ⚡ Guía de Integración Rápida

Cargar los módulos en cualquier proyecto web es tan fácil como copiar este bloque de código y meterlo dentro de tus etiquetas `<script>` en el `<head>` de tu archivo HTML:

```html
<script>
    /**
     * 🌐 Galaxxx Core - Cargador de Infraestructura Asíncrona NAtiva
     * Descarga e inyecta módulos de software de forma centralizada.
     */
    async function loadPlugin(fileName) {
        const url = `https://githubusercontent.com{fileName}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const code = await response.text();
            
            const script = document.createElement('script');
            script.text = code;
            document.head.appendChild(script);
            console.log(`🚀 [Loader] Módulo inyectado con éxito: ${fileName}`);
        } catch (err) {
            console.error(`❌ [Loader] Error crítico cargando ${fileName}:`, err);
        }
    }

    // 🎛️ INYECCIÓN MODULAR PARALELA (100% Personalizable)
    // Comenta o desconecta las líneas según las necesidades de tu web:
    loadPlugin("DevicePulse.js");      // Inteligencia de Hardware y Red
    loadPlugin("GhostShield.js");      // Seguridad Anti-Scraping y Protección F12
    loadPlugin("NeuroFlow.js");        // Formulario Predictivo y UX Inteligente
    loadPlugin("QuantumNebula.js");    // Efectos Cinematográficos de Partículas
    loadPlugin("SonicVibe.js");        // Sintetizador de Audio (Sonidos al escribir)
    loadPlugin("GravityDOM.js");       // Motor Físico de Gravedad e Interacción
    loadPlugin("FocusDrift.js");       // Detector de Distracción de Pestañas
    loadPlugin("LazyDOM.js");          // Optimizador Extremo de Memoria RAM
    loadPlugin("MemoryLeakSentry.js"); // Cazador de Fugas y Procesos Zombie
    loadPlugin("ChronoShift.js");      // Historial Deshacer/Rehacer Temporal
    loadPlugin("ChameleonTheme.js");   // Extractor de Colores Adaptables
    loadPlugin("MatrixBg.js");         // Entorno Hacker Digital Adaptable
</script>
```

---

## 🛠️ Catálogo de Plugins Disponibles

| Nombre del Plugin | Tipo | Descripción de Software |
| :--- | :--- | :--- |
| **`DevicePulse.js`** | Rendimiento | Analiza hardware y red en vivo para mitigar carga visual en terminales antiguos. |
| **`GhostShield.js`** | Seguridad | Bloquea clics, copias indebidas e inhabilita el análisis técnico mediante congelamiento por consola. |
| **`NeuroFlow.js`** | Experiencia | Autoguardado asíncrono y detección de frustración del usuario en entradas de datos. |
| **`QuantumNebula.js`** | Diseño | Inyecta partículas cinemáticas interactivas en segundo plano acopladas a la GPU. |
| **`SonicVibe.js`** | Audio | Genera ondas y frecuencias sonoras únicas para pulsaciones de teclado sin descargar archivos. |
| **`GravityDOM.js`** | Físicas | Somete elementos a leyes físicas de aceleración, rebote y arrastre sin fugas de pantalla. |
| **`FocusDrift.js`** | Telemetría | Administra el estado de la aplicación reduciendo el consumo cuando el usuario cambia de pestaña. |
| **`LazyDOM.js`** | Optimización | Descarga y reconstruye bloques HTML del DOM en base al scroll activo para vaciar la RAM. |
| **`MemoryLeakSentry.js`** | Diagnóstico | Identifica fugas de memoria y destruye contadores colgados de forma automatizada. |
| **`ChronoShift.js`** | Sistema | Motor nativo que permite deshacer (`Ctrl+Z`) y rehacer (`Ctrl+Y`) alteraciones globales. |
| **`ChameleonTheme.js`** | Estilos | Procesa imágenes mediante Canvas ocultos para mimetizar la paleta de colores del entorno. |
| **`MatrixBg.js`** | Efecto | Transforma el entorno en una interfaz de código en cascada con escalado elástico inmediato. |

---

## 💎 Características de la Suite
- **Zero Dependencies:** Todo el ecosistema está programado en Vanilla JavaScript puro de alto rendimiento.
- **Asynchronous Execution:** Las cargas de red se resuelven en hilos paralelos independientes para evitar bloqueos visuales en el cliente.
- **Strict Isolation:** Módulos autoejecutables encapsulados que impiden la colisión de variables globales de entorno.

Desarrollado y mantenido por [@juanras2013](https://github.com).
