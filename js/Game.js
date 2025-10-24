// js/Game.js
import { Dialogue } from './Dialogue.js';
import { CharacterSelect } from './CharacterSelect.js';

class Game {
    constructor() {
        console.log('Game Engine Started');

        // --- Game State & Views ---
        this.gameState = 'menu'; // 'menu' | 'character-select' | 'world' | 'dialogue' | 'combat'
        this.views = {
            'menu': document.getElementById('menu-view'),
            'character-select': document.getElementById('character-select-view'),
            'world': document.getElementById('world-view'),
            'dialogue': document.getElementById('dialogue-view'),
            'combat': document.getElementById('combat-view')
        };

        // --- Player (Synthya) ---
        this.player = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 3, img: null, w: 0, h: 0 };

        // --- Modules ---
        this.dialogue = new Dialogue(this);
        this.characterSelect = new CharacterSelect(this);

        // --- World Canvas ---
        this.canvas = document.getElementById('world-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // --- World & Assets ---
        this.world = {
            backgroundImg: null,
            barImg: null,
            jukeboxImg: null,
            signImg: null,
            barX: 0, barY: 0, barW: 0, barH: 0,
            kaelImg: null,
            kaelX: 0, kaelY: 0, kaelW: 0, kaelH: 0,
            jukeX: 0, jukeY: 0, jukeW: 0, jukeH: 0,
            signX: 0, signY: 0, signW: 0, signH: 0
        };
        this.loadWorldAssets();

        // --- Input ---
        this.canvas.addEventListener('click', (e) => this.handleWorldClick(e));

        // --- Menu Buttons ---
        const bgMusic = document.getElementById('bg-music');
        const storyBtn = document.getElementById('story-btn');
        const aboutBtn = document.getElementById('about-btn');
        const backToMenu = document.getElementById('back-to-menu-btn');
        const overlay = document.getElementById('overlay');
        const overlayBody = document.getElementById('overlay-body');
        const overlayClose = document.getElementById('overlay-close');

        if (backToMenu) backToMenu.addEventListener('click', () => this.changeState('menu'));
        if (storyBtn) storyBtn.addEventListener('click', async () => {
            if (bgMusic) { try { bgMusic.muted = false; await bgMusic.play(); } catch {} }
            this.changeState('character-select');
        });
        if (aboutBtn && overlay && overlayBody && overlayClose) {
            aboutBtn.addEventListener('click', () => {
                overlayBody.innerHTML = '<h2>About</h2><p>Neocity Mobile is a cybertech-inspired narrative adventure. Choose characters, traverse the Grid, and uncover the multiverse.</p>';
                overlay.classList.remove('hidden');
            });
            overlayClose.addEventListener('click', () => overlay.classList.add('hidden'));
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
        }

        // --- Loop ---
        this.gameLoop();
        this.changeState('menu');
    }

    // --- Layout ---
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.layoutScene();
    }

    changeState(newState) {
        Object.values(this.views).forEach(v => v && v.classList.add('hidden'));
        if (this.views[newState]) {
            this.views[newState].classList.remove('hidden');
            this.gameState = newState;
            if (newState === 'world') this.resizeCanvas();
        }
    }

    layoutScene() {
        // Compute bar rect and place entities when images are loaded
        if (!this.world.barImg) return;
        const aspect = this.world.barImg.height / this.world.barImg.width;
        const barW = this.canvas.width * 0.8;
        const barH = barW * aspect;
        const barX = (this.canvas.width - barW) / 2;
        const barY = this.canvas.height - barH;
        Object.assign(this.world, { barX, barY, barW, barH });

        // Player placement and size
        if (this.player.img) {
            const pH = Math.max(160, this.canvas.height * 0.28);
            const pScale = pH / this.player.img.height;
            const pW = this.player.img.width * pScale;
            this.player.w = pW; this.player.h = pH;
            if (this.player.y === 0) {
                this.player.x = barX + barW * 0.2;
                this.player.y = barY + barH - pH;
                this.player.targetX = this.player.x;
                this.player.targetY = this.player.y;
            } else {
                // Keep baseline
                this.player.y = barY + barH - pH;
            }
        }

        // Kael placement
        if (this.world.kaelImg) {
            const kH = Math.max(170, this.canvas.height * 0.30);
            const kScale = kH / this.world.kaelImg.height;
            const kW = this.world.kaelImg.width * kScale;
            const kX = barX + barW * 0.7;
            const kY = barY + barH - kH;
            Object.assign(this.world, { kaelX: kX, kaelY: kY, kaelW: kW, kaelH: kH });
        }

        // Jukebox
        if (this.world.jukeboxImg) {
            const jH = Math.max(140, this.canvas.height * 0.22);
            const jScale = jH / this.world.jukeboxImg.height;
            const jW = this.world.jukeboxImg.width * jScale;
            const jX = barX + barW * 0.05;
            const jY = barY + barH - jH;
            Object.assign(this.world, { jukeX: jX, jukeY: jY, jukeW: jW, jukeH: jH });
        }

        // Neon sign
        if (this.world.signImg) {
            const sW = Math.max(140, this.canvas.width * 0.18);
            const sAspect = this.world.signImg.height / this.world.signImg.width;
            const sH = sW * sAspect;
            const sX = barX + barW - sW - 16;
            const sY = barY + 16;
            Object.assign(this.world, { signX: sX, signY: sY, signW: sW, signH: sH });
        }
    }

    // --- Input ---
    handleWorldClick(event) {
        if (this.gameState !== 'world') return;
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        this.player.targetX = clickX;
        this.player.targetY = this.world.barY + this.world.barH - this.player.h;
        if (this.pointInKael(clickX, clickY)) {
            this.dialogue.startStory('broken_mug_loop_start');
        }
    }

    // --- Simulation ---
    updateWorld() {
        const dx = this.player.targetX - this.player.x;
        const dy = this.player.targetY - this.player.y;
        const distance = Math.hypot(dx, dy);
        if (distance > this.player.speed) {
            this.player.x += (dx / distance) * this.player.speed;
            this.player.y += (dy / distance) * this.player.speed;
        } else {
            this.player.x = this.player.targetX;
            this.player.y = this.player.targetY;
        }
        const left = this.world.barX + 10;
        const right = this.world.barX + this.world.barW - this.player.w - 10;
        if (this.player.x < left) this.player.x = left;
        if (this.player.x > right) this.player.x = right;
    }

    // --- Rendering ---
    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.world.backgroundImg) {
            this.ctx.drawImage(this.world.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#111';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.world.barImg) {
            this.ctx.drawImage(this.world.barImg, this.world.barX, this.world.barY, this.world.barW, this.world.barH);
        }
        if (this.world.jukeboxImg) {
            this.ctx.drawImage(this.world.jukeboxImg, this.world.jukeX, this.world.jukeY, this.world.jukeW, this.world.jukeH);
        }
        if (this.world.signImg) {
            this.ctx.drawImage(this.world.signImg, this.world.signX, this.world.signY, this.world.signW, this.world.signH);
        }
        if (this.player.img) {
            this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.w, this.player.h);
        }
        if (this.world.kaelImg) {
            this.ctx.drawImage(this.world.kaelImg, this.world.kaelX, this.world.kaelY, this.world.kaelW, this.world.kaelH);
        }
    }

    // --- Assets ---
    loadWorldAssets() {
        const bg = new Image();
        bg.src = '../assets/images/scenes/background.png';
        bg.onload = () => { this.world.backgroundImg = bg; };

        const bar = new Image();
        bar.src = '../assets/images/scenes/the-broken-mug.png';
        bar.onload = () => { this.world.barImg = bar; this.layoutScene(); };

        const juke = new Image();
        juke.src = '../assets/images/scenes/jukebox.png';
        juke.onload = () => { this.world.jukeboxImg = juke; this.layoutScene(); };

        const sign = new Image();
        sign.src = '../assets/images/scenes/neon-sign.svg';
        sign.onload = () => { this.world.signImg = sign; this.layoutScene(); };

        const kael = new Image();
        kael.src = '../assets/images/characters/kael/kael-normal.png';
        kael.onload = () => { this.world.kaelImg = kael; this.layoutScene(); };

        const syn = new Image();
        syn.src = '../assets/images/characters/synthya/synthya.png';
        syn.onload = () => { this.player.img = syn; this.layoutScene(); };
    }

    pointInKael(x, y) {
        const { kaelX, kaelY, kaelW, kaelH } = this.world;
        return x >= kaelX && x <= kaelX + kaelW && y >= kaelY && y <= kaelY + kaelH;
    }

    // --- Loop ---
    gameLoop() {
        if (this.gameState === 'world') {
            this.updateWorld();
            this.drawWorld();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

export { Game };