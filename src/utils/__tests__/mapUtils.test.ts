import { calculateDistance, decodePolyline } from '../mapUtils';

describe('Map Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Lagos coordinates
      const lat1 = 6.5244;
      const lon1 = 3.3792;
      // Nearby point
      const lat2 = 6.5344;
      const lon2 = 3.3892;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(2000); // Should be less than 2km
    });

    it('should return 0 for identical points', () => {
      const distance = calculateDistance(6.5244, 3.3792, 6.5244, 3.3792);
      expect(distance).toBeLessThan(1); // Close to 0 (floating point precision)
    });
  });

  describe('decodePolyline', () => {
    it('should decode a simple polyline', () => {
      // Simple encoded polyline
      const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
      const decoded = decodePolyline(encoded);

      expect(Array.isArray(decoded)).toBe(true);
      expect(decoded.length).toBeGreaterThan(0);
      expect(decoded[0]).toHaveProperty('latitude');
      expect(decoded[0]).toHaveProperty('longitude');
    });
  });
});
