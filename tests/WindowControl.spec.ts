import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from '@playwright/test';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    executablePath: "C:\\Program Files\\Kryptos\\Free\\KryptosFree.exe"
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

test('Pencere Kontrolü', async () => {
  // Bütün pencereleri al
  const windows = await electronApp.context().pages();
  
  // Pencerelerin sayısını kontrol et
  expect(windows.length).toBe(1); // Uygulamanın sadece bir pencereye sahip olmasını bekliyoruz
  
  for (const window of windows) {
    // Pencerenin boyutlarını al
    const size = await window.viewportSize();

    if (size) {
      console.log(`Pencere Boyutları: ${size.width}x${size.height}`);
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
    } else {
      throw new Error('Pencere boyutlarına erişilemiyor.');
    }

    // Pencerenin konumunu al
    const position = await window.evaluate(() => ({ x: globalThis.screenX, y: globalThis.screenY }));

    console.log(`Pencere Konumu: (${position.x}, ${position.y})`);
    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.y).toBeGreaterThanOrEqual(0);
  }
});
