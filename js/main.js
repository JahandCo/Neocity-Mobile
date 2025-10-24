// js/main.js
import { Game } from './Game.js';
import { ParticleAnimation } from './Particles.js';

// Wait for the DOM to be fully loaded before starting the game
window.addEventListener('DOMContentLoaded', () => {
    // Create a new instance of the Game, which will start everything
    new Game();

    // Initialize subtle particle background (kept lightweight)
    new ParticleAnimation('particle-canvas');
});