import { test, expect } from '@playwright/test';
test('mobile menu, segmented options and cron presets', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile) {
    const menu = page
      .getByRole('banner')
      .getByRole('button', { name: 'Menu', exact: true });
    await menu.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
  }
  await page.goto('/tools/json-formatter/');
  const fourSpaces = page.getByRole('button', { name: '4 spaces' });
  await expect(fourSpaces).toBeEnabled();
  await fourSpaces.click();
  await expect(fourSpaces).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('JSON input').fill('{"a":1}');
  await page.getByLabel('JSON input').press('Control+Enter');
  await expect(page.getByLabel('JSON output')).toHaveValue('{\n    "a": 1\n}');
  await page.goto('/tools/cron-generator/');
  await page.getByRole('button', { name: 'Weekdays at 09:00' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Cron expression', exact: true }),
  ).toHaveValue('0 9 * * 1-5');
  await expect(page.locator('.cron-sentence')).toContainText(
    'Monday through Friday',
  );
});
test('directory search, categories and persisted favorites', async ({
  page,
}) => {
  await page.goto('/tools/');
  await page
    .getByRole('searchbox', { name: 'Search tools' })
    .fill('json formatter');
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(1);
  await page.locator('[data-fav-btn="json-formatter"]').click();
  await page.goto('/tools/');
  await page.getByRole('button', { name: 'Favorites', exact: true }).click();
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Generators', exact: true }).click();
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(3);
});
test('JSON validates, preserves invalid input, copies and clears', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/json-formatter/');
  await page.getByLabel('JSON input').fill('{\n  "a": 1,\n}');
  await expect(page.locator('.validity')).toContainText('Invalid · line 3');
  await page.getByRole('button', { name: 'Format JSON' }).click();
  await expect(page.getByRole('alert')).not.toBeEmpty();
  await expect(page.getByLabel('JSON input')).toHaveValue('{\n  "a": 1,\n}');
  await page.getByRole('button', { name: 'Load example' }).click();
  await page.getByRole('button', { name: 'Format JSON' }).click();
  await expect(page.getByLabel('JSON output')).toHaveValue(/InfraTrove/);
  await page.getByRole('button', { name: 'Copy output' }).click();
  await expect(page.getByRole('status')).toContainText([
    'Valid JSON',
    'Copied',
  ]);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'InfraTrove',
  );
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.getByLabel('JSON input')).toHaveValue('');
});
test('encoding converts as you type, round-trips and reports errors', async ({
  page,
}) => {
  await page.goto('/tools/base64-encoder-decoder/');
  await page.getByLabel('Text to encode').fill('Hello 👋');
  await expect(page.getByLabel('Base64 output')).toHaveValue(
    'SGVsbG8g8J+Riw==',
  );
  await page.getByRole('button', { name: 'Swap direction' }).click();
  await expect(page.getByLabel('Decoded text')).toHaveValue('Hello 👋');
  await page.goto('/tools/url-encoder-decoder/');
  await page.getByRole('button', { name: 'Decode', exact: true }).click();
  await page.getByLabel('URL component to decode').fill('%GG');
  await expect(page.locator('#encoding-error')).toContainText('Invalid');
  await expect(page.getByLabel('Decoded text')).toHaveValue('');
});
test('password input and output cause no network or persistence', async ({
  page,
}) => {
  await page.goto('/tools/password-generator/');
  await page.waitForLoadState('networkidle');
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page
    .getByRole('button', { name: 'Generate password', exact: true })
    .click();
  const password = await page.locator('output').textContent();
  expect(password).toHaveLength(20);
  expect(
    await page.evaluate(() => JSON.stringify({ ...localStorage })),
  ).not.toContain(password);
  expect(requests).toEqual([]);
  await page.reload();
  await expect(page.locator('output')).toHaveText('Ready when you are.');
});
test('diff, UUID, timestamp and cron complete their main task', async ({
  page,
}) => {
  await page.goto('/tools/text-compare/');
  await page.getByRole('button', { name: 'Load example' }).click();
  await page.getByRole('button', { name: 'Compare text' }).click();
  await expect(page.locator('.diff-summary')).toContainText('2 lines added');
  await page.goto('/tools/uuid-generator/');
  const uuids = page
    .getByRole('list', { name: 'Generated identifiers' })
    .getByRole('listitem');
  await expect(uuids).toHaveCount(1);
  await page.getByLabel('Number of UUIDs').fill('3');
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();
  await expect(uuids).toHaveCount(3);
  await expect(uuids.first().locator('code')).toHaveText(
    /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}$/,
  );
  await page.goto('/tools/unix-timestamp-converter/');
  await page.getByRole('textbox', { name: 'Unix timestamp' }).fill('0');
  await expect(page.locator('.result-output').first()).toContainText(
    '1970-01-01T00:00:00.000Z',
  );
  await page
    .getByRole('textbox', { name: 'Unix timestamp' })
    .fill('1000000000000');
  await expect(
    page.getByRole('button', { name: 'Milliseconds', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/tools/cron-generator/');
  await expect(page.locator('.run-list li')).toHaveCount(5);
  await expect(page.locator('.cron-sentence')).toContainText('Every 5 minutes');
  await page
    .getByRole('textbox', { name: 'Cron expression', exact: true })
    .fill('0 25 * * *');
  await expect(page.locator('#cron-error')).not.toBeEmpty();
  await expect(page.locator('.run-list')).toHaveCount(0);
});
test('theme persists, page fits viewport, unknown URL returns 404', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const original = await page.locator('html').getAttribute('data-theme');
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  await page.reload();
  expect(await page.locator('html').getAttribute('data-theme')).not.toBe(
    original,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto('/tools/json-formatter/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  const response = await page.goto('/not-a-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    "This one's missing.",
  );
});
test('keyboard search and HTML without JavaScript', async ({
  page,
  browser,
}) => {
  await page.goto('/tools/');
  await page.keyboard.press('Control+k');
  await expect(
    page.getByRole('combobox', { name: 'Search tools' }),
  ).toBeFocused();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(new URL('/tools/json-formatter/', page.url()).href);
  await expect(staticPage.getByRole('heading', { level: 1 })).toContainText(
    'JSON Formatter',
  );
  await expect(
    staticPage.getByRole('heading', { name: /How to use/ }),
  ).toBeVisible();
  await expect(staticPage.locator('noscript p')).toContainText(
    'Enable JavaScript',
  );
  await context.close();
});
test('guides switch between English and Vietnamese', async ({ page }) => {
  await page.goto('/blog/json-trailing-commas/');
  await expect(page.locator('article.container')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Why your JSON is invalid',
  );
  await page.getByRole('link', { name: 'Đọc bài này bằng tiếng Việt' }).click();
  await expect(page).toHaveURL(/\/vi\/blog\/json-trailing-commas\/$/);
  await expect(page.locator('article.container')).toHaveAttribute('lang', 'vi');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Vì sao JSON của bạn không hợp lệ',
  );
  await expect(page.getByText('Trong bài viết này')).toBeVisible();
  await page.getByRole('link', { name: 'Read this guide in English' }).click();
  await expect(page).toHaveURL(/\/blog\/json-trailing-commas\/$/);
});
test('guide index lists each language and filters by category', async ({
  page,
}) => {
  await page.goto('/blog/');
  await expect(page.locator('[data-post]')).toHaveCount(7);
  await page.getByRole('button', { name: 'Text & data' }).click();
  await expect(page.locator('[data-post]:visible')).toHaveCount(3);
  await expect(page.getByRole('status')).toHaveText('Showing 3 of 7 articles');
  await expect(page).toHaveURL(/\?category=Text/);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('[data-post]:visible')).toHaveCount(7);
  await expect(page).not.toHaveURL(/category=/);
  await page
    .getByRole('navigation', { name: 'Guide language' })
    .getByRole('link', { name: 'Tiếng Việt' })
    .click();
  await expect(page).toHaveURL(/\/vi\/blog\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Hướng dẫn thực hành',
  );
  await expect(page.locator('[data-post]')).toHaveCount(7);
});
test('guide index opens on the category from the URL', async ({ page }) => {
  await page.goto('/blog/?category=Generators');
  await expect(page.locator('[data-post]:visible')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Generators' }),
  ).toHaveAttribute('aria-pressed', 'true');
});
test('guide contents link jumps to its heading and the tool CTA works', async ({
  page,
}) => {
  await page.goto('/blog/unix-cron-basics/');
  const contents = page.getByRole('complementary', { name: 'On this page' });
  // Collapsed on narrow screens, open beside the article on wide ones.
  if (await contents.locator('details:not([open])').count())
    await contents.getByText('On this page').click();
  await contents
    .getByRole('link', { name: 'Timezones and daylight saving matter' })
    .click();
  await expect(page).toHaveURL(/#timezones-and-daylight-saving-matter$/);
  await expect(
    contents.getByRole('link', {
      name: 'Timezones and daylight saving matter',
    }),
  ).toHaveAttribute('aria-current', 'location');
  await page.getByRole('link', { name: /Open tool: Cron Generator/ }).click();
  await expect(page).toHaveURL(/\/tools\/cron-generator\/$/);
});
test('guide code blocks copy, tables scroll and related guides follow', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/blog/yaml-json-conversion/');
  const copy = page.getByRole('button', { name: 'Copy code' }).first();
  await copy.click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Copied' }),
  ).toHaveCount(1);
  await page.goto('/blog/storage-units-gb-gib/');
  await expect(
    page.getByRole('region', { name: 'Scrollable table' }),
  ).toBeVisible();
  const related = page.getByRole('region', { name: 'Keep reading' });
  await expect(related.locator('[data-post]')).toHaveCount(2);
});
test('tool pages mark the current tool in the sidebar', async ({
  page,
  isMobile,
}) => {
  await page.goto('/tools/text-compare/');
  const nav = page.getByRole('navigation', { name: 'All tools' });
  if (isMobile) await expect(nav).toBeHidden();
  else
    await expect(nav.locator('a[aria-current="page"]')).toContainText(
      'Text Compare',
    );
});
test('side-by-side diff aligns rows and highlights changed words', async ({
  page,
}) => {
  await page.goto('/tools/text-compare/');
  await page.getByRole('button', { name: 'Load example' }).click();
  await page.getByRole('button', { name: 'Compare text' }).click();
  await page.getByRole('button', { name: 'Side by side', exact: true }).click();
  const table = page.locator('.diff-table.split');
  await expect(table.locator('tbody tr')).toHaveCount(3);
  await expect(table.locator('td.code.removed')).toHaveCount(2);
  await expect(table.locator('td.code.added')).toHaveCount(2);
  for (const cell of await table.locator('td.code.removed').all())
    await expect(cell).toContainText('Removed:');
  await expect(table.locator('td.code.removed mark').first()).toHaveText(
    'world',
  );
  await expect(table.locator('td.code.added mark').first()).toHaveText(
    'InfraTrove',
  );
});
test('wide screens use the width: panel tools get a guide rail, editors get the row', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'the wide layout only applies to desktop widths');
  const box = async (selector: string) => {
    const found = await page.locator(selector).first().boundingBox();
    if (!found) throw new Error(`${selector} is not visible`);
    return found;
  };
  const noSidewaysScroll = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
  await page.setViewportSize({ width: 1720, height: 1000 });
  await page.goto('/tools/password-generator/');
  const workspace = await box('.tool-workspace');
  const rail = await box('.guide-panels');
  expect(rail.x).toBeGreaterThanOrEqual(workspace.x + workspace.width);
  expect(Math.abs(rail.y - workspace.y)).toBeLessThan(2);
  expect(workspace.width).toBeGreaterThan(900);
  const related = await box('.related-section');
  expect(related.y).toBeGreaterThanOrEqual(workspace.y + workspace.height);
  expect(related.x + related.width).toBeLessThanOrEqual(rail.x);
  expect(await noSidewaysScroll()).toBe(true);
  const header = await box('.header-inner');
  const shell = await box('.app-shell');
  expect(Math.abs(header.x - shell.x)).toBeLessThan(1);
  expect(Math.abs(header.width - shell.width)).toBeLessThan(1);
  await page.goto('/tools/json-formatter/');
  const editors = await box('.tool-workspace');
  const panels = await box('.guide-panels');
  expect(editors.width).toBeGreaterThan(1300);
  expect(panels.y).toBeGreaterThanOrEqual(editors.y + editors.height);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tools/password-generator/');
  const narrowWorkspace = await box('.tool-workspace');
  const narrowPanels = await box('.guide-panels');
  expect(narrowPanels.y).toBeGreaterThanOrEqual(
    narrowWorkspace.y + narrowWorkspace.height,
  );
  expect(narrowWorkspace.width).toBeGreaterThan(1000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/tools/password-generator/');
  const contentColumn = await box('.tool-page');
  expect((await box('.tool-workspace')).width).toBe(contentColumn.width);
  expect((await box('.tool-workspace')).x).toBe(contentColumn.x);
  expect(await noSidewaysScroll()).toBe(true);
  await page.goto('/blog/');
  expect((await box('.container')).width).toBeLessThanOrEqual(1280);
});
test('arriving at the search field keeps the banner whole', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'the stacked mobile banner scrolls the page, by design');
  await page.setViewportSize({ width: 1409, height: 700 });
  await page.goto('/tools/#tool-search');
  await expect(page.locator('#tool-search')).toBeFocused();
  const banner = page.locator('.tool-index-intro');
  // The banner is a clipped card: focus must not scroll its contents.
  expect(await banner.evaluate((node) => node.scrollTop)).toBe(0);
  // Its line art overflows the card, so it must not be a scroll container at all.
  expect(
    await banner.evaluate((node) => {
      node.scrollTop = 50;
      return node.scrollTop;
    }),
  ).toBe(0);
  const heading = await page.locator('.tool-index-intro h1').boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  if (!heading || !header) throw new Error('banner or header is not visible');
  expect(heading.y).toBeGreaterThanOrEqual(header.y + header.height);
});
test('guide comments explain themselves when no API is running', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/blog/json-trailing-commas/');
  const comments = page.locator('#comments');
  await expect(
    comments.getByRole('heading', { name: 'Comments' }),
  ).toBeVisible();
  await expect(comments.locator('.comments-status')).toHaveText(
    'Comments are not available on this server.',
  );
  await expect(comments.locator('form')).toBeHidden();
  expect(
    requests.some((url) => url.includes('challenges.cloudflare.com')),
  ).toBe(false);
});

test('homepage renders workbench hero, dashboard mockup and directory', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'workbench.',
  );
  await expect(page.locator('.hero-visual')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'A shortcut for your next task.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Guides & references' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Browse all tools' }).first().click();
  await expect(page).toHaveURL(/\/tools\/?$/);
});
