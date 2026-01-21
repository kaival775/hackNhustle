/**
 * LetterCheckpoints.ts
 * Sequential tracing checkpoints for A-Z uppercase letters
 * Canvas size: 400x500
 * All points on medial axis (centerline) following standard stroke order
 */

interface Checkpoint {
  x: number;
  y: number;
}

export const LETTER_CHECKPOINTS: Record<string, Checkpoint[]> = {
  // A: Left diagonal, right diagonal, crossbar
  A: [
    { x: 200, y: 80 },   // 1. Top peak
    { x: 150, y: 180 },  // 2. Mid-left
    { x: 100, y: 280 },  // 3. Bottom-left
    { x: 200, y: 80 },   // 4. Back to top
    { x: 250, y: 180 },  // 5. Mid-right
    { x: 300, y: 280 },  // 6. Bottom-right
    { x: 130, y: 200 },  // 7. Crossbar left
    { x: 270, y: 200 }   // 8. Crossbar right
  ],

  // B: Vertical line, top bump, bottom bump
  B: [
    { x: 120, y: 80 },   // 1. Top of vertical
    { x: 120, y: 180 },  // 2. Mid vertical
    { x: 120, y: 280 },  // 3. Bottom vertical
    { x: 120, y: 80 },   // 4. Back to top
    { x: 200, y: 80 },   // 5. Top bump right
    { x: 240, y: 130 },  // 6. Top bump curve
    { x: 120, y: 180 },  // 7. Back to middle
    { x: 220, y: 180 },  // 8. Bottom bump right
    { x: 260, y: 230 },  // 9. Bottom bump curve
    { x: 120, y: 280 }   // 10. Back to bottom
  ],

  // C: Single curved stroke (counter-clockwise from top-right)
  C: [
    { x: 280, y: 100 },  // 1. Top right
    { x: 200, y: 80 },   // 2. Top center
    { x: 120, y: 100 },  // 3. Top left
    { x: 100, y: 180 },  // 4. Mid left
    { x: 120, y: 260 },  // 5. Bottom left
    { x: 200, y: 280 },  // 6. Bottom center
    { x: 280, y: 260 }   // 7. Bottom right
  ],

  // D: Vertical line, curved right side
  D: [
    { x: 120, y: 80 },   // 1. Top vertical
    { x: 120, y: 180 },  // 2. Mid vertical
    { x: 120, y: 280 },  // 3. Bottom vertical
    { x: 120, y: 80 },   // 4. Back to top
    { x: 220, y: 80 },   // 5. Top right
    { x: 280, y: 130 },  // 6. Right curve top
    { x: 280, y: 230 },  // 7. Right curve bottom
    { x: 220, y: 280 },  // 8. Bottom right
    { x: 120, y: 280 }   // 9. Back to bottom
  ],

  // E: Vertical line, top horizontal, middle horizontal, bottom horizontal
  E: [
    { x: 120, y: 80 },   // 1. Top vertical
    { x: 120, y: 180 },  // 2. Mid vertical
    { x: 120, y: 280 },  // 3. Bottom vertical
    { x: 120, y: 80 },   // 4. Top horizontal start
    { x: 280, y: 80 },   // 5. Top horizontal end
    { x: 120, y: 180 },  // 6. Mid horizontal start
    { x: 260, y: 180 },  // 7. Mid horizontal end
    { x: 120, y: 280 },  // 8. Bottom horizontal start
    { x: 280, y: 280 }   // 9. Bottom horizontal end
  ],

  // F: Vertical line, top horizontal, middle horizontal
  F: [
    { x: 120, y: 80 },   // 1. Top vertical
    { x: 120, y: 180 },  // 2. Mid vertical
    { x: 120, y: 280 },  // 3. Bottom vertical
    { x: 120, y: 80 },   // 4. Top horizontal start
    { x: 280, y: 80 },   // 5. Top horizontal end
    { x: 120, y: 180 },  // 6. Mid horizontal start
    { x: 260, y: 180 }   // 7. Mid horizontal end
  ],

  // G: C shape with horizontal bar
  G: [
    { x: 280, y: 100 },  // 1. Top right
    { x: 200, y: 80 },   // 2. Top center
    { x: 120, y: 100 },  // 3. Top left
    { x: 100, y: 180 },  // 4. Mid left
    { x: 120, y: 260 },  // 5. Bottom left
    { x: 200, y: 280 },  // 6. Bottom center
    { x: 280, y: 260 },  // 7. Bottom right
    { x: 280, y: 180 },  // 8. Mid right
    { x: 220, y: 180 }   // 9. Horizontal bar
  ],

  // H: Left vertical, right vertical, crossbar
  H: [
    { x: 120, y: 80 },   // 1. Left vertical top
    { x: 120, y: 180 },  // 2. Left vertical mid
    { x: 120, y: 280 },  // 3. Left vertical bottom
    { x: 280, y: 80 },   // 4. Right vertical top
    { x: 280, y: 180 },  // 5. Right vertical mid
    { x: 280, y: 280 },  // 6. Right vertical bottom
    { x: 120, y: 180 },  // 7. Crossbar left
    { x: 280, y: 180 }   // 8. Crossbar right
  ],

  // I: Top horizontal, vertical, bottom horizontal
  I: [
    { x: 140, y: 80 },   // 1. Top horizontal left
    { x: 260, y: 80 },   // 2. Top horizontal right
    { x: 200, y: 80 },   // 3. Vertical top
    { x: 200, y: 180 },  // 4. Vertical mid
    { x: 200, y: 280 },  // 5. Vertical bottom
    { x: 140, y: 280 },  // 6. Bottom horizontal left
    { x: 260, y: 280 }   // 7. Bottom horizontal right
  ],

  // J: Vertical with curve at bottom
  J: [
    { x: 240, y: 80 },   // 1. Top
    { x: 240, y: 180 },  // 2. Mid
    { x: 240, y: 240 },  // 3. Before curve
    { x: 200, y: 270 },  // 4. Curve bottom
    { x: 140, y: 250 },  // 5. Curve left
    { x: 120, y: 220 }   // 6. Hook end
  ],

  // K: Vertical, diagonal down, diagonal up
  K: [
    { x: 120, y: 80 },   // 1. Vertical top
    { x: 120, y: 180 },  // 2. Vertical mid
    { x: 120, y: 280 },  // 3. Vertical bottom
    { x: 280, y: 80 },   // 4. Top diagonal start
    { x: 200, y: 140 },  // 5. Diagonal mid-top
    { x: 140, y: 180 },  // 6. Diagonal meet
    { x: 200, y: 220 },  // 7. Diagonal mid-bottom
    { x: 280, y: 280 }   // 8. Bottom diagonal end
  ],

  // L: Vertical, horizontal
  L: [
    { x: 120, y: 80 },   // 1. Vertical top
    { x: 120, y: 180 },  // 2. Vertical mid
    { x: 120, y: 280 },  // 3. Vertical bottom
    { x: 200, y: 280 },  // 4. Horizontal mid
    { x: 280, y: 280 }   // 5. Horizontal end
  ],

  // M: Down, up, down, up
  M: [
    { x: 100, y: 280 },  // 1. Left bottom
    { x: 100, y: 180 },  // 2. Left mid
    { x: 100, y: 80 },   // 3. Left top
    { x: 150, y: 140 },  // 4. First valley
    { x: 200, y: 180 },  // 5. Center peak
    { x: 250, y: 140 },  // 6. Second valley
    { x: 300, y: 80 },   // 7. Right top
    { x: 300, y: 180 },  // 8. Right mid
    { x: 300, y: 280 }   // 9. Right bottom
  ],

  // N: Down, diagonal up, down
  N: [
    { x: 120, y: 280 },  // 1. Left bottom
    { x: 120, y: 180 },  // 2. Left mid
    { x: 120, y: 80 },   // 3. Left top
    { x: 170, y: 130 },  // 4. Diagonal start
    { x: 230, y: 200 },  // 5. Diagonal mid
    { x: 280, y: 260 },  // 6. Diagonal end
    { x: 280, y: 180 },  // 7. Right mid
    { x: 280, y: 80 }    // 8. Right top
  ],

  // O: Oval counter-clockwise from top
  O: [
    { x: 200, y: 80 },   // 1. Top
    { x: 120, y: 100 },  // 2. Top-left
    { x: 100, y: 180 },  // 3. Mid-left
    { x: 120, y: 260 },  // 4. Bottom-left
    { x: 200, y: 280 },  // 5. Bottom
    { x: 280, y: 260 },  // 6. Bottom-right
    { x: 300, y: 180 },  // 7. Mid-right
    { x: 280, y: 100 }   // 8. Top-right
  ],

  // P: Vertical, top loop
  P: [
    { x: 120, y: 80 },   // 1. Vertical top
    { x: 120, y: 180 },  // 2. Vertical mid
    { x: 120, y: 280 },  // 3. Vertical bottom
    { x: 120, y: 80 },   // 4. Loop start
    { x: 220, y: 80 },   // 5. Loop top-right
    { x: 260, y: 130 },  // 6. Loop right
    { x: 220, y: 180 },  // 7. Loop bottom-right
    { x: 120, y: 180 }   // 8. Loop end
  ],

  // Q: O with tail
  Q: [
    { x: 200, y: 80 },   // 1. Top
    { x: 120, y: 100 },  // 2. Top-left
    { x: 100, y: 180 },  // 3. Mid-left
    { x: 120, y: 260 },  // 4. Bottom-left
    { x: 200, y: 280 },  // 5. Bottom
    { x: 280, y: 260 },  // 6. Bottom-right
    { x: 300, y: 180 },  // 7. Mid-right
    { x: 280, y: 100 },  // 8. Top-right
    { x: 240, y: 240 },  // 9. Tail start
    { x: 300, y: 300 }   // 10. Tail end
  ],

  // R: Vertical, top loop, diagonal leg
  R: [
    { x: 120, y: 80 },   // 1. Vertical top
    { x: 120, y: 180 },  // 2. Vertical mid
    { x: 120, y: 280 },  // 3. Vertical bottom
    { x: 120, y: 80 },   // 4. Loop start
    { x: 220, y: 80 },   // 5. Loop top-right
    { x: 260, y: 130 },  // 6. Loop right
    { x: 220, y: 180 },  // 7. Loop bottom-right
    { x: 120, y: 180 },  // 8. Loop end
    { x: 180, y: 220 },  // 9. Leg mid
    { x: 280, y: 280 }   // 10. Leg end
  ],

  // S: Curved S shape
  S: [
    { x: 260, y: 110 },  // 1. Top-right
    { x: 200, y: 80 },   // 2. Top
    { x: 140, y: 110 },  // 3. Top-left
    { x: 160, y: 150 },  // 4. Upper curve
    { x: 200, y: 180 },  // 5. Center
    { x: 240, y: 210 },  // 6. Lower curve
    { x: 260, y: 250 },  // 7. Bottom-right
    { x: 200, y: 280 },  // 8. Bottom
    { x: 140, y: 250 }   // 9. Bottom-left
  ],

  // T: Horizontal top, vertical down
  T: [
    { x: 100, y: 80 },   // 1. Top horizontal left
    { x: 200, y: 80 },   // 2. Top horizontal center
    { x: 300, y: 80 },   // 3. Top horizontal right
    { x: 200, y: 80 },   // 4. Vertical top
    { x: 200, y: 180 },  // 5. Vertical mid
    { x: 200, y: 280 }   // 6. Vertical bottom
  ],

  // U: Down, curve, up
  U: [
    { x: 120, y: 80 },   // 1. Left top
    { x: 120, y: 180 },  // 2. Left mid
    { x: 120, y: 240 },  // 3. Left before curve
    { x: 160, y: 270 },  // 4. Bottom-left curve
    { x: 200, y: 280 },  // 5. Bottom center
    { x: 240, y: 270 },  // 6. Bottom-right curve
    { x: 280, y: 240 },  // 7. Right before curve
    { x: 280, y: 180 },  // 8. Right mid
    { x: 280, y: 80 }    // 9. Right top
  ],

  // V: Diagonal down, diagonal up
  V: [
    { x: 100, y: 80 },   // 1. Left top
    { x: 140, y: 160 },  // 2. Left mid
    { x: 180, y: 240 },  // 3. Left bottom
    { x: 200, y: 280 },  // 4. Bottom point
    { x: 220, y: 240 },  // 5. Right bottom
    { x: 260, y: 160 },  // 6. Right mid
    { x: 300, y: 80 }    // 7. Right top
  ],

  // W: Down, up, down, up
  W: [
    { x: 80, y: 80 },    // 1. Left top
    { x: 100, y: 160 },  // 2. Left mid
    { x: 120, y: 240 },  // 3. First valley
    { x: 150, y: 180 },  // 4. First peak
    { x: 200, y: 240 },  // 5. Center valley
    { x: 250, y: 180 },  // 6. Second peak
    { x: 280, y: 240 },  // 7. Third valley
    { x: 300, y: 160 },  // 8. Right mid
    { x: 320, y: 80 }    // 9. Right top
  ],

  // X: Diagonal down-right, diagonal down-left
  X: [
    { x: 100, y: 80 },   // 1. Top-left
    { x: 160, y: 160 },  // 2. Before center
    { x: 240, y: 240 },  // 3. After center
    { x: 300, y: 280 },  // 4. Bottom-right
    { x: 300, y: 80 },   // 5. Top-right
    { x: 240, y: 160 },  // 6. Before center
    { x: 160, y: 240 },  // 7. After center
    { x: 100, y: 280 }   // 8. Bottom-left
  ],

  // Y: Diagonal to center, diagonal to center, vertical down
  Y: [
    { x: 100, y: 80 },   // 1. Top-left
    { x: 160, y: 140 },  // 2. Left diagonal
    { x: 200, y: 180 },  // 3. Center meet
    { x: 240, y: 140 },  // 4. Right diagonal
    { x: 300, y: 80 },   // 5. Top-right
    { x: 200, y: 180 },  // 6. Back to center
    { x: 200, y: 230 },  // 7. Vertical mid
    { x: 200, y: 280 }   // 8. Vertical bottom
  ],

  // Z: Horizontal top, diagonal, horizontal bottom
  Z: [
    { x: 120, y: 80 },   // 1. Top-left
    { x: 200, y: 80 },   // 2. Top-center
    { x: 280, y: 80 },   // 3. Top-right
    { x: 240, y: 140 },  // 4. Diagonal top
    { x: 200, y: 180 },  // 5. Diagonal mid
    { x: 160, y: 220 },  // 6. Diagonal bottom
    { x: 120, y: 280 },  // 7. Bottom-left
    { x: 200, y: 280 },  // 8. Bottom-center
    { x: 280, y: 280 }   // 9. Bottom-right
  ]
};
