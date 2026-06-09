/**
 * MatrixBg.js v1.2.2
 * [Matrix Protocol] - Entorno hacker adaptable y dinámico para fondo web.
 * Parcheado con MutationObserver para inyección de estilos en tiempo real.
 */
(function (window, document) {
    'use strict';

    const MatrixBg = {
        init: function () {
            this.fontSize = 16;
            this.rainDrops = [];
            this.alphabet = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEF".split("");
            this.intervalID = null;

            this.injectStyles();
            this.createCanvas();
            this.adjustDimensions();
            this.setupEvents();
            this.startLoop();
            this.watchDOM(); // 🚨 NUEVO: Vigilante en tiempo real activo
            
            console.log("🚀 [Matrix Protocol] Corriendo con éxito y vigilando el DOM.");
        },

        injectStyles: function () {
            let styleContainer = document.getElementById("matrix-theme-styles");
            if (!styleContainer) {
                styleContainer = document.createElement("style");
                styleContainer.id = "matrix-theme-styles";
                document.head.appendChild(styleContainer);
            }
            // Mantenemos tus estilos 10000000000/10 intactos
            styleContainer.textContent = `
                body {
                    background-color: #000000 !important;
                    background-image: none !important;
                    color: #00ff00 !important;
                    transition: background-color 0.5s ease !important;
                }
                .form-container {
                    background: rgba(5, 12, 5, 0.88) !important;
                    border: 1px solid #00ff00 !important;
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5) !important;
                    backdrop-filter: blur(4px) !important;
                    -webkit-backdrop-filter: blur(4px) !important;
                }
                input {
                    background: #050a05 !important;
                    border: 1px solid #00ff00 !important;
                    color: #00ff00 !important;
                    text-shadow: 0 0 3px #00ff00 !important;
                }
                button {
                    background: #00ff00 !important;
                    color: #000000 !important;
                    font-weight: bold !important;
                    box-shadow: 0 0 15px #00ff00 !important;
                    border: none !important;
                }
                h1, label {
                    text-shadow: 0 0 8px rgba(0, 255, 0, 0.8) !important;
                }
            `;
        },

        // 🚨 PARCHE REVOLUCIONARIO: Fuerza a la web a aplicar los estilos aunque carguen tarde
        watchDOM: function () {
            const applyMatrixStyles = () => {
                // Re-inyectar estilos para asegurar que el navegador redibuje los nuevos elementos
                this.injectStyles();
            };

            // Ejecutar una vez al inicio
            applyMatrixStyles();

            // Configurar el vigilante para que escuche si se crean nuevos botones o inputs
            const observer = new MutationObserver((mutations) => {
                applyMatrixStyles();
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        },

        createCanvas: function () {
            this.canvas = document.getElementById("matrix-canvas-f12");
            if (!this.canvas) {
                this.canvas = document.createElement("canvas");
                this.canvas.id = "matrix-canvas-f12";
                this.canvas.style.position = "fixed";
                this.canvas.style.top = "0";
                this.canvas.style.left = "0";
                this.canvas.style.width = "100vw";
                this.canvas.style.height = "100vh";
                this.canvas.style.zIndex = "-2"; 
                this.canvas.style.pointerEvents = "none";
                document.body.appendChild(this.canvas);
            }
            this.ctx = this.canvas.getContext("2d");
        },

        adjustDimensions: function () {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            const targetColumns = Math.floor(this.canvas.width / this.fontSize);
            
            if (this.rainDrops.length < targetColumns) {
                for (let i = this.rainDrops.length; i < targetColumns; i++) {
                    this.rainDrops[i] = Math.random() * -20; 
                }
            } else if (this.rainDrops.length > targetColumns) {
                this.rainDrops = this.rainDrops.slice(0, targetColumns);
            }
        },

        setupEvents: function () {
            window.addEventListener('resize', () => this.adjustDimensions());
        },

        startLoop: function () {
            if (this.intervalID) clearInterval(this.intervalID);

            this.intervalID = setInterval(() => {
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.ctx.fillStyle = "#00ff00"; 
                this.ctx.font = this.fontSize + "px monospace";

                for (let i = 0; i < this.rainDrops.length; i++) {
                    const text = this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
                    const x = i * this.fontSize;
                    const y = this.rainDrops[i] * this.fontSize;

                    this.ctx.fillText(text, x, y);

                    if (y > this.canvas.height && Math.random() > 0.975) {
                        this.rainDrops[i] = 0;
                    }
                    
                    this.rainDrops[i]++;
                }
            }, 33);
        }
    };

    window.MatrixBg = MatrixBg;
    
    // Ejecución inmediata para ganar prioridad de carga
    MatrixBg.init();

})(window, document);
