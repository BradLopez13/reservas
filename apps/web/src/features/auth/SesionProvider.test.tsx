import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { servidor } from '../../test/servidor.ts';
import { RutaPrivada } from './RutaPrivada.tsx';
import { SesionProvider } from './SesionProvider.tsx';

const app = (ruta: string) => (
  <QueryClientProvider client={new QueryClient()}>
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <Routes>
          <Route path="/login" element={<p>pantalla login</p>} />
          <Route path="/mis-reservas" element={<RutaPrivada><p>mis reservas</p></RutaPrivada>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

describe('SesionProvider', () => {
  it('sin sesión, una ruta privada lleva al login', async () => {
    servidor.use(http.get('/api/auth/yo', () => HttpResponse.json({ error: { code: 'NO_AUTENTICADO', message: 'x' } }, { status: 401 })));
    render(app('/mis-reservas'));
    expect(await screen.findByText('pantalla login')).toBeInTheDocument();
  });
  it('con sesión, muestra la ruta privada', async () => {
    servidor.use(http.get('/api/auth/yo', () => HttpResponse.json({ id: '0d1f7c6e-9a4b-4c1e-8f2a-3b5d7e9f1a2b', email: 'ana@example.com', nombre: 'Ana' })));
    render(app('/mis-reservas'));
    expect(await screen.findByText('mis reservas')).toBeInTheDocument();
  });
});
