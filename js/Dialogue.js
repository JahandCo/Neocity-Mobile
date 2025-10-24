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
            'broken_mug': '../assets/images/scenes/the-broken-mug.png'
        };
        return map[key] || null;
    }
}