/**
 * LazyDOM.js v1.0.0
 * Destruye y restaura elementos del DOM basados en el scroll para ahorrar memoria RAM.
 * Cero dependencias.
 */
(function (window, document) {
    'use strict';

    const LazyDOM = {
        init: function () {
            if (!window.IntersectionObserver) return;
            this.vault = new Map(); // Guarda el HTML en memoria
            this.observeElements();
        },

        observeElements: function () {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const el = entry.target;
                    
                    if (!el.id) {
                        el.id = 'lazydom-' + Math.random().toString(36).substr(2, 9);
                    }

                    if (entry.isIntersecting) {
                        // Si es visible y estaba guardado, restaura su HTML interno
                        if (this.vault.has(el.id)) {
                            el.innerHTML = this.vault.get(el.id);
                            el.style.height = ''; // Libera la altura forzada
                        }
                    } else {
                        // Si sale de pantalla, guarda su tamaño y destruye su interior
                        if (el.innerHTML.trim() !== "") {
                            const rect = el.getBoundingClientRect();
                            el.style.height = `${rect.height}px`; // Evita saltos de scroll
                            this.vault.set(el.id, el.innerHTML);
                            el.innerHTML = ''; 
                        }
                    }
                });
            }, { rootMargin: '200px 0px' }); // Margen de carga anticipada

            // Escanea todos los bloques pesados con la clase .lazy-block
            document.querySelectorAll('.lazy-block').forEach(block => observer.observe(block));
        }
    };

    window.LazyDOM = LazyDOM;
    document.addEventListener('DOMContentLoaded', () => LazyDOM.init());

})(window, document);
