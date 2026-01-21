/**
 * HandwritingValidator.ts
 * Sequential Checkpoint Algorithm for validating handwritten letters
 */

import { LETTER_CHECKPOINTS } from './LetterCheckpoints';

interface Point {
  x: number;
  y: number;
}

interface Checkpoint {
  x: number;
  y: number;
}

const HIT_RADIUS = 50; // Increased tolerance for better UX
const MIN_CHECKPOINTS_RATIO = 0.6; // Must hit 60% of checkpoints

/**
 * Calculate Euclidean distance between two points
 * Formula: √((x2-x1)² + (y2-y1)²)
 */
function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a point is within the hit radius of a checkpoint
 */
function isPointNearCheckpoint(point: Point, checkpoint: Checkpoint): boolean {
  return distance(point, checkpoint) <= HIT_RADIUS;
}

/**
 * Sequential Checkpoint Algorithm
 * Iterates through user points and checks if they hit checkpoints in order
 */
function validateCheckpoints(userPoints: Point[], checkpoints: Checkpoint[]): boolean {
  let currentCheckpointIndex = 0;
  const hitCheckpoints = new Set<number>();
  const minRequired = Math.ceil(checkpoints.length * MIN_CHECKPOINTS_RATIO);

  console.log('Starting validation with', userPoints.length, 'points');
  console.log('Checkpoints:', checkpoints.length, '| Min required:', minRequired);

  // Iterate through all user-drawn points
  for (const point of userPoints) {
    // Check if current point hits the next expected checkpoint
    if (currentCheckpointIndex < checkpoints.length) {
      const currentCheckpoint = checkpoints[currentCheckpointIndex];
      const dist = distance(point, currentCheckpoint);
      
      if (isPointNearCheckpoint(point, currentCheckpoint)) {
        console.log(`✓ Hit checkpoint ${currentCheckpointIndex + 1}:`, currentCheckpoint, 'distance:', dist.toFixed(2));
        // Hit! Mark this checkpoint and move to next
        hitCheckpoints.add(currentCheckpointIndex);
        currentCheckpointIndex++;
      }
    }
  }

  console.log('Checkpoints hit:', hitCheckpoints.size, '/', checkpoints.length, '| Required:', minRequired);

  // Success if we hit minimum required checkpoints
  return hitCheckpoints.size >= minRequired;
}

/**
 * Parse react-canvas-draw JSON data and flatten all points
 * Input format: { lines: [ { points: [{x,y}, ...] }, ... ] }
 */
function flattenCanvasPoints(jsonString: string): Point[] {
  try {
    const data = JSON.parse(jsonString);
    const allPoints: Point[] = [];

    if (data.lines && Array.isArray(data.lines)) {
      data.lines.forEach((line: any) => {
        if (line.points && Array.isArray(line.points)) {
          // Check the structure of points - they might be {x, y} or just arrays
          line.points.forEach((point: any) => {
            if (typeof point === 'object' && point.x !== undefined && point.y !== undefined) {
              allPoints.push({ x: point.x, y: point.y });
            } else if (Array.isArray(point) && point.length >= 2) {
              allPoints.push({ x: point[0], y: point[1] });
            }
          });
        }
      });
    }

    return allPoints;
  } catch (error) {
    console.error('Error parsing canvas data:', error);
    return [];
  }
}

/**
 * Main validation function
 * Parses canvas data and runs checkpoint validation
 */
export function parseAndValidate(jsonString: string, letter: string = 'A'): boolean {
  // Get checkpoints for the letter
  const checkpoints = LETTER_CHECKPOINTS[letter] || LETTER_CHECKPOINTS['A'];

  // Flatten all drawn points
  const userPoints = flattenCanvasPoints(jsonString);

  // Check if user drew anything
  if (userPoints.length === 0) {
    return false;
  }

  // Run checkpoint validation
  return validateCheckpoints(userPoints, checkpoints);
}

/**
 * Get validation result with details (for debugging/feedback)
 */
export function validateWithDetails(jsonString: string, letter: string = 'A'): {
  isValid: boolean;
  pointsDrawn: number;
  checkpointsHit: number;
  totalCheckpoints: number;
} {
  const checkpoints = LETTER_CHECKPOINTS[letter] || LETTER_CHECKPOINTS['A'];
  const userPoints = flattenCanvasPoints(jsonString);
  const minRequired = Math.ceil(checkpoints.length * MIN_CHECKPOINTS_RATIO);
  
  let currentCheckpointIndex = 0;
  const hitCheckpoints = new Set<number>();

  for (const point of userPoints) {
    if (currentCheckpointIndex < checkpoints.length) {
      const currentCheckpoint = checkpoints[currentCheckpointIndex];
      if (isPointNearCheckpoint(point, currentCheckpoint)) {
        hitCheckpoints.add(currentCheckpointIndex);
        currentCheckpointIndex++;
      }
    }
  }

  return {
    isValid: hitCheckpoints.size >= minRequired,
    pointsDrawn: userPoints.length,
    checkpointsHit: hitCheckpoints.size,
    totalCheckpoints: checkpoints.length
  };
}
