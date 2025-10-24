// js/MenuBackground.js
// Cycles background videos on the menu, fading to an animated grid between clips
// Usage: const mbg = new MenuBackground(document.getElementById('menu-view'), { videos: [...] });

export class MenuBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.videos = options.videos || [
            // Discovered project videos
            'assets/videos/vid.mp4',
            'assets/videos/vid2.mp4',
            'assets/videos/vid3.mp4'
        ];
        this.gridVariants = ['grid-navy', 'grid-black', 'grid-purple'];
    this.videoDurationRange = options.videoDurationRange || [5000, 6000];
    // time to display grid between clips (randomized 12–20s by default)
    this.gridPauseRange = options.gridPauseRange || [12000, 20000];
        this.fadeMs = options.fadeMs || 800;
        this.running = false;
        this.timers = new Set();
        this._ensureElements();
    }

    _ensureElements() {
        if (!this.container) return;
        // Inject video layer if not present
        this.layer = this.container.querySelector('.menu-bg-video');
        if (!this.layer) {
            this.layer = document.createElement('div');
            this.layer.className = 'menu-bg-video';
            this.videoEl = document.createElement('video');
            this.videoEl.setAttribute('muted', '');
            this.videoEl.muted = true;
            this.videoEl.setAttribute('playsinline', '');
            this.videoEl.setAttribute('preload', 'auto');
            // no controls; background-only element
            this.layer.appendChild(this.videoEl);
            this.container.appendChild(this.layer);
        } else {
            this.videoEl = this.layer.querySelector('video');
        }
        // Default to a grid variant
        this._applyRandomGrid();
        // Ensure overlays visible initially
        this._setOverlayOpacity(1);
    }

    start() {
        if (!this.container || this.running) return;
        this.running = true;
        this._cycle();
    }

    stop() {
        this.running = false;
        // Clear timers
        this.timers.forEach(id => clearTimeout(id));
        this.timers.clear();
        // Fade out video and pause
        if (this.layer) this.layer.style.opacity = '0';
        if (this.videoEl) {
            try { this.videoEl.pause(); } catch {}
            this.videoEl.removeAttribute('src');
            this.videoEl.load();
        }
        // Restore grid overlays
        this._setOverlayOpacity(1);
        // Ensure a grid class is applied
        this._applyRandomGrid();
    }

    async _cycle() {
        if (!this.running) return;
        // Try to play a clip; if none or fails, show grid then retry later
        const clip = this._pickRandom(this.videos);
        const ok = await this._playClip(clip);
        if (!this.running) return;
        // After clip (or failure), show grid for a short pause
        await this._showGridPhase();
        if (!this.running) return;
        // Continue
        this._cycle();
    }

    async _playClip(src) {
        if (!this.videoEl || !src) return false;
        // Wait for metadata/canplay to avoid black frames
        const playPromise = () => new Promise((resolve) => {
            const onCanPlay = () => { cleanup(); resolve(true); };
            const onError = () => { cleanup(); resolve(false); };
            const cleanup = () => {
                this.videoEl.removeEventListener('canplay', onCanPlay);
                this.videoEl.removeEventListener('error', onError);
            };
            this.videoEl.addEventListener('canplay', onCanPlay, { once: true });
            this.videoEl.addEventListener('error', onError, { once: true });
        });
        try {
            this.videoEl.src = src;
            this.videoEl.currentTime = 0;
            await playPromise();
        } catch (e) {
            return false;
        }
        if (!this.running) return false;
        // Fade in video; hide grid overlays
        this._setOverlayOpacity(0);
        this.layer.style.transition = `opacity ${this.fadeMs}ms ease`;
        this.layer.style.opacity = '1';
        // Try to play for 5-6 seconds
        try { await this.videoEl.play(); } catch (e) { /* autoplay gate */ }
    const [min,max] = this.videoDurationRange;
    const hold = this._timer(this._randMs(min, max));
        await hold;
        // Fade out video
        this.layer.style.opacity = '0';
        // Stop playback after fade
        await this._timer(this.fadeMs);
        try { this.videoEl.pause(); } catch {}
        this.videoEl.removeAttribute('src');
        this.videoEl.load();
        return true;
    }

    async _showGridPhase() {
        // Apply a random grid variant and show overlays
        this._applyRandomGrid();
        this._setOverlayOpacity(1);
        // Wait a bit before next clip
        const [gMin, gMax] = this.gridPauseRange;
        await this._timer(this._randMs(gMin, gMax));
    }

    _applyRandomGrid() {
        if (!this.container) return;
        this.container.classList.remove('grid-navy', 'grid-black', 'grid-purple');
        const cls = this._pickRandom(this.gridVariants);
        this.container.classList.add(cls);
    }

    _setOverlayOpacity(val) {
        if (!this.container) return;
        this.container.style.setProperty('--overlay-opacity', String(val));
    }

    _pickRandom(arr) {
        if (!arr || !arr.length) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    _timer(ms) {
        return new Promise((resolve) => {
            const id = setTimeout(() => { this.timers.delete(id); resolve(); }, ms);
            this.timers.add(id);
        });
    }

    _randMs(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
