import { test, expect } from '@playwright/test';

test('pointer and keyboard share one highlighted result with separate rows', async ({
  page,
}) => {
  await page.goto('/blog/yaml-json-conversion/');
  await page.getByRole('button', { name: 'Search tools', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Find a tool' });
  const options = dialog.getByRole('option');
  await options.nth(1).hover();
  await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(dialog.getByRole('option', { selected: true })).toHaveCount(1);
  await dialog.getByRole('combobox').press('ArrowUp');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(options.nth(1)).toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  const first = await options.first().boundingBox();
  const second = await options.nth(1).boundingBox();
  expect(second!.y - first!.y - first!.height).toBeGreaterThanOrEqual(4);
});

test('quick search preserves editor state and restores focus', async ({
  page,
}) => {
  await page.goto('/tools/json-formatter/');
  const editor = page.getByLabel('JSON input');
  await editor.fill('{"keep":"this"}');
  await editor.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Find a tool' });
  const input = dialog.getByRole('combobox', { name: 'Search tools' });
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option')).toHaveCount(12);
  await input.fill('epoch');
  await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('option', { selected: true })).toContainText(
    'Unix Timestamp',
  );
  await input.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(editor).toBeFocused();
  await expect(editor).toHaveValue('{"keep":"this"}');
  await expect(page).toHaveURL(/\/tools\/json-formatter\/$/);
});

test('search supports pointer navigation, backdrop dismiss and short viewports', async ({
  page,
}) => {
  await page.goto('/tools/');
  await page.keyboard.press('Meta+k');
  const dialog = page.getByRole('dialog', { name: 'Find a tool' });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  for (let step = 0; step < 12; step++) await input.press('ArrowDown');
  await expect(dialog.getByRole('option', { selected: true })).toBeInViewport();
  await page.setViewportSize({ width: 375, height: 360 });
  const bounds = await dialog.boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(360);
  await input.fill('sha256');
  await dialog.getByRole('option', { name: /Hash & Checksum/ }).click();
  await expect(page).toHaveURL(/\/tools\/hash-checksum\/$/);
  await page.getByRole('button', { name: 'Search tools', exact: true }).click();
  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
});

test('search supports aliases, empty state, keyboard selection and navigation', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search tools', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Find a tool' });
  const input = dialog.getByRole('combobox');
  await input.fill('<script>no matches</script>');
  await expect(dialog.getByRole('status')).toHaveText('0 tools found');
  await expect(
    dialog.getByText('No tools found for', { exact: false }),
  ).toBeVisible();
  await input.press('Enter');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Clear search' }).click();
  await expect(input).toBeFocused();
  await expect(dialog.getByRole('option')).toHaveCount(12);
  const first = await input.getAttribute('aria-activedescendant');
  await input.press('ArrowDown');
  await expect(input).not.toHaveAttribute('aria-activedescendant', first!);
  await input.fill('diff');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await input.press('Enter');
  await expect(page).toHaveURL(/\/tools\/text-compare\/$/);
  await page.goto('/tools/');
  await page.getByRole('searchbox', { name: 'Search tools' }).fill('diff');
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(1);
  await expect(page.locator('[data-tool-card]:visible')).toContainText(
    'Text Compare',
  );
});

test('search traps focus and never persists or sends queries', async ({
  page,
}) => {
  await page.goto('/about/');
  await page.getByRole('button', { name: 'Search tools', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Find a tool' });
  const input = dialog.getByRole('combobox');
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await input.fill('private-search-query');
  await input.press('Tab');
  await expect(
    dialog.getByRole('button', { name: 'Close search' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    dialog.getByRole('button', { name: 'Clear search' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();
  expect(requests).toEqual([]);
  expect(
    await page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
      }),
    ),
  ).not.toContain('private-search-query');
  await expect(page).toHaveURL(/\/about\/$/);
  await dialog.getByRole('button', { name: 'Close search' }).click();
  await expect(
    page.getByRole('button', { name: 'Search tools', exact: true }),
  ).toBeFocused();
});
