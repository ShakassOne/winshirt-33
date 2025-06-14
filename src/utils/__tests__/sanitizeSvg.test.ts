import { describe, it, expect } from 'vitest';
import { sanitizeSvg } from '../sanitizeSvg';

describe('sanitizeSvg', () => {
  it('removes malicious script tags', () => {
    const malicious = '<svg><script>alert("x")</script><rect /></svg>';
    const sanitized = sanitizeSvg(malicious);
    expect(sanitized).not.toContain('<script>');
  });
});

