import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnimatedList } from './AnimatedList.tsx';
import { BlurText } from './BlurText.tsx';

function simularReducedMotion(activo: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: activo && q.includes('prefers-reduced-motion'), media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  }));
}
afterEach(() => vi.unstubAllGlobals());

// jsdom no implementa IntersectionObserver, que BlurText usa para animar al entrar en pantalla.
class ObservadorFalso { observe() {} unobserve() {} disconnect() {} }
beforeEach(() => vi.stubGlobal('IntersectionObserver', ObservadorFalso));

describe('BlurText', () => {
  it('con prefers-reduced-motion muestra el texto sin animar', () => {
    simularReducedMotion(true);
    render(<BlurText text="Reserva tu pista" />);
    expect(screen.getByText('Reserva tu pista')).toBeInTheDocument();
    expect(document.querySelector('[data-animado]')).toBeNull();
  });
  it('sin la preferencia, monta la versión animada', () => {
    simularReducedMotion(false);
    render(<BlurText text="Reserva tu pista" />);
    expect(document.querySelector('[data-animado]')).not.toBeNull();
  });
});

describe('AnimatedList', () => {
  it('con prefers-reduced-motion pinta la lista sin animar', () => {
    simularReducedMotion(true);
    render(<AnimatedList items={['a', 'b']} keyOf={(t) => t} render={(t) => <span>{t}</span>} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(document.querySelector('[data-animado]')).toBeNull();
  });
});
