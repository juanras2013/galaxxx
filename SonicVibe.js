/**
 * SonicVibe.js v1.1.0
 * Plugin de micro-interacciones sonoras sintetizadas por software en tiempo real.
 * Cero dependencias y cero archivos de audio externos.
 */
(function (window, document) {
    'use strict';

    const SonicVibe = {
        init: function () {
            this.audioCtx = null;
            this.setupTriggers();
        },

        initContext: function () {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        },

        /**
         * Genera una onda de sonido pura basada en frecuencia, duración, tipo y volumen.
         */
        playTone: function (frequency, type, duration, volume = 0.05) {
            this.initContext();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
            osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

            // Control de volumen con rampa exponencial para evitar chasquidos
            gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        },

        setupTriggers: function () {
            // 1. Sonido único para CUALQUIER clic dentro de la página
            document.addEventListener('click', () => {
                // Frecuencia fija y limpia de 500Hz para simular un tap de interfaz
                this.playTone(500, 'sine', 0.04, 0.06); 
            });

            // 2. Sonido dinámico para cada letra escrita en el teclado
            document.addEventListener('keydown', (e) => {
                // Evitamos activar sonido con teclas repetitivas del sistema (Shift, Ctrl, Alt, etc.)
                if (e.repeat || e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter') return;

                if (e.key === 'Enter') {
                    // Sonido especial más grave para el salto de línea o envío
                    this.playTone(300, 'triangle', 0.1, 0.08);
                } else if (e.key === 'Backspace') {
                    // Sonido descendente o de borrado
                    this.playTone(220, 'sine', 0.06, 0.07);
                } else {
                    // Genera una micro-variación aleatoria entre 600Hz y 750Hz para simular dinamismo físico
                    const frecuenciaAleatoria = Math.floor(Math.random() * (750 - 600 + 1)) + 600;
                    
                    // Usamos una onda 'triangle' muy corta que emula madera o plástico mecánico
                    this.playTone(frecuenciaAleatoria, 'triangle', 0.03, 0.04);
                }
            });

            // 3. Acorde especial asíncrono al enviar formularios
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', () => {
                    this.playTone(523.25, 'sine', 0.1, 0.08); // Nota Do
                    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.08), 80); // Nota Mi
                    setTimeout(() => this.playTone(783.99, 'sine', 0.2, 0.08), 160); // Nota Sol
                });
            });
        }
    };

    window.SonicVibe = SonicVibe;
    document.addEventListener('DOMContentLoaded', () => SonicVibe.init());

})(window, document);
