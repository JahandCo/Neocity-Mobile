// js/Dialogue.js (Refactored for storyData.js scenes, large overlay, portraits, and effects)
import { synthyaStory } from './storyData.js';
import { Minigames } from './Minigames.js';

export class Dialogue {
    constructor(game) {
        this.game = game;
        this.view = document.getElementById('dialogue-view');
        this.leftPortraitEl = this.view.querySelector('.character-portrait.left');
        this.rightPortraitEl = this.view.querySelector('.character-portrait.right');
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
        
        // Keyboard handling for dialogue advancement
        this.keyHandler = (e) => this.onKeyPress(e);
        this.keyHandlerActive = false; // Will be activated when dialogue starts
    }

    // Public API
    startStory(sceneId) {
        // Ensure keyboard handler is active
        if (!this.keyHandlerActive) {
            document.addEventListener('keydown', this.keyHandler);
            this.keyHandlerActive = true;
        }
        this.loadScene(sceneId);
        this.game.changeState('dialogue');
    }

    cleanup() {
        // Remove keyboard handler when leaving dialogue
        if (this.keyHandlerActive) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandlerActive = false;
        }
    }

    loadScene(sceneId) {
        const scene = this.story.scenes[sceneId];
        if (!scene) {
            console.error('Scene not found:', sceneId);
            return this.game.endDialogue();
        }

        // Clean up any existing system overlays
        const existingOverlays = this.view.querySelectorAll('.system-overlay');
        existingOverlays.forEach(overlay => overlay.remove());
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

        // Show characters in scene if specified
        this.updateSceneCharacters(scene);
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

        // Check if this is a system message
        if (node.speaker === 'System') {
            this.renderSystemMessage(node);
            return;
        }

        // Regular dialogue
        this.textEl.textContent = node.text || '';
        this.nameEl.textContent = node.speaker || '';

        // Clear both portraits first
        this.leftPortraitEl.innerHTML = '';
        this.rightPortraitEl.innerHTML = '';

        // Determine which characters are currently in the scene
        const currentSpeaker = node.speaker ? node.speaker.toLowerCase() : null;
        const scene = this.story.scenes[this.currentSceneId];
        
        // Check if there are multiple characters in this scene (look at all dialogue nodes)
        const allSpeakers = new Set();
        if (scene && scene.dialogue) {
            scene.dialogue.forEach(n => {
                if (n.speaker && n.speaker !== 'System') {
                    allSpeakers.add(n.speaker.toLowerCase());
                }
            });
        }
        
        // Show character(s) based on scene composition
        if (allSpeakers.size === 1) {
            // Single character scene - show centered
            this.view.classList.add('single-character');
            const imgSrc = this.getPortrait(node.speaker, node.emotion);
            if (imgSrc) {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = node.speaker || 'Speaker';
                // Put in left portrait container for centering
                this.leftPortraitEl.appendChild(img);
            }
        } else if (allSpeakers.size >= 2) {
            // Two character scene - show both (left = Synthya, right = other)
            this.view.classList.remove('single-character');
            const speakers = Array.from(allSpeakers);
            
            // Synthya always on left
            const synthyaSpeaker = speakers.find(s => s === 'synthya');
            const otherSpeaker = speakers.find(s => s !== 'synthya');
            
            if (synthyaSpeaker) {
                const synthyaEmotion = currentSpeaker === 'synthya' ? node.emotion : 'speak';
                const synthyaImg = this.getPortrait('synthya', synthyaEmotion);
                if (synthyaImg) {
                    const img = document.createElement('img');
                    img.src = synthyaImg;
                    img.alt = 'Synthya';
                    this.leftPortraitEl.appendChild(img);
                }
            }
            
            if (otherSpeaker) {
                const otherEmotion = currentSpeaker === otherSpeaker ? node.emotion : 'speak';
                const otherImg = this.getPortrait(otherSpeaker, otherEmotion);
                if (otherImg) {
                    const img = document.createElement('img');
                    img.src = otherImg;
                    img.alt = otherSpeaker;
                    this.rightPortraitEl.appendChild(img);
                }
            }
        } else {
            // No characters to show
            this.view.classList.remove('single-character');
        }

        // Effects
        this.applyEffects(node.effects || []);

        // Choices
        this.choicesEl.innerHTML = '';
        if (scene && scene.choices && this.nodeIndex === this.currentNodes.length - 1) {
            // Only display scene choices on last node
            scene.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.textContent = choice.text;
                btn.className = 'choice-btn';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Choice clicked:', choice.text);
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
                // Optional hover hint text (temporary UI hint shown in the dialogue text area)
                if (choice.hoverHint) {
                    btn.addEventListener('mouseenter', () => this.showHoverHint(choice.hoverHint));
                    btn.addEventListener('mouseleave', () => this.hideHoverHint());
                }
                this.choicesEl.appendChild(btn);
            });
        }
    }

    showHoverHint(hint) {
        try {
            if (this._hoverBackup === undefined) this._hoverBackup = this.textEl.textContent;
            this.textEl.textContent = hint;
            this.textEl.classList.add('hover-hint');
        } catch (e) {}
    }

    hideHoverHint() {
        try {
            if (this._hoverBackup !== undefined) {
                this.textEl.textContent = this._hoverBackup;
                delete this._hoverBackup;
            }
            this.textEl.classList.remove('hover-hint');
        } catch (e) {}
    }

    renderSystemMessage(node) {
        // Clear regular dialogue elements and portraits
        this.textEl.textContent = '';
        this.nameEl.textContent = '';
        this.leftPortraitEl.innerHTML = '';
        this.rightPortraitEl.innerHTML = '';
        this.choicesEl.innerHTML = '';

        // Remove any existing system overlay
        const existingOverlay = this.view.querySelector('.system-overlay');
        if (existingOverlay) existingOverlay.remove();

        // Create system message box (non-clickable, top of screen)
        const overlay = document.createElement('div');
        overlay.className = 'system-overlay';
        
        const systemText = document.createElement('div');
        systemText.className = 'system-text';
        systemText.textContent = node.text || '';
        
        overlay.appendChild(systemText);
        this.view.appendChild(overlay);
        
        // System message is visible but not clickable
        // User advances through normal click/space handling in onClick/onKeyPress
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
                    e.preventDefault();
                    console.log('Choice clicked (renderChoicesOrEnd):', choice.text);
                    this.loadScene(choice.nextScene);
                });
                this.choicesEl.appendChild(btn);
            });
        } else {
            this.game.endDialogue();
        }
    }

    onClick(e) {
        // Choice buttons call stopPropagation, so this won't run for them
        // But let's be defensive and check anyway
        if (e.target.tagName === 'BUTTON' || e.target.closest('.choice-btn')) {
            // This shouldn't happen due to stopPropagation, but just in case
            return;
        }
        
        // Check if we're showing a system message
        const systemOverlay = this.view.querySelector('.system-overlay');
        if (systemOverlay) {
            // Remove system message and advance
            systemOverlay.remove();
            if (this.nodeIndex < this.currentNodes.length - 1) {
                this.nodeIndex++;
                this.renderNode();
            } else {
                this.renderChoicesOrEnd();
            }
            return;
        }
        
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

    onKeyPress(e) {
        // Only handle space/enter when in dialogue state
        if (this.game.gameState !== 'dialogue') return;
        
        // Don't advance if typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Space or Enter to advance dialogue
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            
            // Check if we're showing a system message
            const systemOverlay = this.view.querySelector('.system-overlay');
            if (systemOverlay) {
                // Remove system message and advance
                systemOverlay.remove();
                if (this.nodeIndex < this.currentNodes.length - 1) {
                    this.nodeIndex++;
                    this.renderNode();
                } else {
                    this.renderChoicesOrEnd();
                }
                return;
            }
            
            // If there are choices visible, don't auto-advance
            const scene = this.story.scenes[this.currentSceneId];
            if (scene && scene.choices && scene.choices.length > 0 && this.nodeIndex >= this.currentNodes.length - 1) {
                return;
            }
            
            // Advance dialogue
            if (this.nodeIndex < this.currentNodes.length - 1) {
                this.nodeIndex++;
                this.renderNode();
            } else if (!scene.choices || scene.choices.length === 0) {
                this.game.endDialogue();
            }
        }
    }

    getPortrait(speaker, emotion) {
        if (!speaker) return null;
        const key = speaker.trim().toLowerCase();
        const char = Object.values(this.story.characters).find(c => c.name.toLowerCase() === key) || this.story.characters[key];
        if (!char) return null;
        
        // Use specified emotion, fall back to 'speak' (default dialogue pose), then any available image
        if (emotion && char.images[emotion]) return char.images[emotion];
        return char.images.speak || char.images.normal || Object.values(char.images)[0] || null;
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

    updateSceneCharacters(scene) {
        // Remove existing scene characters
        const existingCharacters = this.view.querySelectorAll('.scene-character');
        existingCharacters.forEach(char => char.remove());

        // Add characters if dialogue involves them (for now, show Synthya and Kael in bar scenes)
        if (scene.background === 'broken_mug') {
            this.addSceneCharacter('synthya', 'player');
            this.addSceneCharacter('kael', 'other');
        }
    }

    addSceneCharacter(characterId, position) {
        const char = this.story.characters[characterId];
        if (!char) return;

        const charEl = document.createElement('div');
        charEl.className = `scene-character ${position}`;
        
        const img = document.createElement('img');
        img.src = char.images.normal || Object.values(char.images)[0];
        img.alt = char.name;
        img.style.height = '300px';
        img.style.width = 'auto';
        img.style.objectFit = 'contain';
        
        charEl.appendChild(img);
        this.view.appendChild(charEl);
    }

    highlightSpeakingCharacter(speaker) {
        // Remove speaking highlight from all characters
        const allChars = this.view.querySelectorAll('.scene-character');
        allChars.forEach(char => char.classList.remove('speaking'));

        // Highlight current speaker
        if (speaker && speaker.toLowerCase() === 'synthya') {
            const synthyaChar = this.view.querySelector('.scene-character.player');
            if (synthyaChar) synthyaChar.classList.add('speaking');
        } else if (speaker && speaker.toLowerCase() === 'kael') {
            const kaelChar = this.view.querySelector('.scene-character.other');
            if (kaelChar) kaelChar.classList.add('speaking');
        }
    }
}