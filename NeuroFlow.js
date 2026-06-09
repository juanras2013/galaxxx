/**
 * NeuroFlow.js v1.0.0
 * Módulo inteligente de automatización, persistencia y telemetría de formularios.
 * Cero dependencias.
 */
(function (window, document) {
    'use strict';

    const NeuroFlow = {
        init: function () {
            this.storageKey = `neuroflow_backup_${window.location.pathname}`;
            this.scanAndEnhance();
        },

        scanAndEnhance: function () {
            const forms = document.querySelectorAll('form');
            if (forms.length === 0) return;

            forms.forEach(form => {
                this.restoreSession(form);
                this.bindEvents(form);
            });
        },

        bindEvents: function (form) {
            // 1. Auto-guardado predictivo al escribir
            form.addEventListener('input', WebUtils?.utils?.debounce?.((e) => {
                this.saveSession(form);
            }, 500) || ((e) => this.saveSession(form)));

            // 2. Validación en tiempo real avanzada
            form.querySelectorAll('input').forEach(input => {
                input.addEventListener('blur', (e) => this.validateField(e.target));
                
                // Telemetría de frustración: Detecta si borran el campo repetidamente
                let backspaceCount = 0;
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace') {
                        backspaceCount++;
                        if (backspaceCount > 7) {
                            input.style.border = "2px solid #ffcc00"; // Alerta visual sutil de soporte
                        }
                    } else {
                        backspaceCount = 0;
                    }
                });
            });

            // Limpiar datos al enviar con éxito
            form.addEventListener('submit', () => localStorage.removeItem(this.storageKey));
        },

        validateField: function (field) {
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                this.toggleStatus(field, emailRegex.test(field.value));
            }
            if (field.dataset.type === 'card' && field.value) {
                // Algoritmo Luhn básico para tarjetas de crédito
                let value = field.value.replace(/\D/g, '');
                let sum = 0;
                let shouldDouble = false;
                for (let i = value.length - 1; i >= 0; i--) {
                    let digit = parseInt(value.charAt(i));
                    if (shouldDouble) {
                        if ((digit *= 2) > 9) digit -= 9;
                    }
                    sum += digit;
                    shouldDouble = !shouldDouble;
                }
                this.toggleStatus(field, (sum % 10) === 0 && value.length >= 13);
            }
        },

        toggleStatus: function (field, isValid) {
            field.style.transition = "all 0.3s ease";
            field.style.borderColor = isValid ? "#2ecc71" : "#e74c3c";
            field.style.boxShadow = isValid ? "0 0 5px rgba(46,204,113,0.3)" : "0 0 5px rgba(231,76,60,0.3)";
        },

        saveSession: function (form) {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if (key.toLowerCase().includes('password') || key.toLowerCase().includes('card')) return; // Seguridad: No guarda claves ni tarjetas
                data[key] = value;
            });
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        },

        restoreSession: function (form) {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return;
            try {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) input.value = data[key];
                });
            } catch (e) {
                console.error("NeuroFlow: Error restaurando sesión.");
            }
        }
    };

    window.NeuroFlow = NeuroFlow;
    document.addEventListener('DOMContentLoaded', () => NeuroFlow.init());

})(window, document);
