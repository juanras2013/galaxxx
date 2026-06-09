/**
 * MemoryLeakSentry.js v1.0.0
 * Monitor e interceptor básico de intervalos y eventos colgados.
 * Cero dependencias.
 */
(function (window, document) {
    'use strict';

    const MemoryLeakSentry = {
        init: function () {
            this.activeIntervals = [];
            this.interceptTimers();
            this.startGarbageCollectionRoutine();
        },

        interceptTimers: function () {
            const originalSetInterval = window.setInterval;
            // Reescribe la función nativa para llevar registro del software activo
            window.setInterval = (handler, delay, ...args) => {
                const id = originalSetInterval(handler, delay, ...args);
                this.activeIntervals.push({ id, created: Date.now() });
                return id;
            };
        },

        startGarbageCollectionRoutine: function () {
            // Analiza el sistema cada 60 segundos buscando procesos zombies
            originalSetInterval(() => {
                const now = Date.now();
                this.activeIntervals = this.activeIntervals.filter(timer => {
                    // Si un intervalo lleva más de 10 minutos corriendo, lo evalúa como sospechoso
                    if (now - timer.created > 600000) {
                        console.warn(`🧠 [MemoryLeakSentry] Limpiando intervalo sospechoso de fuga (ID: ${timer.id})`);
                        clearInterval(timer.id);
                        return false;
                    }
                    return true;
                });
            }, 60000);
        }
    };

    window.MemoryLeakSentry = MemoryLeakSentry;
    MemoryLeakSentry.init();

})(window, document);
