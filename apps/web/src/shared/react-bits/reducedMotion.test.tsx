import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TituloAnimado } from '../components/TituloAnimado.tsx';
import { AnimatedList } from './AnimatedList.tsx';

function simularReducedMotion(activo: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: activo && q.includes('prefers-reduced-motion'), media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  }));
}
afterEach(() => vi.unstubAllGlobals());

describe('TituloAnimado', () => {
  it('con prefers-reduced-motion muestra el texto sin animar', () => {
    simularReducedMotion(true);
    render(<TituloAnimado texto="Tu próximo partido empieza aquí" />);
    expect(screen.getByText('Tu próximo partido empieza aquí')).toBeInTheDocument();
    expect(document.querySelector('[data-animado]')).toBeNull();
  });
  it('sin la preferencia, monta la versión animada con el texto ya visible', () => {
    simularReducedMotion(false);
    render(<TituloAnimado texto="Tu próximo partido" />);
    expect(document.querySelector('[data-animado]')).not.toBeNull();
    expect(screen.getByText('próximo')).toBeVisible();
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
