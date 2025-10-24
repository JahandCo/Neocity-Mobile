// js/CharacterSelect.js

export class CharacterSelect {
    constructor(game) {
        this.game = game;
        this.view = document.getElementById('character-select-view');
        this.gridEl = document.getElementById('character-grid');

        // Character data (exclude glit and null)
        this.characters = [
            {
                id: 'synthya',
                name: 'Synthya',
                img: '../assets/images/characters/synthya/synthya.png',
                locked: false,
                blurb: 'Synthya is a sentient synth with fragmented memories and a mysterious tie to the Grid. She navigates glitches with empathy and razor logic.'
            },
            {
                id: 'echo',
                name: 'Echo',
                img: '../assets/images/characters/echo/echo.png',
                locked: true,
                blurb: 'Echo is a data-runner who speaks in reflections—rumored to have duplicated consciousness split across shards of the City.'
            },
            {
                id: 'kael',
                name: 'Kael',
                img: '../assets/images/characters/kael/kael.png',
                locked: true,
                blurb: 'Kael was once a guardian of the Neon Archives. Exiled after a breach, he now hunts the truth that broke his oath.'
            },
            {
                id: 'rune',
                name: 'Rune',
                img: '../assets/images/characters/rune/rune.png',
                locked: true,
                blurb: 'Rune reads the Grid like a living language, weaving code-charms that bend probability and fate.'
            },
            {
                id: 'vesper',
                name: 'Vesper',
                img: '../assets/images/characters/vesper/vesper.png',
                locked: true,
                blurb: 'Vesper moves in silence, a courier for secrets—trading in debts and invisible alliances.'
            }
        ];

        this.buildGrid();
    }

    buildGrid() {
        if (!this.gridEl) return;
        this.gridEl.innerHTML = '';
        this.characters.forEach((c) => {
            const card = document.createElement('button');
            card.className = 'char-card' + (c.locked ? ' locked' : '');
            card.setAttribute('data-id', c.id);
            card.innerHTML = `
                <img src="${c.img}" alt="${c.name}">
                <span class="char-name">${c.name}</span>
                <span class="lock-icon">🔒</span>
            `;
            if (!c.locked) {
                card.addEventListener('click', () => this.showDetails(c));
            } else {
                card.addEventListener('click', () => this.showLockedMessage(c));
            }
            this.gridEl.appendChild(card);
        });
    }

    showLockedMessage(c) {
        // Subtle feedback for locked selection
        const el = this.gridEl.querySelector(`[data-id="${c.id}"]`);
        if (!el) return;
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
    }

    showDetails(c) {
        // Add details overlay with background blur
        this.clearDetails();
        const overlay = document.createElement('div');
        overlay.className = 'overlay char-overlay';
        overlay.innerHTML = `
            <div class="overlay-content">
                <button class="overlay-close" aria-label="Close">×</button>
                <div class="character-details">
                    <div class="char-image"><img src="${c.img}" alt="${c.name}"></div>
                    <div class="char-info">
                        <h2>${c.name}</h2>
                        <p>${c.blurb}</p>
                        <div class="char-buttons">
                            <button id="char-play-btn" class="primary-btn">Play</button>
                            <button id="char-back-btn" class="secondary-btn">Back</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.view.appendChild(overlay);

        const close = () => this.clearDetails();
        overlay.querySelector('.overlay-close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        overlay.querySelector('#char-back-btn').addEventListener('click', close);
        overlay.querySelector('#char-play-btn').addEventListener('click', () => {
            close();
            // Start story intro before free roam
            this.game.dialogue.startStory('archive_intro');
        });
    }

    clearDetails() {
        const existing = this.view.querySelector('.char-overlay');
        if (existing) existing.remove();
    }
}
