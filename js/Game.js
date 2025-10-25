// js/Game.js
import { Dialogue } from './Dialogue.js';
import { CharacterSelect } from './CharacterSelect.js';
import { MenuBackground } from './MenuBackground.js';

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

        // --- Progress Flags (puzzle state) ---
        this.flags = {
            jukeboxFixed: false,
            signFixed: false
        };

    // --- Modules ---
        this.dialogue = new Dialogue(this);
        this.characterSelect = new CharacterSelect(this);
    this.menuBackground = new MenuBackground(this.views['menu']);

        // --- World Canvas ---
        this.canvas = document.getElementById('world-canvas');
        this.ctx = this.canvas.getContext('2d');

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

        // Now that world is defined, handle canvas sizing
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

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
        const menuView = this.views['menu'];

    // Background music playlist (menu.mp3 -> menu2.mp3 -> repeat) for Menu & Character Select
        this.bgMusicEl = bgMusic;
        this.bgPlaylist = ['assets/audio/menu.mp3', 'assets/audio/menu2.mp3'];
        this.bgIndex = 0;
        this.bgMusicHandlerBound = null;
        this.startMenuMusic = async () => {
            const el = this.bgMusicEl; if (!el) return;
            if (!this.bgMusicHandlerBound) {
                this.bgMusicHandlerBound = async () => {
                    this.bgIndex = (this.bgIndex + 1) % this.bgPlaylist.length;
                    el.src = this.bgPlaylist[this.bgIndex];
                    el.currentTime = 0;
                    try { await el.play(); } catch (e) { /* gesture needed */ }
                };
                el.addEventListener('ended', this.bgMusicHandlerBound);
            }
            const want = this.bgPlaylist[this.bgIndex];
            if (!el.src || !el.src.includes(want)) {
                el.src = want;
                el.currentTime = 0;
            }
            el.muted = false;
            try { await el.play(); } catch (err) { console.debug('Music play attempt:', err?.message || err); }
        };
        this.stopMenuMusic = () => {
            const el = this.bgMusicEl; if (!el) return;
            try { el.pause(); } catch {}
            el.currentTime = 0;
            if (this.bgMusicHandlerBound) {
                el.removeEventListener('ended', this.bgMusicHandlerBound);
                this.bgMusicHandlerBound = null;
            }
            this.bgIndex = 0;
        };

        // In-game music (loops game.mp3) for World & Dialogue
        this.gameMusicEl = new Audio('assets/audio/game.mp3');
        this.gameMusicEl.loop = true;
        this.gameMusicEl.volume = 0.6;
        this.startGameMusic = async () => {
            try {
                this.gameMusicEl.muted = false;
                await this.gameMusicEl.play();
            } catch (e) { /* requires gesture */ }
        };
        this.stopGameMusic = () => {
            try { this.gameMusicEl.pause(); } catch {}
            this.gameMusicEl.currentTime = 0;
        };

        // UI click sound for any button press
        this.uiClickSrc = 'assets/audio/select.mp3';
        const clickSfxHandler = (e) => {
            const el = e.target.closest && e.target.closest('button');
            if (!el) return;
            // play a short overlapping-safe click sound
            try { const s = new Audio(this.uiClickSrc); s.volume = 0.8; s.play(); } catch {}
        };
        document.addEventListener('click', clickSfxHandler, true);

        if (backToMenu) backToMenu.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.changeState('menu'); });
        if (storyBtn) {
            console.log('Binding Story button');
            storyBtn.addEventListener('click', async (e) => {
                e.preventDefault(); e.stopPropagation();
                console.log('Story clicked');
                await this.startMenuMusic();
                this.changeState('character-select');
            });
        }
        if (aboutBtn && overlay && overlayBody && overlayClose) {
            console.log('Binding About button');
            aboutBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                // Start music on About as well
                this.startMenuMusic();
                overlayBody.innerHTML = '<h2>About</h2><p>Neocity Mobile is a cybertech-inspired narrative adventure. Choose characters, traverse the Grid, and uncover the multiverse.</p>';
                overlay.classList.remove('hidden');
            });
            overlayClose.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); overlay.classList.add('hidden'); });
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
        }
        // Fallback: delegate clicks from the menu view in case direct handlers miss
        if (menuView) {
            menuView.addEventListener('click', async (e) => {
                const storyEl = e.target.closest && e.target.closest('#story-btn');
                const aboutEl = e.target.closest && e.target.closest('#about-btn');
                if (storyEl) {
                    e.preventDefault(); e.stopPropagation();
                    console.log('Story clicked (delegated)');
                    await this.startMenuMusic();
                    this.changeState('character-select');
                } else if (aboutEl && overlay && overlayBody) {
                    e.preventDefault(); e.stopPropagation();
                    this.startMenuMusic();
                    overlayBody.innerHTML = '<h2>About</h2><p>Neocity Mobile is a cybertech-inspired narrative adventure. Choose characters, traverse the Grid, and uncover the multiverse.</p>';
                    overlay.classList.remove('hidden');
                }
            }, true);
            // Also attempt to start music on any first interaction anywhere in menu
            const gestureHandler = async () => {
                await this.startMenuMusic();
                menuView.removeEventListener('pointerdown', gestureHandler, true);
                menuView.removeEventListener('keydown', gestureHandler, true);
            };
            menuView.addEventListener('pointerdown', gestureHandler, true);
            menuView.addEventListener('keydown', gestureHandler, true);
        }

        // --- Loop ---
        this.gameLoop();
        this.changeState('menu');
    }

    // --- Layout ---
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        if (this.world) this.layoutScene();
    }

    changeState(newState) {
        Object.values(this.views).forEach(v => v && v.classList.add('hidden'));
        if (this.views[newState]) {
            this.views[newState].classList.remove('hidden');
            this.gameState = newState;
            if (newState === 'world') this.resizeCanvas();
            // Start/stop backgrounds and music based on state
            if (newState === 'menu' || newState === 'character-select') {
                this.menuBackground && this.menuBackground.start();
                // Try to start music (will only work after a gesture)
                (async ()=>{ try { await this.startMenuMusic(); } catch {} })();
                // Stop in-game music if any
                this.stopGameMusic();
            } else {
                this.menuBackground && this.menuBackground.stop();
                // Stop menu music when leaving menu/character select
                this.stopMenuMusic();
                // Start in-game music for world/dialogue
                if (newState === 'world' || newState === 'dialogue') {
                    (async ()=>{ try { await this.startGameMusic(); } catch {} })();
                } else {
                    this.stopGameMusic();
                }
            }
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
        // Hotspots: Jukebox, Neon Sign, Kael
        if (this.pointInJukebox(clickX, clickY)) {
            if (this.flags.jukeboxFixed) {
                this.dialogue.startStory('jukebox_solved');
            } else {
                this.dialogue.startStory('puzzle_jukebox');
            }
            return;
        }
        if (this.pointInSign(clickX, clickY)) {
            if (this.flags.signFixed) {
                this.dialogue.startStory('sign_solved');
            } else {
                this.dialogue.startStory('puzzle_sign');
            }
            return;
        }
        if (this.pointInKael(clickX, clickY)) {
            // Gate Kael confrontation until anomalies are fixed
            if (this.flags.jukeboxFixed && this.flags.signFixed) {
                this.dialogue.startStory('puzzle_kael_final');
            } else {
                this.dialogue.startStory('puzzle_kael_talk');
            }
            return;
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
        bg.src = 'assets/images/scenes/far-background.png';
        bg.onload = () => { this.world.backgroundImg = bg; };

        const bar = new Image();
        bar.src = 'assets/images/scenes/bar-middle.png';
        bar.onload = () => { this.world.barImg = bar; this.layoutScene(); };

        const juke = new Image();
        juke.src = 'assets/images/scenes/jukebox.png';
        juke.onload = () => { this.world.jukeboxImg = juke; this.layoutScene(); };

        const sign = new Image();
        sign.src = 'assets/images/scenes/neon-sign.svg';
        sign.onload = () => { this.world.signImg = sign; this.layoutScene(); };

        const kael = new Image();
        kael.src = 'assets/images/characters/kael/kael-normal.png';
        kael.onload = () => { this.world.kaelImg = kael; this.layoutScene(); };

        const syn = new Image();
        syn.src = 'assets/images/characters/synthya/synthya.png';
        syn.onload = () => { this.player.img = syn; this.layoutScene(); };
    }

    pointInKael(x, y) {
        const { kaelX, kaelY, kaelW, kaelH } = this.world;
        return x >= kaelX && x <= kaelX + kaelW && y >= kaelY && y <= kaelY + kaelH;
    }

    pointInJukebox(x, y) {
        const { jukeX, jukeY, jukeW, jukeH } = this.world;
        return x >= jukeX && x <= jukeX + jukeW && y >= jukeY && y <= jukeY + jukeH;
    }

    pointInSign(x, y) {
        const { signX, signY, signW, signH } = this.world;
        return x >= signX && x <= signX + signW && y >= signY && y <= signY + signH;
    }

    // --- Loop ---
    gameLoop() {
        if (this.gameState === 'world') {
            this.updateWorld();
            this.drawWorld();
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    // --- Dialogue End Hook ---
    endDialogue() {
        // Return to world exploration
        this.changeState('world');
    }
}

export { Game };