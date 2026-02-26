const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    const PORT = process.env.PORT || 3000
    const BASE = `http://localhost:${PORT}`

    const clientPage = await context.newPage();
    console.log('Opening client page...', BASE);
    console.log('-> navigating to client page (timeout 60s)')
    await clientPage.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('-> client page loaded')

    // Wait for toggle
    console.log('-> waiting for theme toggle on client (timeout 15s)')
    await clientPage.waitForSelector('button[aria-label="Toggle theme"]', { timeout: 15000 });

    // Ensure initial values
    const clientBefore = await clientPage.evaluate(() => localStorage.getItem('client-theme'));
    console.log('client localStorage before:', clientBefore);

    // Click toggle in client (will update client-theme)
    console.log('-> clicking client toggle')
    await clientPage.click('button[aria-label="Toggle theme"]');
    await clientPage.waitForTimeout(800);
    const clientAfter = await clientPage.evaluate(() => localStorage.getItem('client-theme'));
    console.log('client localStorage after:', clientAfter);
    const clientHasDark = await clientPage.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log('client documentElement has .dark:', clientHasDark);

    // Open admin page in new tab
    const adminPage = await context.newPage();
    console.log('Opening admin dashboard page...', BASE + '/dashboard/home');
    console.log('-> navigating to admin page (timeout 60s)')
    await adminPage.goto(`${BASE}/dashboard/home`, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('-> admin page loaded')
    await adminPage.waitForTimeout(800);

    const adminBefore = await adminPage.evaluate(() => localStorage.getItem('admin-theme'));
    console.log('admin localStorage before:', adminBefore);

    // Click toggle in admin
    console.log('-> searching for admin toggle button')
    const adminToggle = await adminPage.$('button:has-text("الوضع الليلي")') || await adminPage.$('button:has-text("الوضع الفاتح")');
    if (adminToggle) {
      console.log('-> clicking admin toggle')
      await adminToggle.click();
      await adminPage.waitForTimeout(800);
    } else {
      console.log('admin toggle button not found');
    }

    const adminAfter = await adminPage.evaluate(() => localStorage.getItem('admin-theme'));
    console.log('admin localStorage after:', adminAfter);
    const adminHasDark = await adminPage.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log('admin documentElement has .dark:', adminHasDark);

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    await browser.close();
    process.exit(1);
  }
})();
