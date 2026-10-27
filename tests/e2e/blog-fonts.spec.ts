import { expect, test } from '@playwright/test';

for (const kind of ['index', 'article'] as const) {
  test(`Vietnamese font follows the blog language on the ${kind}`, async ({
    page,
  }) => {
    const fontRequests: string[] = [];
    page.on('request', (request) => {
      if (/be-vietnam-pro.*\.woff2/.test(request.url())) {
        fontRequests.push(request.url());
      }
    });

    const path = kind === 'index' ? '/blog/' : '/blog/json-trailing-commas/';
    const title = page.getByRole('heading', { level: 1 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(title).toHaveCSS('font-family', /Geist Variable/);
    expect(fontRequests).toEqual([]);

    if (kind === 'index') {
      await page
        .getByRole('navigation', { name: 'Guide language' })
        .getByRole('link', { name: 'Tiếng Việt' })
        .click();
    } else {
      await page
        .getByRole('link', { name: 'Đọc bài này bằng tiếng Việt' })
        .click();
    }

    await expect(page).toHaveURL(`/vi${path}`);
    await expect(title).toHaveCSS('font-family', /Be Vietnam Pro/);
    await page.evaluate(() => document.fonts.ready);
    expect(fontRequests.length).toBeGreaterThan(0);
    await expect(page.getByRole('banner')).toHaveCSS(
      'font-family',
      /Geist Variable/,
    );
    await expect(page.getByRole('contentinfo')).toHaveCSS(
      'font-family',
      /Geist Variable/,
    );

    if (kind === 'article') {
      await expect(page.locator('.prose p').first()).toHaveCSS(
        'font-family',
        /Be Vietnam Pro/,
      );
      await expect(page.locator('.prose code').first()).toHaveCSS(
        'font-family',
        /Geist Mono Variable/,
      );
      await page
        .getByRole('link', { name: 'Read this guide in English' })
        .click();
    } else {
      await expect(page.locator('[data-post]').first()).toHaveCSS(
        'font-family',
        /Be Vietnam Pro/,
      );
      await page
        .getByRole('navigation', { name: 'Ngôn ngữ bài viết' })
        .getByRole('link', { name: 'English' })
        .click();
    }

    await expect(page).toHaveURL(path);
    await expect(title).toHaveCSS('font-family', /Geist Variable/);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() =>
        performance
          .getEntriesByType('resource')
          .some((entry) => /be-vietnam-pro.*\.woff2/.test(entry.name)),
      ),
    ).toBe(false);
  });
}
