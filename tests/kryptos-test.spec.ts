import { expect, test } from '@playwright/test';
import { ElectronApplication, Page, _electron as electron } from '@playwright/test';

let electronApp: ElectronApplication;
let page: Page; 
let password = "1"; // DEĞİŞMELİ

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.beforeAll(async () => {
  process.env.CI = 'e2e'
  electronApp = await electron.launch({
    executablePath: "C:\\Program Files\\Kryptos\\Free\\KryptosFree.exe"
  });

  electronApp.on('window', async (newPage) => {
    page = newPage;
    const filename = page.url()?.split('/').pop();
    console.log(`Window opened: ${filename}`)

    page.on('pageerror', (error) => {
      console.error(error)
    })

    page.on('console', (msg) => {
      console.log(msg.text())
    })
  })
});

test.afterAll(async () => {
  await sleep(10000);
  await electronApp.close();
});

test('Uygulamaya login yap', async () => {
  test.setTimeout(120000);
  
  const timeout = 120000; 
  const startTime = Date.now();

  if (!page) {
    throw new Error('No page available');
  }

  if ((await page.title()) !== "Kryptos Free") {
    while (true) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for the login window');
      }
      const newPage = await electronApp.waitForEvent('window');
      const title = await newPage.title();
      if (title == "Kryptos Free") {
        page = newPage;
        break;
      }
    }
  }

  await sleep(30000);
  await page.getByRole('textbox').fill(password);
  await page.$$eval('button', (buttons, index) => buttons[index].click(), 1);

  const newWindow = await electronApp.waitForEvent('window');
  const newWindowTitle = await newWindow.title();
  expect(newWindowTitle).toBe('Kryptos Free');
  
  page = newWindow;
});
