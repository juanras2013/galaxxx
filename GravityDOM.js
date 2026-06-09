/**
 * GravityDOM.js v1.0.5
 * Plugin experimental que aplica físicas de gravedad y rebote a elementos HTML.
 * Cero dependencias externas. Motor matemático nativo. Corriendo siempre sin restricciones.
 * Parche definitivo contra bloqueos inferiores e inyección de físicas por Hover.
 */
(function (window, document) {
    'use strict';

    const GravityDOM = {
        init: function (config = {}) {
            this.settings = {
                gravity: config.gravity ?? 0.6,      // Fuerza de gravedad hacia abajo
                bounce: config.bounce ?? 0.7,        // Coeficiente de restitución (rebote)
                friction: config.friction ?? 0.98,   // Fricción del aire
                jumpForce: config.jumpForce ?? -12   // Impulso hacia arriba cuando le pasas el mouse por encima
            };

            this.items = [];
            this.activeDragItem = null;
            this.mouse = { x: 0, y: 0, lastX: 0, lastY: 0, vx: 0, vy: 0 };

            this.scanItems();
            this.setupEvents();
            this.loop();
        },

        scanItems: function () {
            const elements = document.querySelectorAll('.gravity-item');
            elements.forEach((el, index) => {
                el.style.position = 'fixed';
                el.style.cursor = 'grab';
                el.style.userSelect = 'none';
                el.style.webkitUserSelect = 'none';
                el.style.mozUserSelect = 'none';
                el.style.msUserSelect = 'none';
                el.style.touchAction = 'none'; 

                el.addEventListener('dragstart', (e) => e.preventDefault());
                el.addEventListener('selectstart', (e) => e.preventDefault());

                const rect = el.getBoundingClientRect();

                this.items.push({
                    el: el,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    isDragging: false
                });

                // Eventos de arrastre clásicos
                el.addEventListener('mousedown', (e) => this.startDrag(index, e));
                el.addEventListener('touchstart', (e) => {
                    if (e.touches && e.touches.length > 0) this.startDrag(index, e.touches[0]);
                }, { passive: false });

                // 🚨 NUEVA MÉTODOLOGÍA: Si pasas el mouse por encima, el elemento salta automáticamente
                el.addEventListener('mouseenter', () => {
                    const item = this.items[index];
                    if (!item.isDragging) {
                        item.vy = this.settings.jumpForce; // Aplica impulso vertical hacia arriba
                        item.vx += (Math.random() - 0.5) * 8; // Le da un leve desvío horizontal aleatorio
                    }
                });
            });
        },

        setupEvents: function () {
            window.addEventListener('mousemove', (e) => this.handleMove(e));
            window.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches.length > 0) this.handleMove(e.touches[0]);
            }, { passive: false });

            window.addEventListener('mouseup', () => this.stopDrag());
            window.addEventListener('touchend', () => this.stopDrag());

            window.addEventListener('resize', () => {
                this.items.forEach(item => {
                    const rect = item.el.getBoundingClientRect();
                    item.width = rect.width;
                    item.height = rect.height;
                });
            });
        },

        startDrag: function (index, e) {
            this.activeDragItem = this.items[index];
            this.activeDragItem.isDragging = true;
            this.activeDragItem.el.style.cursor = 'grabbing';
            this.activeDragItem.vx = 0;
            this.activeDragItem.vy = 0;

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.lastX = e.clientX;
            this.mouse.lastY = e.clientY;

            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
        },

        handleMove: function (e) {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.mouse.vx = this.mouse.x - this.mouse.lastX;
            this.mouse.vy = this.mouse.y - this.mouse.lastY;

            this.mouse.lastX = this.mouse.x;
            this.mouse.lastY = this.mouse.y;

            if (this.activeDragItem) {
                const screenW = window.innerWidth;
                const screenH = window.innerHeight;

                let targetX = this.mouse.x - (this.activeDragItem.width / 2);
                let targetY = this.mouse.y - (this.activeDragItem.height / 2);

                // Contención estricta en el arrastre dinámico
                if (targetX < 0) targetX = 0;
                if (targetX + this.activeDragItem.width > screenW) targetX = screenW - this.activeDragItem.width;
                if (targetY < 0) targetY = 0;
                // Margen de seguridad de 20px para que nunca desaparezca abajo al arrastrarlo
                if (targetY + this.activeDragItem.height > screenH - 20) targetY = screenH - this.activeDragItem.height - 20;

                this.activeDragItem.x = targetX;
                this.activeDragItem.y = targetY;
            }
        },

        stopDrag: function () {
            if (this.activeDragItem) {
                this.activeDragItem.isDragging = false;
                this.activeDragItem.el.style.cursor = 'grab';
                this.activeDragItem.vx = this.mouse.vx * 0.8;
                this.activeDragItem.vy = this.mouse.vy * 0.8;
                this.activeDragItem = null;
                
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
            }
        },

        loop: function () {
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            for (let i = 0; i < this.items.length; i++) {
                let p = this.items[i];

                if (!p.isDragging) {
                    p.vy += this.settings.gravity;
                    p.vx *= this.settings.friction;
                    p.vy *= this.settings.friction;

                    p.x += p.vx;
                    p.y += p.vy;

                    // 🚨 CORRECCIÓN DEL SUELO FÍSICO: Añadido margen seguro de 20px
                    if (p.y + p.height > screenH - 20) {
                        p.y = screenH - p.height - 20;
                        p.vy = -p.vy * this.settings.bounce;
                        p.vx *= 0.95; 
                    }
                    if (p.y < 0) {
                        p.y = 0;
                        p.vy = -p.vy * this.settings.bounce;
                    }
                    if (p.x + p.width > screenW) {
                        p.x = screenW - p.width;
                        p.vx = -p.vx * this.settings.bounce;
                    }
                    if (p.x < 0) {
                        p.x = 0;
                        p.vx = -p.vx * this.settings.bounce;
                    }
                }

                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0px)`;
            }

            requestAnimationFrame(() => this.loop());
        }
    };

    window.GravityDOM = GravityDOM;
    document.addEventListener('DOMContentLoaded', () => GravityDOM.init());

})(window, document);
