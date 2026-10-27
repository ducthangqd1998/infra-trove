import { expect, test } from '@playwright/test';

test.describe('Mermaid diagram rendering in blog guides', () => {
  test('renders interactive mermaid cards with SVG diagrams and tabs', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/blog/mermaid-diagram-as-code/');

    const mermaidCards = page.locator('.mermaid-card');
    await expect(mermaidCards.first()).toBeVisible();
    const count = await mermaidCards.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Verify first card has rendered SVG
    const firstCard = mermaidCards.first();
    const viewport = firstCard.locator('.mermaid-viewport');
    await expect(viewport.locator('svg')).toBeVisible();

    const controls = firstCard.locator('.mermaid-controls');
    const diagramTab = firstCard.locator('button[data-tab="diagram"]');
    const codeTab = firstCard.locator('button[data-tab="code"]');

    if (!isMobile) {
      // On desktop, controls are hidden by default until hovered
      await expect(controls).toHaveCSS('opacity', '0');

      // Hover over card reveals controls in diagram view
      await firstCard.hover();
      await expect(controls).toHaveCSS('opacity', '1');
    } else {
      // On touch devices without hover, controls are always visible
      await expect(controls).toHaveCSS('opacity', '1');
    }

    await expect(diagramTab).toHaveAttribute('aria-selected', 'true');
    await expect(codeTab).toHaveAttribute('aria-selected', 'false');
    await expect(firstCard).toHaveAttribute('data-view', 'diagram');

    // Switch to Code
    await codeTab.click();
    await expect(diagramTab).toHaveAttribute('aria-selected', 'false');
    await expect(codeTab).toHaveAttribute('aria-selected', 'true');
    await expect(firstCard).toHaveAttribute('data-view', 'code');
    await expect(firstCard.locator('pre code')).toBeVisible();

    if (!isMobile) {
      // Controls remain visible while hovering in code view
      await expect(controls).toHaveCSS('opacity', '1');

      // Blur focused button and move mouse away: controls hide in code view
      await codeTab.blur();
      await page.mouse.move(0, 0);
      await expect(controls).toHaveCSS('opacity', '0');

      // Hover again in code view: controls show again
      await firstCard.hover();
      await expect(controls).toHaveCSS('opacity', '1');
    }

    // Switch back to Diagram
    await diagramTab.click();
    await expect(firstCard).toHaveAttribute('data-view', 'diagram');
    await expect(viewport.locator('svg')).toBeVisible();
  });

  test('adapts to dark mode theme switching', async ({ page }) => {
    await page.goto('/blog/mermaid-diagram-as-code/');

    const firstCard = page.locator('.mermaid-card').first();
    const viewport = firstCard.locator('.mermaid-viewport');
    await expect(viewport.locator('svg')).toBeVisible();

    // Toggle theme to dark
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Diagram remains visible and rendered in dark mode
    await expect(viewport.locator('svg')).toBeVisible();

    // Toggle back to light
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(viewport.locator('svg')).toBeVisible();
  });

  test('renders properly with Vietnamese labels on Vietnamese guide', async ({
    page,
  }) => {
    await page.goto('/vi/blog/mermaid-diagram-as-code/');

    const firstCard = page.locator('.mermaid-card').first();
    await expect(firstCard).toBeVisible();

    const diagramTab = firstCard.locator('button[data-tab="diagram"]');
    const codeTab = firstCard.locator('button[data-tab="code"]');

    await expect(diagramTab).toHaveText('Biểu đồ');
    await expect(codeTab).toHaveText('Mã nguồn');

    const viewport = firstCard.locator('.mermaid-viewport');
    await expect(viewport.locator('svg')).toBeVisible();
  });
});
