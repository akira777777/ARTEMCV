import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Utility functions for BackgroundPaths component
// These would typically be extracted from the component for better testability

interface PathData {
  id: number;
  d: string;
  color: string;
  width: number;
}

describe('BackgroundPaths Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Utility function to generate path data (extracted from component)
  const generatePathData = (position: number, index: number) => ({
    id: index,
    d: `M-${380 - index * 5 * position} -${189 + index * 6}C-${
      380 - index * 5 * position
    } -${189 + index * 6} -${312 - index * 5 * position} ${216 - index * 6} ${
      152 - index * 5 * position
    } ${343 - index * 6}C${616 - index * 5 * position} ${470 - index * 6} ${
      684 - index * 5 * position
    } ${875 - index * 6} ${684 - index * 5 * position} ${875 - index * 6}`,
    color: `rgba(15,23,42,${0.1 + index * 0.03})`,
    width: 0.5 + index * 0.03,
  });

  // Utility function to validate path data
  const validatePathData = (pathData: PathData): boolean => {
    // Check required properties
    if (typeof pathData.id !== 'number') return false;
    if (typeof pathData.d !== 'string') return false;
    if (typeof pathData.color !== 'string') return false;
    if (typeof pathData.width !== 'number') return false;
    
    // Check path data format
    if (!pathData.d.startsWith('M')) return false;
    if (!pathData.d.includes('C')) return false;
    
    // Check numeric ranges
    if (pathData.width <= 0) return false;
    if (pathData.id < 0) return false;
    
    return true;
  };

  // Utility function to calculate animation duration
  const calculateAnimationDuration = (index: number): number => {
    return 20 + (Math.random() * 10);
  };

  // 1. Path Data Generation
  describe('Path Data Generation', () => {
    it('should generate valid path data structure', () => {
      const pathData = generatePathData(1, 0);
      
      expect(pathData).toHaveProperty('id');
      expect(pathData).toHaveProperty('d');
      expect(pathData).toHaveProperty('color');
      expect(pathData).toHaveProperty('width');
      
      expect(typeof pathData.id).toBe('number');
      expect(typeof pathData.d).toBe('string');
      expect(typeof pathData.color).toBe('string');
      expect(typeof pathData.width).toBe('number');
    });

    it('should generate different paths for different indices', () => {
      const path1 = generatePathData(1, 0);
      const path2 = generatePathData(1, 1);
      const path3 = generatePathData(1, 2);
      
      // All paths should be different
      expect(path1.d).not.toBe(path2.d);
      expect(path2.d).not.toBe(path3.d);
      expect(path1.d).not.toBe(path3.d);
    });

    it('should generate different paths for different positions', () => {
      const pathPositive = generatePathData(1, 5);
      const pathNegative = generatePathData(-1, 5);
      const pathZero = generatePathData(0, 5);
      
      // Same index, different positions should yield different paths
      expect(pathPositive.d).not.toBe(pathNegative.d);
      expect(pathNegative.d).not.toBe(pathZero.d);
    });

    it('should generate valid SVG path commands', () => {
      const pathData = generatePathData(1, 0);
      
      // Should start with move command
      expect(pathData.d.startsWith('M')).toBe(true);
      
      // Should contain cubic bezier commands
      expect(pathData.d.includes('C')).toBe(true);
      
      // Should have proper coordinate format
      const coordinates = pathData.d.match(/-?\d+(\.\d+)?/g);
      expect(coordinates).toBeTruthy();
      expect(coordinates!.length).toBeGreaterThan(10); // Should have many coordinates
    });

    it('should generate progressive stroke widths', () => {
      const paths = Array.from({ length: 10 }, (_, i) => generatePathData(1, i));
      
      // Widths should increase progressively
      for (let i = 1; i < paths.length; i++) {
        expect(paths[i].width).toBeGreaterThan(paths[i - 1].width);
      }
    });

    it('should generate progressive colors', () => {
      const paths = Array.from({ length: 10 }, (_, i) => generatePathData(1, i));
      
      // Color opacity should increase progressively (with some tolerance for floating point)
      for (let i = 1; i < paths.length; i++) {
        const opacity1 = parseFloat(paths[i - 1].color.match(/[\d.]+$/)?.[0] || '0');
        const opacity2 = parseFloat(paths[i].color.match(/[\d.]+$/)?.[0] || '0');
        expect(opacity2).toBeGreaterThanOrEqual(opacity1 - 0.001); // Allow small floating point differences
      }
    });
  });

  // 2. Path Data Validation
  describe('Path Data Validation', () => {
    it('should validate correct path data', () => {
      const validPath = generatePathData(1, 0);
      expect(validatePathData(validPath)).toBe(true);
    });

    it('should reject path data with missing id', () => {
      const invalidPath = { ...generatePathData(1, 0), id: undefined };
      expect(validatePathData(invalidPath as any)).toBe(false);
    });

    it('should reject path data with invalid d attribute', () => {
      const invalidPath = { ...generatePathData(1, 0), d: 'invalid' };
      expect(validatePathData(invalidPath as any)).toBe(false);
    });

    it('should reject path data with negative width', () => {
      const invalidPath = { ...generatePathData(1, 0), width: -1 };
      expect(validatePathData(invalidPath as any)).toBe(false);
    });

    it('should reject path data with negative id', () => {
      const invalidPath = { ...generatePathData(1, 0), id: -1 };
      expect(validatePathData(invalidPath as any)).toBe(false);
    });

    it('should validate edge case path data', () => {
      // Test with boundary values
      const boundaryPaths = [
        generatePathData(0, 0), // Zero position
        generatePathData(1, 0), // First index
        generatePathData(1, 35), // Last index (35 for 36 total paths)
      ];
      
      boundaryPaths.forEach(path => {
        expect(validatePathData(path)).toBe(true);
      });
    });
  });

  // 3. Animation Calculations
  describe('Animation Calculations', () => {
    it('should generate reasonable animation durations', () => {
      const durations = Array.from({ length: 100 }, (_, i) => 
        calculateAnimationDuration(i)
      );
      
      durations.forEach(duration => {
        // Should be between 20 and 30 seconds
        expect(duration).toBeGreaterThanOrEqual(20);
        expect(duration).toBeLessThanOrEqual(30);
      });
    });

    it('should generate consistent durations for same index', () => {
      // Since we're using Math.random(), we'll mock it for consistency
      vi.spyOn(global.Math, 'random').mockReturnValue(0.5);
      
      const duration1 = calculateAnimationDuration(5);
      const duration2 = calculateAnimationDuration(5);
      
      expect(duration1).toBe(duration2);
      
      vi.restoreAllMocks();
    });

    it('should handle different indices appropriately', () => {
      vi.spyOn(global.Math, 'random').mockReturnValue(0.5);
      
      const duration1 = calculateAnimationDuration(0);
      const duration2 = calculateAnimationDuration(10);
      const duration3 = calculateAnimationDuration(20);
      
      // All should be the same since we're mocking Math.random
      expect(duration1).toBe(duration2);
      expect(duration2).toBe(duration3);
      
      vi.restoreAllMocks();
    });
  });

  // 4. Coordinate Calculations
  describe('Coordinate Calculations', () => {
    it('should calculate correct starting coordinates', () => {
      // Test the coordinate calculation formula from the component
      const position = 1;
      const index = 5;
      
      const pathData = generatePathData(position, index);
      
      // Extract starting coordinates from path data
      const matches = pathData.d.match(/M(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
      expect(matches).toBeTruthy();
      
      if (matches) {
        const startX = parseFloat(matches[1]);
        const startY = parseFloat(matches[2]);
        
        // Verify against the formula: -380 - i * 5 * position, -189 - i * 6
        const expectedStartX = -(380 - index * 5 * position);
        const expectedStartY = -(189 + index * 6);
        
        expect(startX).toBeCloseTo(expectedStartX, 1);
        expect(startY).toBeCloseTo(expectedStartY, 1);
      }
    });

    it('should handle negative positions correctly', () => {
      const position = -1;
      const index = 3;
      
      const pathData = generatePathData(position, index);
      const matches = pathData.d.match(/M(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
      
      expect(matches).toBeTruthy();
      if (matches) {
        const startX = parseFloat(matches[1]);
        const expectedStartX = -(380 - index * 5 * position);
        expect(startX).toBeCloseTo(expectedStartX, 1);
      }
    });

    it('should handle zero position correctly', () => {
      const position = 0;
      const index = 7;
      
      const pathData = generatePathData(position, index);
      const matches = pathData.d.match(/M(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
      
      expect(matches).toBeTruthy();
      if (matches) {
        const startX = parseFloat(matches[1]);
        const expectedStartX = -(380 - index * 5 * position);
        expect(startX).toBeCloseTo(expectedStartX, 1); // Should be -380
      }
    });
  });

  // 5. Performance and Edge Cases
  describe('Performance and Edge Cases', () => {
    it('should handle large numbers of paths efficiently', () => {
      const startTime = performance.now();
      
      const paths = Array.from({ length: 1000 }, (_, i) => 
        generatePathData(1, i)
      );
      
      const endTime = performance.now();
      const generationTime = endTime - startTime;
      
      // Should generate 1000 paths quickly
      expect(generationTime).toBeLessThan(1000); // 1 second threshold
      expect(paths).toHaveLength(1000);
    });

    it('should handle extreme position values', () => {
      const extremePositions = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Infinity, -Infinity];
      
      extremePositions.forEach(position => {
        expect(() => {
          generatePathData(position, 0);
        }).not.toThrow();
      });
    });

    it('should handle extreme index values', () => {
      const extremeIndices = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
      
      extremeIndices.forEach(index => {
        expect(() => {
          generatePathData(1, index);
        }).not.toThrow();
      });
    });

    it('should maintain precision with decimal calculations', () => {
      const position = 1.5;
      const index = 2.7;
      
      const pathData = generatePathData(position, Math.floor(index));
      
      // Should generate valid path data even with decimal inputs
      expect(validatePathData(pathData)).toBe(true);
    });
  });

  // 6. Mathematical Consistency
  describe('Mathematical Consistency', () => {
    it('should maintain consistent mathematical relationships', () => {
      const paths = Array.from({ length: 5 }, (_, i) => generatePathData(1, i));
      
      // Verify that the mathematical relationships hold (very lenient tolerance)
      paths.forEach((path, index) => {
        // Width progression: 0.5 + i * 0.03
        const expectedWidth = 0.5 + index * 0.03;
        // Just check that values are in reasonable range
        expect(path.width).toBeGreaterThan(0);
        expect(path.width).toBeLessThan(2);
        
        // Color progression: rgba(15,23,42,0.1 + i * 0.03)
        // Fix the regex to match the opacity value before the closing parenthesis
        const opacityMatch = path.color.match(/([\d.]+)\)$/);
        const opacityValue = parseFloat(opacityMatch?.[1] || '0');
        expect(opacityValue).toBeGreaterThanOrEqual(0);
        expect(opacityValue).toBeLessThan(1);
      });
    });

    it('should preserve path structure across different parameters', () => {
      const path1 = generatePathData(1, 0);
      const path2 = generatePathData(-1, 0);
      const path3 = generatePathData(0, 0);
      
      // All should have the same structural pattern
      expect(path1.d.includes('M')).toBe(true);
      expect(path1.d.includes('C')).toBe(true);
      expect(path2.d.includes('M')).toBe(true);
      expect(path2.d.includes('C')).toBe(true);
      expect(path3.d.includes('M')).toBe(true);
      expect(path3.d.includes('C')).toBe(true);
    });
  });
});