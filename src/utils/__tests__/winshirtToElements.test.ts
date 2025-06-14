import { describe, it, expect } from 'vitest';
import winshirtToElements, { DesignElement } from '../winshirtToElements';

describe('winshirtToElements', () => {
  it('converts full customization JSON to front/back arrays', () => {
    const input = {
      frontDesign: {
        designId: 'abc',
        designUrl: 'https://mon-site.fr/visuel.png',
        transform: {
          scale: 1,
          position: { x: 100, y: 150 },
          rotation: 0
        }
      },
      backDesign: {
        designId: 'xyz',
        designUrl: 'https://mon-site.fr/verso.png',
        transform: {
          scale: 1,
          position: { x: 50, y: 80 },
          rotation: 10
        }
      },
      frontText: {
        content: 'Hello',
        font: 'Arial',
        color: '#FF0000',
        transform: {
          scale: 1.5,
          position: { x: 80, y: 200 },
          rotation: -20
        }
      },
      backText: {
        content: 'Back here',
        font: 'Roboto',
        color: '#00FF00',
        transform: {
          scale: 1.2,
          position: { x: 40, y: 180 },
          rotation: 5
        }
      }
    };

    const result = winshirtToElements(input);

    expect(result.front.length).toBe(2);
    expect(result.back?.length).toBe(2);

    const frontImage = result.front[0] as DesignElement;
    expect(frontImage.type).toBe('image');
    expect(frontImage.src).toBe('https://mon-site.fr/visuel.png');
    expect(frontImage.x).toBe(100);
    expect(frontImage.y).toBe(150);

    const frontText = result.front[1] as DesignElement;
    expect(frontText.type).toBe('text');
    expect(frontText.text).toBe('Hello');
    expect(frontText.font).toBe('Arial');
  });
});
