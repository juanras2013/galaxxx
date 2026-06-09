/**
 * ChronoShift.js v1.0.0
 * Motor global de historial deshacer/rehacer (Undo/Redo) para formularios del DOM.
 * Cero dependencias.
 */
(function (window, document) {
    'use strict';

    const ChronoShift = {
        init: function () {
            this.history = [];
            this.pointer = -1;
            this.listenInputs();
            this.listenShortcuts();
        },

        captureState: function () {
            const state = [];
            document.querySelectorAll('input:not([type="password"]), textarea, select').forEach(el => {
                state.push({ el, value: el.value });
            });

            // Si el nuevo estado es diferente al último, lo guarda
            if (this.pointer === -1 || JSON.stringify(this.history[this.pointer]) !== JSON.stringify(state)) {
                this.history = this.history.slice(0, this.pointer + 1);
                this.history.push(state);
                this.pointer++;
            }
        },

        listenInputs: function () {
            document.addEventListener('change', () => this.captureState());
            // Captura inicial diferida
            setTimeout(() => this.captureState(), 500);
        },

        listenShortcuts: function () {
            window.addEventListener('keydown', (e) => {
                const meta = e.ctrlKey || e.metaKey;
                if (meta && e.key.toLowerCase() === 'z') {
                    e.preventDefault();
                    this.shiftTime(-1);
                }
                if (meta && e.key.toLowerCase() === 'y') {
                    e.preventDefault();
                    this.shiftTime(1);
                }
            });
        },

        shiftTime: function (direction) {
            const nextPointer = this.pointer + direction;
            if (nextPointer >= 0 && nextPointer < this.history.length) {
                this.pointer = nextPointer;
                const state = this.history[this.pointer];
                state.forEach(item => {
                    item.el.value = item.value;
                    item.el.dispatchEvent(new Event('input', { bubbles: true }));
                });
                console.log(`🔮 [ChronoShift] Viaje temporal. Paso: ${this.pointer + 1}/${this.history.length}`);
            }
        }
    };

    window.ChronoShift = ChronoShift;
    document.addEventListener('DOMContentLoaded', () => ChronoShift.init());

})(window, document);
