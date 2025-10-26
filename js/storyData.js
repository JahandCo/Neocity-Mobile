// Synthya's Story - Chapter 1: The Memory-Loop
// Operation: Echo-Trap - A story about escaping a memory trap in The Grid

export const synthyaStory = {
    title: "Chapter 1: The Memory-Loop",
    
    // Story scenes with dialogue, choices, and events
    scenes: {
        kael_project_archive: {
            background: "archive",
            music: "assets/audio/menu.mp3",
            dialogue: [
                { speaker: "System", text: "Optional memory: KAEL - PROJECT ARCHIVE", effects: ["scan"] },
                { speaker: "Kael", emotion: "happy", text: "I can't believe 'Project Sundown' actually worked! To the next one, 'Thya.", effects: null }
            ],
            choices: [ { text: "Back", nextScene: "archive_intro" } ]
        },
        // Scene 1: The Bait - Synthya's Archive
        archive_intro: {
            background: "archive",
            music: "assets/audio/menu.mp3",
            dialogue: [
                {
                    speaker: "System",
                    emotion: null,
                    text: "LOCATION: Synthya's Data-Den - 'The Archive'",
                    effects: ["scan"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Another quiet cycle in the Archive. These data-fragments... so many memories, waiting to be restored.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "This corruption... it feels... deliberate. Most memory-frags are chaotic. This one is... contained.",
                    effects: ["glitch"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "INCOMING TRANSMISSION: New client request detected.",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "A new client? This late in the cycle? Let me see...",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "CLIENT ID: [ANONYMOUS] | AUDIO: [SCRAMBLED] | REQUEST: Memory fragmentation causing severe pain. Immediate assistance required.",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "The data packet... it's different. That pulsating glitch pattern... I've never seen corruption like this before.",
                    effects: ["flicker"]
                }
            ],
            choices: [
                { text: "View 'KAEL - PROJECT ARCHIVE' (Optional)", nextScene: "kael_project_archive" },
                { text: "Interface with the memory", nextScene: "memory_trap", hoverSfx: "assets/audio/whispers.mp3", hoverHint: "It sounds like rain... or a promise." },
                { text: "Decline the client (Run diagnostics first)", nextScene: "cannot_decline" }
            ]
        },
        
        cannot_decline: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "sad",
                    text: "I should run a diagnostic first... but someone is in pain. I can't just leave them suffering.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "I'm a Memory Weaver. This is what I do. I have to help them.",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Interface with the memory",
                    nextScene: "memory_trap"
                }
            ]
        },
        
        memory_trap: {
            background: "broken_mug",
            music: "assets/audio/game.mp3",
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Initiating interface protocol...",
                    effects: ["scan"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "CONNECTION ESTABLISHED... LOADING MEMORY STREAM...",
                    effects: ["glitch", "flicker"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "*LOCK DETECTED* >>> TRAP ACTIVATED <<<",
                    effects: ["glitch"]
                }
            ],
            choices: [ { text: "Continue...", nextScene: "loop_attempt_1" } ]
        },
        
        // Scene 2: The Loop - The Broken Mug Cafe (Attempt 1)
        loop_attempt_1: {
            background: "broken_mug",
            music: "assets/audio/menu.mp3",
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "surprise",
                    text: "What... where am I?",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "The Broken Mug? But I was just in my Archive... The warm lighting, the jazz music... this feels so real.",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You made it. Was worried you'd get lost in the rain.",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "*He raises his cup* To the next project.",
                    effects: null
                }
            ],
            choices: [
                { text: "The next project? What...?", nextScene: "loop_dialogue_1" },
                { text: "Where am I?", nextScene: "loop_dialogue_2" },
                { text: "...Kael?", nextScene: "loop_dialogue_3" }
            ]
        },
        
        loop_dialogue_1: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You're always in your own head, 'Thya.",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "*He takes a sip and chuckles*",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "*The world flickers violently*",
                    effects: ["flicker"]
                }
            ],
            choices: [ { text: "Continue", nextScene: "loop_attempt_2" } ]
        },
        
        loop_dialogue_2: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You're always in your own head, 'Thya. Still at The Broken Mug, where else would we be?",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "*He takes a sip and chuckles*",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "*The world flickers violently*",
                    effects: ["flicker"]
                }
            ],
            choices: [ { text: "Continue", nextScene: "loop_attempt_3" } ]
        },
        
        loop_dialogue_3: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You're always in your own head, 'Thya. Of course it's me.",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "*He takes a sip and chuckles*",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "*The world flickers violently*",
                    effects: ["flicker"]
                }
            ],
            choices: [ { text: "Continue", nextScene: "loop_reset" } ]
        },
        
        loop_attempt_2: {
            background: "broken_mug",
            music: "assets/audio/menu2.mp3",
            dialogue: [
                { speaker: "Synthya", emotion: "speak", text: "No. He already said that. This is a loop.", effects: ["flicker"] },
                { speaker: "Kael", emotion: "speak", text: "You made it. Was worried you'd get lost in the rain.", effects: null },
                { speaker: "Kael", emotion: "speak", text: "*His smile looks fixed* To the next project.", effects: ["flicker"] }
            ],
            choices: [ { text: "Continue", nextScene: "loop_dialogue_2" } ]
        },

        loop_attempt_3: {
            background: "broken_mug",
            music: "assets/audio/game.mp3",
            dialogue: [
                { speaker: "Synthya", emotion: "sad", text: "The jazz is skipping... the rain is louder.", effects: ["glitch"] },
                { speaker: "Kael", emotion: "happy", text: "You made it. Was worried you'd get lost in the rain.", effects: ["glitch"] }
            ],
            choices: [ { text: "Continue", nextScene: "loop_dialogue_3" } ]
        },

        loop_reset: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "surprise",
                    text: "*I blink* Wait... what just...?",
                    effects: ["flicker"]
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You made it. Was worried you'd get lost in the rain.",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "*He raises his cup* To the next project.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "surprise",
                    text: "This... this is the same conversation. We're in a loop!",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "NEW OBJECTIVE: Find the anomaly. Break the loop.",
                    effects: ["scan"]
                }
            ],
            choices: [
                {
                    text: "Investigate the environment",
                    nextScene: "escape_room_hub"
                }
            ]
        },
        
        // Scene 3: The Puzzles - Escape Room Hub
        escape_room_hub: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "I need to look around. There has to be something wrong here... an anomaly I can exploit.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "The jukebox is skipping, the neon sign is glitching... and Kael just keeps repeating himself.",
                    effects: null
                }
            ],
            // No choices: player must free-roam and interact with anomalies
        },
        
        // Puzzle 1: The Glitched Jukebox
        puzzle_jukebox: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "The jukebox... the jazz track is stuck. Playing the same three notes over and over.",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "CORRUPTED AUDIO STREAM DETECTED. Manual repair required.",
                    effects: ["glitch"]
                },
                { speaker: "Synthya", emotion: "speak", text: "I can fix this. Stitch the broken soundwave back together...", effects: null }
            ],
            choices: [
                { text: "Start the audio stitch", nextScene: "jukebox_minigame", minigame: "audio_stitch" }
            ]
        },
        
        jukebox_minigame: {
            background: "broken_mug",
            music: null,
            minigame: { type: "audio_stitch", description: "Reorder wave segments to repair the song", difficulty: "medium", onComplete: "jukebox_solved" }
        },
        
        jukebox_solved: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "System",
                    emotion: null,
                    text: "AUDIO STREAM RESTORED. Playing: 'Echo and the Grid' by The Neon Collective.",
                    effects: ["scan"]
                },
                {
                    speaker: "Synthya",
                    emotion: "happy",
                    text: "There! The music is clean now. And look... that poster on the wall stopped glitching.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "'Echo and the Grid'... That's one of Echo's bands. This could be a clue about who trapped me here.",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Continue investigating",
                    nextScene: "escape_room_hub_2"
                }
            ]
        },
        
        escape_room_hub_2: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "One anomaly fixed. But I'm still trapped. What else can I investigate?",
                    effects: null
                }
            ],
            // No choices: continue free-roam until all anomalies are solved
        },
        
        // Puzzle 2: The Broken Sign
        puzzle_sign: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "The neon sign behind the counter... 'The Broken Mug'. The 'O' in 'Broken' is flickering badly.",
                    effects: ["flicker"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "CIRCUIT MALFUNCTION DETECTED. Power routing compromised.",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "A circuit puzzle. I need to reconnect the power flow to stabilize the sign.",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Solve the circuit puzzle",
                    nextScene: "sign_minigame",
                    minigame: "memory_puzzle"
                }
            ]
        },
        
        sign_minigame: {
            background: "broken_mug",
            music: null,
            minigame: {
                type: "memory_puzzle",
                description: "Rotate circuit pieces to connect the power nodes",
                difficulty: "medium",
                onComplete: "sign_solved"
            }
        },
        
        sign_solved: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "System",
                    emotion: null,
                    text: "CIRCUIT REPAIRED. Power flow restored.",
                    effects: ["scan"]
                },
                {
                    speaker: "Synthya",
                    emotion: "happy",
                    text: "Perfect! The sign is stable now. And the terminal at the counter just activated!",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "ACCESSING CUSTOMER LOG... Only one entry found: CLIENT ID: Vesper",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "surprise",
                    text: "Vesper? The Ghost Runner was here? But this is a memory... why would Vesper be logged?",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Unless... unless this trap was set by someone who knows both Kael and Vesper. Someone close to us.",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Confront Kael",
                    nextScene: "puzzle_kael_final"
                }
            ]
        },
        
        puzzle_kael_talk: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You made it. Was worried you'd get lost in the rain.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Still the same line. I need to fix the anomalies first before I can break through to him.",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Go back",
                    nextScene: "escape_room_hub"
                }
            ]
        },
        
        // Puzzle 3: Confronting Kael
        puzzle_kael_final: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "I've fixed the jukebox and the sign. The loop is weakening. Time to confront this... memory.",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "You made it. Was worried you'd get lost in the rain.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "...",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "You're not Kael.",
                    nextScene: "kael_confrontation"
                },
                {
                    text: "What was our first project together?",
                    nextScene: "kael_question"
                }
            ]
        },
        
        kael_question: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "What... what do you mean? Of course I'm Kael.",
                    effects: ["flicker"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Prove it. What was our first project?",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "PROJECT... DOES NOT... COMPUTE...",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "You don't know, do you? Because you're not really Kael. You're just a copied memory... and an incomplete one.",
                    effects: null
                }
            ],
            choices: [ { text: "Continue", nextScene: "kael_override" } ]
        },
        
        kael_confrontation: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "What... what do you mean? Of course I am.",
                    effects: ["flicker"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "No. You're a fabricated memory. Whoever trapped me here used Kael's image, but they don't know him. Not really.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Prove it. What was our first project together?",
                    effects: null
                },
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "PROJECT... DOES NOT... COMPUTE...",
                    effects: ["glitch"]
                }
            ],
            choices: [ { text: "Continue", nextScene: "kael_override" } ]
        },
        
        // Input override puzzle before breaking free
        kael_override: {
            background: "broken_mug",
            music: null,
            dialogue: [ { speaker: "Synthya", emotion: "speak", text: "Prove it. What was our first project?", effects: ["glitch"] } ],
            inputPrompt: "[Override: What was your first project?]",
            inputAnswer: "Project Sundown",
            nextOnCorrect: "memory_break"
        },

        // Scene 4: Breaking Free
        memory_break: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "Kael",
                    emotion: "speak",
                    text: "ERROR... ERROR... MEMORY INTEGRITY COMPROMISED...",
                    effects: ["glitch", "flicker"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "*The 'Kael' memory's face begins to distort, colors shifting to crimson and purple*",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "surprise",
                    text: "The trap is breaking! The memory can't hold together anymore!",
                    effects: ["flicker"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "*SHATTERING SOUND* The world fractures like glass...",
                    effects: ["glitch"]
                }
            ],
            choices: [
                {
                    text: "Escape!",
                    nextScene: "archive_return"
                }
            ]
        },
        
        // Scene 5: The Clue
        archive_return: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "System",
                    emotion: null,
                    text: "*CRASH* Synthya is thrown back into her Archive, landing hard on the digital floor.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "sad",
                    text: "*Breathing heavily* I... I made it out. That was too close.",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "WARNING: The corrupted data-orb is destabilizing. Self-deletion protocol initiated by remote source.",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "surprise",
                    text: "No! I need that data! Whoever set this trap is trying to cover their tracks!",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Stabilize the data before it's lost!",
                    nextScene: "data_hack",
                    minigame: "hacking_puzzle"
                }
            ]
        },
        
        data_hack: {
            background: "broken_mug",
            music: null,
            minigame: {
                type: "hacking_puzzle",
                description: "Hack the data-orb before it self-deletes!",
                difficulty: "hard",
                onComplete: "stealth_escape"
            }
        },
        
        // Stealth coda before chapter end
        stealth_escape: {
            background: "archive",
            music: "assets/audio/game.mp3",
            minigame: {
                type: "stealth_escape",
                description: "Move from cover only when the scanner is away",
                onComplete: "chapter_end"
            }
        },

        chapter_end: {
            background: "broken_mug",
            music: null,
            dialogue: [
                {
                    speaker: "System",
                    emotion: null,
                    text: "DATA STABILIZED. Extracting trace information...",
                    effects: ["scan"]
                },
                {
                    speaker: "Synthya",
                    emotion: "happy",
                    text: "Got it! Just in time!",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "EXTRACTION COMPLETE. Single code fragment recovered:",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "TRACE_ORIGIN: GRID_SECTOR: NULL",
                    effects: ["glitch"]
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Grid Sector: NULL... That's the restricted zone. The place where deleted data goes to die.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Someone in the NULL sector set this trap for me. But why? What are they hiding?",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "speak",
                    text: "Echo was mentioned... Vesper was in the logs... and they used Kael's image. This is connected to people I know.",
                    effects: null
                },
                {
                    speaker: "Synthya",
                    emotion: "sad",
                    text: "I have to investigate the NULL sector. Whatever's there... someone doesn't want me to find it.",
                    effects: null
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: ">>> CHAPTER 1 COMPLETE <<<",
                    effects: ["scan"]
                },
                {
                    speaker: "System",
                    emotion: null,
                    text: "To be continued...",
                    effects: null
                }
            ],
            choices: [
                {
                    text: "Return to The Grid",
                    nextScene: "archive_intro"
                }
            ]
        }
    },
    
    // Character definitions
    characters: {
        synthya: {
            name: "Synthya",
            images: {
                speak: "assets/images/characters/synthya/poses/synthya-speak.png",
                happy: "assets/images/characters/synthya/poses/synthya-happy.png",
                sad: "assets/images/characters/synthya/poses/synthya-sad.png",
                surprise: "assets/images/characters/synthya/poses/synthya-surprise.png"
            }
        },
        kael: {
            name: "Kael",
            images: {
                speak: "assets/images/characters/kael/poses/kael-speak.png",
                happy: "assets/images/characters/kael/poses/kael-laugh-glitch.png",
                sad: "assets/images/characters/kael/poses/kael-sad.png",
                surprise: "assets/images/characters/kael/poses/kael-surprised.png",
                think: "assets/images/characters/kael/poses/kael-think.png",
                wave: "assets/images/characters/kael/poses/kael-wave.png",
                glitch: "assets/images/characters/kael/poses/kael-glitch.png"
            }
        },
        bartender: {
            name: "Bartender",
            images: {
                speak: "assets/images/characters/synthya/poses/synthya-speak.png" // Placeholder
            }
        }
    },
    
    // Available visual effects
    effects: {
        flicker: {
            type: "screen_flicker",
            duration: 500,
            intensity: 0.3
        },
        glitch: {
            type: "glitch",
            duration: 800,
            intensity: 0.5
        },
        scan: {
            type: "scan_lines",
            duration: 2000,
            color: "#00ffff"
        }
    }
};

// ESM export above; CommonJS export omitted for browser usage
