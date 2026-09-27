import { expect, test, type Page } from '@playwright/test';

// Los localizadores van acotados a su región (barra, diálogo, lista) porque
// muchos textos aparecen en más de un sitio: «Mis reservas» está en la barra,
// en la banda final y en el pie; el nombre de la pista, en la ficha y en el diálogo.

async function registrar(page: Page, nombre: string) {
  await page.goto('/registro');
  await page.getByLabel('Nombre', { exact: true }).fill(nombre);
  await page.getByLabel('Email', { exact: true }).fill(`e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`);
  await page.getByLabel('Contraseña', { exact: true }).fill('contraseña-larga');
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Mis reservas' })).toBeVisible();
}

test('registro → reservar → aparece en mis reservas → cancelar', async ({ page }) => {
  await registrar(page, 'Ana');
  await page.getByRole('link', { name: /Pádel 1/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Pádel 1' })).toBeVisible();

  const manana = new Date(Date.now() + 86_400_000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
  await page.getByLabel('Día', { exact: true }).fill(manana);
  await page.getByRole('button', { name: /Libre/ }).first().click();

  const dialogo = page.getByRole('dialog');
  await dialogo.getByRole('button', { name: 'Confirmar' }).click();
  await expect(dialogo.getByText('Reserva confirmada.')).toBeVisible();
  await dialogo.getByRole('button', { name: 'Ver mis reservas' }).click();

  await expect(page).toHaveURL(/\/mis-reservas$/);
  const reserva = page.getByRole('listitem').filter({ hasText: 'Pádel 1' });
  await expect(reserva).toBeVisible();
  await reserva.getByRole('button', { name: 'Cancelar' }).click();
  await expect(reserva.getByText('cancelada', { exact: true })).toBeVisible();
});

test('la cookie de sesión es httpOnly y el navegador no la expone', async ({ page, context }) => {
  await registrar(page, 'Luis');
  const cookie = (await context.cookies()).find((c) => c.name === 'sesion');
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe('Lax');
  expect(await page.evaluate(() => document.cookie)).not.toContain('sesion');
});
