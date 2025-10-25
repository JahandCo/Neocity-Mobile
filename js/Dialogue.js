// js/Dialogue.js (Refactored for storyData.js scenes, large overlay, portraits, and effects)
import { synthyaStory } from './storyData.js';
import { Minigames } from './Minigames.js';

export class Dialogue {
    constructor(game) {
        this.game = game;
        this.view = document.getElementById('dialogue-view');
        this.portraitEl = this.view.querySelector('.character-portrait');
        this.nameEl = this.view.querySelector('.character-name');
        this.textEl = this.view.querySelector('.dialogue-text');
        this.choicesEl = this.view.querySelector('.dialogue-choices');

        // Current scene tracking
        this.story = synthyaStory; // default to Synthya story
        this.currentSceneId = null;
        this.currentNodes = [];
        this.nodeIndex = 0;

        // Lightweight audio manager for scenes
        this.musicEl = new Audio();
        this.musicEl.loop = true;
        this.musicEl.volume = 0.5;
        this.sfxEl = new Audio();
        this.sfxEl.volume = 0.7;

        // Click handling
        this.view.addEventListener('click', (e) => this.onClick(e));
    }

    // Public API
    startStory(sceneId) {
        this.loadScene(sceneId);
        this.game.changeState('dialogue');
    }

    loadScene(sceneId) {
        const scene = this.story.scenes[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return this.game.endDialogue();
        }
        // Update game flags on entering solved states
        if (sceneId === 'jukebox_solved') {
            if (this.game && this.game.flags) this.game.flags.jukeboxFixed = true;
        }
        if (sceneId === 'sign_solved') {
            if (this.game && this.game.flags) this.game.flags.signFixed = true;
        }
        // One-shot SFX on specific scenes
        if (sceneId === 'archive_intro') {
            this.playSfx('assets/audio/whispers.mp3');
        }
        if (sceneId === 'memory_trap') {
            this.playSfx('assets/audio/alert.mp3');
        }
        this.currentSceneId = sceneId;
        this.currentNodes = scene.dialogue || [];
        this.nodeIndex = 0;
        // Set backdrop image for the scene if provided
        const bgUrl = this.getBackgroundFor(scene.background);
        if (bgUrl) {
            this.view.style.background = `linear-gradient(rgba(0,0,16,0.55), rgba(0,0,16,0.55)), url(${bgUrl}) center/cover no-repeat`;
        } else {
            this.view.style.background = 'rgba(0,0,0,0.4)';
        }
        // Music is managed globally by Game (menu vs in-game). Ensure local music is stopped.
        this.stopMusic();
        // Apply any entry effects immediately
        if (scene.effectsOnStart && Array.isArray(scene.effectsOnStart)) {
            this.applyEffects(scene.effectsOnStart);
        }
        // If scene is a minigame scene definition, run it instead
        if (scene.minigame) {
            Minigames.run(scene.minigame, () => {
                if (scene.minigame.onComplete) {
                    this.loadScene(scene.minigame.onComplete);
                } else {
                    this.game.endDialogue();
                }
            });
            return;
        }
        // If scene requires input (logic puzzle), render input form
        if (scene.inputPrompt) {
            this.renderInputScene(scene);
            return;
        }
        this.renderNode();
        // If scene has no dialogue (free roam), close
        if (!scene.dialogue || scene.dialogue.length === 0) {
            this.game.endDialogue();
        }
    }

    renderNode() {
        const node = this.currentNodes[this.nodeIndex];
        if (!node) {
            // End of scene dialogue; show choices or end
            return this.renderChoicesOrEnd();
        }
        // Text & name
        this.textEl.textContent = node.text || '';
        this.nameEl.textContent = node.speaker || '';

        // Portrait by speaker/emotion
        this.portraitEl.innerHTML = '';
        const imgSrc = this.getPortrait(node.speaker, node.emotion);
        if (imgSrc) {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = node.speaker || 'Speaker';
            this.portraitEl.appendChild(img);
        }

        // Effects
        this.applyEffects(node.effects || []);

        // Choices
        this.choicesEl.innerHTML = '';
        const scene = this.story.scenes[this.currentSceneId];
        if (scene && scene.choices && this.nodeIndex === this.currentNodes.length - 1) {
            // Only display scene choices on last node
            scene.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.textContent = choice.text;
                btn.className = 'choice-btn';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (choice.nextScene) {
                        this.loadScene(choice.nextScene);
                    } else {
                        this.game.endDialogue();
                    }
                });
                // Optional hover SFX
                if (choice.hoverSfx) {
                    btn.addEventListener('mouseenter', () => this.playSfx(choice.hoverSfx));
                }
                this.choicesEl.appendChild(btn);
            });
        }
    }

    renderChoicesOrEnd() {
        const scene = this.story.scenes[this.currentSceneId];
        this.choicesEl.innerHTML = '';
        if (scene && scene.choices && scene.choices.length) {
            scene.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.textContent = choice.text;
                btn.className = 'choice-btn';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadScene(choice.nextScene);
                });
                this.choicesEl.appendChild(btn);
            });
        } else {
            this.game.endDialogue();
        }
    }

    onClick(e) {
        // If clicked on a choice, its handler already ran (stopPropagation)
        // Advance node otherwise
        const scene = this.story.scenes[this.currentSceneId];
        if (!scene) return;
        if (this.nodeIndex < this.currentNodes.length - 1) {
            this.nodeIndex++;
            this.renderNode();
        } else if (!scene.choices || scene.choices.length === 0) {
            this.game.endDialogue();
        }
    }

    getPortrait(speaker, emotion) {
        if (!speaker) return null;
        const key = speaker.trim().toLowerCase();
        const char = Object.values(this.story.characters).find(c => c.name.toLowerCase() === key) || this.story.characters[key];
        if (!char) return null;
        if (emotion && char.images[emotion]) return char.images[emotion];
        // Fallbacks
        return char.images.normal || Object.values(char.images)[0] || null;
    }

    applyEffects(effects) {
        // Remove previous
        this.view.classList.remove('effect-glitch', 'effect-flash', 'effect-scan');
        if (!effects || effects.length === 0) return;
        // Map story effects to CSS classes
        effects.forEach(eff => {
            if (eff === 'glitch') this.view.classList.add('effect-glitch');
            if (eff === 'flicker') this.view.classList.add('effect-flash');
            if (eff === 'scan') this.view.classList.add('effect-scan');
        });
        // Auto-remove transient classes after animation durations
        setTimeout(() => {
            this.view.classList.remove('effect-flash');
        }, 500);
        setTimeout(() => {
            this.view.classList.remove('effect-glitch');
        }, 800);
        setTimeout(() => {
            this.view.classList.remove('effect-scan');
        }, 2000);
    }

    getBackgroundFor(key) {
        if (!key) return null;
        // Map logical keys to asset paths
        const map = {
            'broken_mug': 'assets/images/scenes/bar-middle.png',
            'archive': 'assets/images/scenes/archive.png'
        };
        return map[key] || null;
    }

    // --- Input scene (logic puzzle) ---
    renderInputScene(scene) {
        // Show last node text if present, otherwise use prompt
        const node = (scene.dialogue && scene.dialogue[0]) || null;
        this.textEl.textContent = node?.text || '';
        this.nameEl.textContent = node?.speaker || '';
        this.portraitEl.innerHTML = '';
        this.choicesEl.innerHTML = '';
        // Build prompt UI
        const wrapper = document.createElement('div');
        wrapper.className = 'input-prompt';
        const label = document.createElement('label');
        label.textContent = scene.inputPrompt;
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type your answer';
        input.className = 'text-entry';
        const submit = document.createElement('button');
        submit.textContent = 'Confirm';
        submit.className = 'choice-btn';
        const error = document.createElement('div');
        error.className = 'input-error';
        error.style.display = 'none';
        error.textContent = 'Incorrect. Try again.';
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(submit);
        wrapper.appendChild(error);
        this.choicesEl.appendChild(wrapper);
        const normalize = s => (s || '').trim().toLowerCase();
        submit.addEventListener('click', (e) => {
            e.stopPropagation();
            if (normalize(input.value) === normalize(scene.inputAnswer)) {
                this.playSfx('assets/audio/select.mp3');
                this.loadScene(scene.nextOnCorrect);
            } else {
                error.style.display = 'block';
                wrapper.classList.add('shake');
                setTimeout(()=>wrapper.classList.remove('shake'), 400);
                this.playSfx('assets/audio/wrong.mp3');
            }
        });
    }

    // --- Audio helpers ---
    async playMusic(src) {
        try {
            this.musicEl.src = src;
            await this.musicEl.play();
        } catch (e) {
            // Ignore if autoplay blocked
        }
    }
    stopMusic() {
        try { this.musicEl.pause(); } catch {}
        this.musicEl.currentTime = 0;
        this.musicEl.removeAttribute('src');
    }
    async playSfx(src) {
        try {
            this.sfxEl.src = src;
            this.sfxEl.currentTime = 0;
            await this.sfxEl.play();
        } catch (e) {}
    }
}