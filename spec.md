# Goods Sorting Puzzle Game

## Current State
New project with empty backend and no frontend implementation.

## Requested Changes (Diff)

### Add
- Multi-level color sorting puzzle game (ball-sort style)
- Tubes/containers that hold colored balls
- Tap-to-move mechanics: tap source tube to pick up top ball, tap destination tube to place it
- 10+ levels with increasing difficulty (more colors, fuller tubes, more tubes)
- Level complete screen with next level button, score/stars
- Undo button (undo last move)
- Restart button (reset current level)
- Visual feedback: animations for ball movement, tube completion glow, particle burst on level complete
- Level progress persistence via backend (current level, best scores)
- Backend stores level definitions and player progress

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Store player progress (current level reached), level definitions (tube configurations)
2. Frontend game engine:
   - Tube data structure: array of color stacks
   - Game state: tubes, selected tube index, move history for undo
   - Level definitions: hardcoded configs with varying difficulty
   - Tap-to-select/move logic with validation
   - Win detection: each tube has only one color (or is empty)
3. UI Components:
   - Game board with animated tubes and balls
   - HUD: level number, undo button, restart button
   - Level complete overlay with next level button and star rating
   - Level select screen
4. Animations: ball bounce on move, glow on completed tube, confetti/particles on level complete
