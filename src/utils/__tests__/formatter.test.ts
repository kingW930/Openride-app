import { formatCurrency, formatDistance, formatDuration, formatTime, formatDate } from '../formatter';

describe('Formatter Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency in NGN', () => {
      expect(formatCurrency(1000)).toMatch(/1,000/);
    });

    it('should handle decimal values', () => {
      expect(formatCurrency(1500.50)).toMatch(/1,500/);
    });
  });

  describe('formatDistance', () => {
    it('should format meters', () => {
      expect(formatDistance(500)).toBe('500 m');
    });

    it('should format kilometers', () => {
      expect(formatDistance(1500)).toBe('1.5 km');
    });

    it('should round meters', () => {
      expect(formatDistance(567)).toBe('567 m');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes', () => {
      expect(formatDuration(300)).toBe('5 min');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(3900)).toBe('1h 5m');
    });

    it('should handle exact hours', () => {
      expect(formatDuration(7200)).toBe('2h 0m');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const dateString = '2025-11-14T10:30:00Z';
      const result = formatTime(dateString);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2025-11-14T10:30:00Z';
      const result = formatDate(dateString);
      expect(result).toContain('Nov');
      expect(result).toContain('14');
      expect(result).toContain('2025');
    });
  });
});
