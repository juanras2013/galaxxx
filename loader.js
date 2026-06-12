/**
 * 🌌 Galaxxx Local Share Link Simulator (LocalStorage Edition)
 * Genera y gestiona URLs "únicas" simuladas de forma 100% local.
 */
const GalaxxxLoader = {
    
    // 1. Genera un identificador único (UUID v4 básico)
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // 2. Guarda el estado actual de tu aplicación y genera la URL única simulada
    saveAndCreateLink(dataToSave) {
        const uniqueId = this.generateUUID();
        
        // Estructura interna para almacenar los datos junto con la fecha
        const sessionData = {
            id: uniqueId,
            timestamp: new Date().toISOString(),
            content: dataToSave
        };

        // Guardamos en el LocalStorage del navegador
        localStorage.setItem(`galaxxx_session_${uniqueId}`, JSON.stringify(sessionData));

        // Construimos la URL agregando el parámetro ?id=... a la URL actual
        const currentUrl = window.location.origin + window.location.pathname;
        const fakeShareLink = `${currentUrl}?id=${uniqueId}`;

        console.log(`🔗 Enlace único generado: ${fakeShareLink}`);
        return { id: uniqueId, url: fakeShareLink };
    },

    // 3. Revisa la URL actual para ver si el usuario está intentando "abrir" un enlace único
    checkActiveSession() {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('id');

        if (!sessionId) {
            console.log("ℹ️ Navegando en la página principal (Sin sesión activa).");
            return null;
        }

        // Si hay un ID en la URL, intentamos buscarlo en LocalStorage
        const localData = localStorage.getItem(`galaxxx_session_${sessionId}`);

        if (localData) {
            console.log(`🚀 ¡Sesión única detectada y cargada con éxito! ID: ${sessionId}`);
            return JSON.parse(localData);
        } else {
            console.warn(`⚠️ Se intentó abrir el enlace ${sessionId}, pero no existen datos guardados en este navegador.`);
            return { error: "No se encontraron datos locales para este enlace." };
        }
    }
};

// --- EJEMPLO DE USO PRÁCTICO ---
// Al cargar la página, verificamos de inmediato si venimos de un enlace único:
document.addEventListener("DOMContentLoaded", () => {
    const session = GalaxxxLoader.checkActiveSession();

    if (session && !session.error) {
        // AQUÍ EL USUARIO ABRIÓ UN LINK ÚNICO
        alert(`Abriendo enlace único.\nCreado el: ${session.timestamp}\n\nDatos guardados:\n${JSON.stringify(session.content)}`);
        
        // Aquí puedes inyectar los datos en tu HTML para mostrar lo que el usuario "hizo"
        if(session.content.textGuardado) {
            document.querySelector("input").value = session.content.textGuardado;
        }
    }
});
