// js/Minigames.js
// Minimal minigames harness: shows an overlay with task description and a Complete button.

export class Minigames {
    static run(def, onComplete) {
        if (!def) return onComplete && onComplete();
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const content = document.createElement('div');
        content.className = 'overlay-content';
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        const cleanup = () => overlay.remove();

        // Build UI by type
        if (def.type === 'hacking_puzzle') {
            this.buildSimon(content, def, () => { cleanup(); onComplete && onComplete(); });
        } else if (def.type === 'memory_puzzle') {
            this.buildPipes(content, def, () => { cleanup(); onComplete && onComplete(); });
        } else if (def.type === 'audio_stitch') {
            this.buildAudioStitch(content, def, () => { cleanup(); onComplete && onComplete(); });
        } else if (def.type === 'stealth_escape') {
            this.buildStealth(content, def, () => { cleanup(); onComplete && onComplete(); });
        } else {
            // Fallback generic
            content.innerHTML = `
                <h2 style="margin-top:0;">Task</h2>
                <p><strong>Type:</strong> ${def.type || 'unknown'}</p>
                ${def.description ? `<p>${def.description}</p>` : ''}
                <div style="margin-top:16px; display:flex; gap:12px;">
                    <button id="minigame-complete" class="primary-btn">Complete</button>
                </div>
            `;
            content.querySelector('#minigame-complete').addEventListener('click', () => { cleanup(); onComplete && onComplete(); });
        }
    }

    // --- Hacking (Simon) ---
    static buildSimon(container, def, done) {
        const sfx = (p, vol=0.9) => { try { const a=new Audio(p); a.volume=vol; a.play(); } catch {} };
        const difficulty = (def.difficulty || 'medium').toLowerCase();
        const seqLen = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 6 : 4;
        const pads = [
            { id: 0, label: 'Q', color: '#00e5ff' },
            { id: 1, label: 'W', color: '#e811ff' },
            { id: 2, label: 'A', color: '#ffd400' },
            { id: 3, label: 'S', color: '#ffffff' }
        ];
        const sequence = Array.from({ length: seqLen }, () => Math.floor(Math.random() * 4));
        let index = 0;
        let playing = true;

        container.innerHTML = `
            <h2 style="margin-top:0;">${def.title || 'Cleanse the Audio'}</h2>
            ${def.description ? `<p>${def.description}</p>` : '<p>Repeat the sequence.</p>'}
            <div class="minigame-container">
                <div class="simon-grid">
                    ${pads.map((p,i)=>`<button class="simon-pad" data-id="${i}" style="--pad-color:${p.color}">${p.label}</button>`).join('')}
                </div>
                <div class="simon-controls">
                    <button id="simon-play" class="primary-btn">Play Sequence</button>
                    <span id="simon-status"></span>
                </div>
            </div>
        `;

        const statusEl = container.querySelector('#simon-status');
        const btnPlay = container.querySelector('#simon-play');
        const padEls = Array.from(container.querySelectorAll('.simon-pad'));

        const highlight = (el) => {
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 300);
        };

        const playSequence = () => {
            playing = true;
            statusEl.textContent = 'Listen...';
            let t = 0;
            sequence.forEach((id, idx) => {
                setTimeout(() => {
                    const el = padEls[id];
                    highlight(el);
                    if (idx === sequence.length - 1) {
                        setTimeout(() => { playing = false; index = 0; statusEl.textContent = 'Your turn'; }, 400);
                    }
                }, t);
                t += 600;
            });
        };

        btnPlay.addEventListener('click', () => { if (!playing) playSequence(); });
        // Autoplay once
        setTimeout(playSequence, 300);

        padEls.forEach((el) => {
            el.addEventListener('click', () => {
                if (playing) return;
                const id = parseInt(el.dataset.id, 10);
                highlight(el);
                if (id !== sequence[index]) {
                    statusEl.textContent = 'Wrong! Replaying...';
                    sfx('assets/audio/wrong.mp3');
                    setTimeout(playSequence, 800);
                    return;
                }
                index++;
                if (index >= sequence.length) {
                    statusEl.textContent = 'Cleansed!';
                    sfx('assets/audio/select.mp3');
                    setTimeout(done, 500);
                }
            });
        });
    }

    // --- Memory (Pipes rotation) ---
    static buildPipes(container, def, done) {
        const sfx = (p, vol=0.9) => { try { const a=new Audio(p); a.volume=vol; a.play(); } catch {} };
        // 3x3 grid with a predefined solvable layout
        const SIZE = 3;
        // Tile types define connectors as set of directions: N,E,S,W
        const TYPES = {
            straight: [['N','S'], ['E','W']], // will choose orientation by rotation
            elbow: [['N','E'], ['E','S'], ['S','W'], ['W','N']],
            tee: [['N','E','S'], ['E','S','W'], ['S','W','N'], ['W','N','E']],
            cross: [['N','E','S','W']]
        };

        // Predefined board: path from left middle (0,1) to right middle (2,1)
        const board = [
            [ { type:'elbow', rot:1 }, { type:'straight', rot:0 }, { type:'elbow', rot:2 } ],
            [ { type:'tee', rot:0 },    { type:'straight', rot:1 }, { type:'tee', rot:2 } ],
            [ { type:'elbow', rot:0 }, { type:'straight', rot:0 }, { type:'elbow', rot:3 } ]
        ];
        // Randomize initial rotations for challenge
        board.forEach(row => row.forEach(t => { t.rot = Math.floor(Math.random()*4)% (TYPES[t.type].length); }));

        container.innerHTML = `
            <h2 style="margin-top:0;">${def.title || 'Restore the Circuit'}</h2>
            ${def.description ? `<p>${def.description}</p>` : '<p>Rotate pieces to connect power from left to right.</p>'}
            <div class="minigame-container">
                <div class="pipe-grid" style="--size:${SIZE}"></div>
                <div class="pipe-controls">
                    <button id="pipe-reset" class="secondary-btn">Reset</button>
                    <span id="pipe-status"></span>
                </div>
            </div>
        `;

        const gridEl = container.querySelector('.pipe-grid');
        const statusEl = container.querySelector('#pipe-status');
        const resetBtn = container.querySelector('#pipe-reset');

        const connectorsFor = (tile) => {
            const variants = TYPES[tile.type];
            const idx = tile.rot % variants.length;
            return variants[idx];
        };

        const opposite = { N:'S', E:'W', S:'N', W:'E' };

        const render = () => {
            gridEl.innerHTML = '';
            for (let y=0; y<SIZE; y++) {
                for (let x=0; x<SIZE; x++) {
                    const t = board[y][x];
                    const cell = document.createElement('button');
                    cell.className = 'pipe-cell';
                    cell.dataset.x = x; cell.dataset.y = y;
                    // Visual: draw connectors via CSS vars
                    const conns = connectorsFor(t);
                    cell.style.setProperty('--n', conns.includes('N') ? '1' : '0');
                    cell.style.setProperty('--e', conns.includes('E') ? '1' : '0');
                    cell.style.setProperty('--s', conns.includes('S') ? '1' : '0');
                    cell.style.setProperty('--w', conns.includes('W') ? '1' : '0');
                    gridEl.appendChild(cell);
                }
            }
        };

        const inBounds = (x,y)=> x>=0 && y>=0 && x<SIZE && y<SIZE;
        const dirVec = { N:[0,-1], E:[1,0], S:[0,1], W:[-1,0] };

        const solved = () => {
            // BFS from source (0,1) following matching connectors to sink (2,1)
            const src = {x:0,y:1};
            const sink = {x:2,y:1};
            const q=[src];
            const seen=new Set(['0,1']);
            while(q.length){
                const {x,y}=q.shift();
                if (x===sink.x && y===sink.y) return true;
                const conns = connectorsFor(board[y][x]);
                for (const d of conns){
                    const [dx,dy]=dirVec[d];
                    const nx=x+dx, ny=y+dy;
                    if(!inBounds(nx,ny)) continue;
                    const nConns = connectorsFor(board[ny][nx]);
                    if(!nConns.includes(opposite[d])) continue; // must connect back
                    const key=`${nx},${ny}`;
                    if(seen.has(key)) continue;
                    seen.add(key); q.push({x:nx,y:ny});
                }
            }
            return false;
        };

        const onRotate = (x,y)=>{
            const t=board[y][x];
            t.rot = (t.rot+1) % (TYPES[t.type].length);
            render();
            if (solved()) {
                statusEl.textContent = 'Circuit Restored!';
                sfx('assets/audio/select.mp3');
                setTimeout(done, 500);
            }
        };

        gridEl.addEventListener('click', (e)=>{
            const cell = e.target.closest('.pipe-cell');
            if(!cell) return;
            const x=parseInt(cell.dataset.x,10), y=parseInt(cell.dataset.y,10);
            onRotate(x,y);
        });

        resetBtn.addEventListener('click', ()=>{
            board.forEach(row => row.forEach(t => { t.rot = Math.floor(Math.random()*4)% (TYPES[t.type].length); }));
            statusEl.textContent='';
            render();
            sfx('assets/audio/select.mp3', 0.6);
        });

        render();
    }

    // --- Audio Stitch (wave reorder) ---
    static buildAudioStitch(container, def, done) {
        const sfx = (p, vol=0.9) => { try { const a=new Audio(p); a.volume=vol; a.play(); } catch {} };
        const SEGMENTS = 5;
        const order = Array.from({length: SEGMENTS}, (_,i)=>i);
        // Shuffle
        for (let i=order.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [order[i],order[j]]=[order[j],order[i]]; }
        let first = null;
        container.innerHTML = `
            <h2 style="margin-top:0;">${def.title || 'Stitch the Audio'}</h2>
            ${def.description ? `<p>${def.description}</p>` : '<p>Reorder the wave segments into a smooth line.</p>'}
            <div class="minigame-container">
                <div class="wave-grid"></div>
                <div class="wave-controls"><span id="wave-status"></span></div>
            </div>
        `;
        const grid = container.querySelector('.wave-grid');
        const status = container.querySelector('#wave-status');
        const render = () => {
            grid.innerHTML='';
            order.forEach((idx,pos)=>{
                const seg = document.createElement('button');
                seg.className = 'wave-segment';
                seg.dataset.pos = String(pos);
                seg.textContent = '';
                seg.style.setProperty('--phase', String(idx));
                seg.addEventListener('click', ()=>{
                    if (first===null) { first = pos; seg.classList.add('selected'); return; }
                    if (first===pos) { seg.classList.remove('selected'); first=null; return; }
                    const other = grid.querySelector(`.wave-segment[data-pos="${first}"]`);
                    if (other) other.classList.remove('selected');
                    [order[first], order[pos]] = [order[pos], order[first]];
                    first=null; render();
                    if (order.every((v,i)=>v===i)) { status.textContent='Audio Restored!'; sfx('assets/audio/select.mp3'); setTimeout(done, 500); }
                });
                grid.appendChild(seg);
            });
        };
        render();
    }

    // --- Stealth Escape (simple timing) ---
    static buildStealth(container, def, done) {
        const sfx = (p, vol=0.9) => { try { const a=new Audio(p); a.volume=vol; a.play(); } catch {} };
        const stepsRequired = 3;
        let steps = 0;
        let safe = false;
        let timer=null;
        container.innerHTML = `
            <h2 style="margin-top:0;">${def.title || 'Evade the Seeker'}</h2>
            ${def.description ? `<p>${def.description}</p>` : '<p>Move only when the scanner is away.</p>'}
            <div class="minigame-container stealth-area">
                <div class="seeker"></div>
                <div class="cover"></div>
                <button id="stealth-move" class="primary-btn">Move</button>
                <div id="stealth-status"></div>
            </div>
        `;
        const seeker = container.querySelector('.seeker');
        const moveBtn = container.querySelector('#stealth-move');
        const status = container.querySelector('#stealth-status');
        const loop = () => {
            const period = 2000; // 2s sweep
            const t = Date.now() % period;
            // safe when t in middle 600-1400ms
            safe = (t>600 && t<1400);
            seeker.style.setProperty('--phase', String(t/period));
            timer = requestAnimationFrame(loop);
        };
        loop();
        moveBtn.addEventListener('click', ()=>{
            if (safe) {
                steps++;
                status.textContent = `Moved (${steps}/${stepsRequired})`;
                sfx('assets/audio/select.mp3', 0.7);
                if (steps>=stepsRequired) { cancelAnimationFrame(timer); setTimeout(()=>{ sfx('assets/audio/select.mp3'); done(); }, 300); }
            } else {
                status.textContent = 'Detected! Wait for the scan to pass.';
                sfx('assets/audio/alert.mp3', 0.9);
            }
        });
    }
}
