# Synthya Story Testing Checklist

## Pre-Testing Setup
- [ ] Open the game in a modern browser (Chrome, Firefox, Safari, Edge)
- [ ] Ensure JavaScript is enabled
- [ ] Open Developer Console (F12) to check for errors
- [ ] Test on both desktop and mobile viewports

## Menu & Navigation
- [ ] Menu displays with logo and buttons
- [ ] Story button is clickable
- [ ] Background particles animate smoothly
- [ ] Audio starts after user interaction

## Character Selection
- [ ] Character grid displays with Synthya card
- [ ] Character card is clickable
- [ ] Transitions to story view smoothly
- [ ] Back button returns to menu

## Story Flow Testing

### Scene 1: The Bait (Archive Intro)
- [ ] Archive background loads
- [ ] Synthya portrait displays correctly (280px width)
- [ ] System messages show with scan effect
- [ ] Glitch effect triggers on corruption message
- [ ] "Interface with the memory" button appears
- [ ] Optional "View KAEL - PROJECT ARCHIVE" choice works
- [ ] Hover sound effect plays on "Interface" button
- [ ] Choice selection advances story

### Scene 2: The Loop (Broken Mug Cafe)
- [ ] Cafe background loads
- [ ] Kael portrait appears
- [ ] Dialogue text is readable
- [ ] Three dialogue choices appear
- [ ] Flicker effect triggers on loop reset
- [ ] Scene transitions smoothly
- [ ] Music changes appropriately

### Scene 3: Puzzles (Free Roam)
- [ ] World canvas displays
- [ ] Synthya sprite appears (proper 362:535 ratio)
- [ ] Synthya moves on click
- [ ] Jukebox is clickable
- [ ] Neon sign is clickable
- [ ] Kael NPC is clickable
- [ ] Click detection works accurately

### Minigame 1: Jukebox (Audio Stitch)
- [ ] Overlay appears with dark backdrop
- [ ] Title and instructions display clearly
- [ ] 5 wave segments show with letter labels
- [ ] Segments are clickable
- [ ] Two-click swap works correctly
- [ ] Swap counter increments
- [ ] Status messages update
- [ ] Success detection works
- [ ] Completes and closes on success
- [ ] Returns to world view

### Minigame 2: Neon Sign (Pipes/Circuit)
- [ ] Overlay appears
- [ ] 3x3 grid displays
- [ ] Pipe pieces show visual connections
- [ ] Cells rotate on click
- [ ] Move counter increments
- [ ] Visual feedback on hover
- [ ] Reset button works
- [ ] Pathfinding detects solution
- [ ] Success message appears
- [ ] Completes and advances story

### Minigame 3: Kael Confrontation
- [ ] Kael dialogue appears
- [ ] Choice options display
- [ ] "You're not Kael" option works
- [ ] Glitch effects trigger on error
- [ ] Input prompt appears
- [ ] Text entry accepts "Project Sundown"
- [ ] Incorrect input shows shake animation
- [ ] Correct input advances to break scene

### Scene 4: Memory Break
- [ ] Screen shatters effect (would need implementation)
- [ ] Synthya returns to Archive
- [ ] Data-orb destabilizing message appears
- [ ] Advances to hack minigame

### Minigame 4: Data Hack (Simon/Hacking)
- [ ] Overlay appears
- [ ] 2x2 grid of colored pads displays
- [ ] Sequence plays automatically
- [ ] Pads light up with sound
- [ ] Status shows "Listen..." then "Your turn"
- [ ] Click input works
- [ ] Keyboard input works (Q, W, A, S)
- [ ] Wrong input replays sequence
- [ ] Attempt counter increments
- [ ] Correct sequence completes
- [ ] Advances to stealth

### Minigame 5: Stealth Escape
- [ ] Overlay appears
- [ ] Seeker scan beam animates
- [ ] Cover zone displays
- [ ] Move button shows green when safe
- [ ] Move button shows red when dangerous
- [ ] Moving when safe increments progress
- [ ] Moving when unsafe shows error and increments detection
- [ ] Progress shows X/3
- [ ] Completing 3 moves succeeds
- [ ] Success message displays
- [ ] Advances to chapter end

### Scene 5: Chapter End
- [ ] Three clues display:
  - [ ] "Echo and the Grid"
  - [ ] "Client ID: Vesper"
  - [ ] "GRID_SECTOR: NULL"
- [ ] Final dialogue displays
- [ ] "Return to The Grid" button appears
- [ ] Returns to archive intro (loop)

## Visual Effects Testing
- [ ] Glitch effect: RGB split, color shift, distortion
- [ ] Flicker effect: White flash with fade
- [ ] Scan effect: Moving scanlines with static
- [ ] Dialogue box: Gradients, borders, shadows
- [ ] Choice buttons: Hover animation, glow
- [ ] Primary buttons: Cyan gradient, shimmer
- [ ] Secondary buttons: Purple gradient
- [ ] Simon pads: Color highlighting works
- [ ] Pipe cells: Rotation animation smooth
- [ ] Wave segments: Selection highlighting
- [ ] Stealth: Border color changes

## Audio Testing
- [ ] Menu music plays and loops
- [ ] In-game music plays during world/dialogue
- [ ] Select sound plays on button clicks
- [ ] Alert sound plays on errors
- [ ] Wrong sound plays on failed inputs
- [ ] Whispers sound plays on hover (if implemented)
- [ ] Music transitions smoothly between scenes

## Responsive Testing
- [ ] Desktop (1920x1080): Full layout
- [ ] Tablet (768x1024): Adjusted layout
- [ ] Mobile (375x667): Single column, no portrait
- [ ] Minigames scale appropriately
- [ ] Text remains readable
- [ ] Buttons are touch-friendly
- [ ] No horizontal scrolling

## Performance Testing
- [ ] No JavaScript errors in console
- [ ] Animations run smoothly (60fps)
- [ ] Asset loading times acceptable
- [ ] Memory usage stable
- [ ] No memory leaks during gameplay

## Accessibility Testing
- [ ] Text is readable (contrast ratio)
- [ ] Buttons are clearly labeled
- [ ] Interactive elements have hover states
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader compatibility (optional)

## Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Bug Reporting Template
If you find issues, report using this format:

```
**Issue**: Brief description
**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected**: What should happen
**Actual**: What actually happens
**Browser**: Chrome 120 / Firefox 121 / etc.
**Device**: Desktop / Mobile / Tablet
**Console Errors**: Copy any errors from console
**Screenshot**: (if applicable)
```

## Known Limitations
- Seeker entity is abstracted (not full 3D visualization)
- Some animations may need performance tuning on older devices
- Keyboard navigation limited to minigames
- No save/load system yet

## Success Criteria
✓ All story scenes accessible
✓ All minigames completable
✓ No blocking errors
✓ Visual effects display correctly
✓ Audio plays appropriately
✓ Responsive on target devices
✓ Performance acceptable (>30fps)
