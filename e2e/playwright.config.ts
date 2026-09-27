import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  // La web arranca en castellano salvo preferencia guardada; el locale del navegador solo afecta a formatos.
  use: { baseURL: 'http://localhost:8080', locale: 'es-ES' },
  retries: 0,
  reporter: 'list',
  webServer: {
    command: 'docker compose -f ../infra/docker-compose.yml up --build',
    url: 'http://localhost:8080/api/healthz',
    timeout: 300_000,
    reuseExistingServer: true,
  },
});
