import { expect, test } from '@playwright/test';

test('new tools are discoverable and each guide has a Vietnamese translation', async ({
  page,
}) => {
  await page.goto('/tools/');
  await expect(page.locator('[data-tool-card]')).toHaveCount(12);
  for (const [slug, guide] of [
    ['yaml-json-converter', 'yaml-json-conversion'],
    ['jwt-decoder', 'jwt-claims-without-verification'],
    ['storage-unit-converter', 'storage-units-gb-gib'],
    ['hash-checksum', 'verify-file-checksum'],
  ]) {
    await page.goto(`/tools/${slug}/`);
    await page
      .getByRole('link', { name: 'Read the guide', exact: false })
      .click();
    await expect(page).toHaveURL(new RegExp(`/blog/${guide}/$`));
    await page
      .getByRole('link', { name: 'Đọc bài này bằng tiếng Việt' })
      .click();
    await expect(page).toHaveURL(new RegExp(`/vi/blog/${guide}/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  }
});

test('converter and token input stays out of requests, storage and URLs', async ({
  page,
}) => {
  const secret = 'private-note-4d37';
  const token =
    Buffer.from('{"alg":"HS256"}').toString('base64url') +
    '.' +
    Buffer.from(JSON.stringify({ sub: secret })).toString('base64url') +
    '.c2ln';
  for (const [slug, field, input] of [
    ['yaml-json-converter', 'YAML input', `note: ${secret}`],
    ['jwt-decoder', 'JWT token', token],
    ['storage-unit-converter', 'Amount', '123456789.123456789'],
  ]) {
    await page.goto(`/tools/${slug}/`);
    const control = page.getByLabel(field, { exact: true });
    await expect(control).toBeEnabled();
    const requests: string[] = [];
    // Fonts load lazily the first time a glyph needs them; they are static assets, not tool data.
    const listener = (request: { url(): string }) => {
      if (!/\.woff2?$/.test(new URL(request.url()).pathname))
        requests.push(request.url());
    };
    page.on('request', listener);
    await control.fill(input);
    if (slug === 'yaml-json-converter') {
      await page.getByRole('button', { name: 'Convert', exact: true }).click();
      await expect(page.getByLabel('JSON output')).toHaveValue(
        new RegExp(secret),
      );
    } else if (slug === 'jwt-decoder')
      await expect(page.getByLabel('Decoded payload')).toHaveValue(
        new RegExp(secret),
      );
    else await expect(page.getByTestId('storage-result-B')).not.toBeEmpty();
    expect(requests).toEqual([]);
    const state = await page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
        url: location.href,
      }),
    );
    expect(state).not.toContain(input);
    expect(state).not.toContain(secret);
    await page.reload();
    await expect(page.getByLabel(field, { exact: true })).toHaveValue('');
    page.off('request', listener);
  }
});

test('YAML converts both ways, downloads output and preserves invalid input', async ({
  page,
}) => {
  await page.goto('/tools/yaml-json-converter/');
  await page.getByLabel('YAML input').fill('name: Tiếng Việt\nreplicas: 3');
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(page.getByLabel('JSON output')).toHaveValue(
    '{\n  "name": "Tiếng Việt",\n  "replicas": 3\n}',
  );
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download output' }).click();
  expect((await download).suggestedFilename()).toBe('converted.json');
  await page.getByRole('button', { name: 'Swap direction' }).click();
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(page.getByLabel('YAML output')).toHaveValue(/replicas: 3/);
  await page.getByLabel('JSON input').fill('{bad');
  await expect(page.getByLabel('YAML output')).toHaveValue('');
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(page.getByRole('alert')).not.toBeEmpty();
  await expect(page.getByLabel('JSON input')).toHaveValue('{bad');
});

test('JWT inspects claims and clears stale output on malformed tokens', async ({
  page,
}) => {
  await page.goto('/tools/jwt-decoder/');
  await page.getByRole('button', { name: 'Load example' }).click();
  await expect(page.getByLabel('Decoded payload')).toHaveValue(/demo-user/);
  await expect(
    page.getByText('Signature not verified', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('1970-01-01T00:00:00.000Z', { exact: true }).first(),
  ).toBeVisible();
  await page.getByLabel('JWT token').fill('bad.token');
  await expect(page.getByLabel('Decoded payload')).toHaveValue('');
  await expect(page.locator('#jwt-status')).toContainText('three');
});

test('storage distinguishes GB from GiB and handles zero and invalid amounts', async ({
  page,
}) => {
  await page.goto('/tools/storage-unit-converter/');
  await page.getByLabel('Amount', { exact: true }).fill('1');
  await page.getByRole('combobox', { name: 'Source unit' }).click();
  await page
    .getByRole('option', { name: 'GiB (gibibytes)', exact: true })
    .click();
  await expect(page.getByTestId('storage-result-B')).toHaveText('1073741824');
  await page.getByLabel('Amount', { exact: true }).fill('0');
  await expect(page.getByTestId('storage-result-B')).toHaveText('0');
  await page.getByLabel('Amount', { exact: true }).fill('-1');
  await expect(page.locator('#storage-status')).toContainText('non-negative');
  await expect(page.getByTestId('storage-result-B')).toHaveCount(0);
});

test('hashes text and files locally, compares checksums and prevents stale results', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/tools/hash-checksum/');
  await expect(
    page.getByRole('button', { name: 'Calculate hash', exact: true }),
  ).toBeEnabled();
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  const digest =
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
  await page.getByLabel('Text to hash').fill('abc');
  await page
    .getByRole('button', { name: 'Calculate hash', exact: true })
    .click();
  await expect(page.getByLabel('Computed checksum')).toHaveValue(digest);
  await page.getByLabel('Expected checksum').fill(digest.toUpperCase());
  await expect(
    page.getByText('Checksums match', { exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Copy checksum', exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    digest,
  );
  await page.getByLabel('Text to hash').fill('changed');
  await expect(page.getByLabel('Computed checksum')).toHaveValue('');
  await page.getByRole('button', { name: 'File', exact: true }).click();
  await page.getByLabel('Choose file').setInputFiles({
    name: 'test.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('abc'),
  });
  await page
    .getByRole('button', { name: 'Calculate hash', exact: true })
    .click();
  await expect(page.getByLabel('Computed checksum')).toHaveValue(digest);
  await expect(
    page.getByText('Checksums match', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Expected checksum').fill('b'.repeat(64));
  await expect(
    page.getByText('Checksums do not match', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page.getByRole('button', { name: 'File', exact: true }).click();
  await page
    .getByRole('button', { name: 'Calculate hash', exact: true })
    .click();
  await expect(page.locator('#hash-status')).toContainText('Choose a file');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.getByLabel('Computed checksum')).toHaveValue('');
  expect(requests).toEqual([]);
  const storage = await page.evaluate(() =>
    JSON.stringify({
      local: { ...localStorage },
      session: { ...sessionStorage },
      url: location.href,
    }),
  );
  expect(storage).not.toContain(digest);
  expect(storage).not.toContain('test.txt');
});
