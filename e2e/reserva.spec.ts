import { expect, test, type Page } from '@playwright/test';

async function registrar(page: Page, nombre: string) {
  await page.goto('/registro');
  await page.getByLabel('Nombre').fill(nombre);
  await page.getByLabel('Email').fill(`e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`);
  await page.getByLabel(/Contraseña/).fill('contraseña-larga');
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByRole('link', { name: 'Mis reservas' })).toBeVisible();
}

test('registro → reservar → aparece en mis reservas → cancelar', async ({ page }) => {
  await registrar(page, 'Ana');
  await page.getByRole('link', { name: /Pádel 1/ }).click();
  const manana = new Date(Date.now() + 86_400_000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
  await page.getByLabel('Día').fill(manana);
  await page.getByRole('button', { name: /Libre/ }).first().click();
  await page.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.getByText('Reserva confirmada.')).toBeVisible();
  await page.getByRole('button', { name: 'Ver mis reservas' }).click();
  await expect(page.getByText('Pádel 1')).toBeVisible();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.getByText('cancelada')).toBeVisible();
});

test('la cookie de sesión es httpOnly y el navegador no la expone', async ({ page, context }) => {
  await registrar(page, 'Luis');
  const cookie = (await context.cookies()).find((c) => c.name === 'sesion');
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe('Lax');
  expect(await page.evaluate(() => document.cookie)).not.toContain('sesion');
});
