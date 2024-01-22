import { test, expect, _android as android, BrowserServer, Page, AndroidDevice } from '@playwright/test';
import { CommonMethods } from '../pages/CommonMethods';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CREDENTIALS, APP } from '../data/constants';

let browserServer: BrowserServer;
let androidDevice: AndroidDevice;  // Cambié el tipo de browserContext a AndroidDevice
let page: Page;
let loginPage: LoginPage;
let homePage: HomePage;

test.describe('Mobile Automation Test', async () => {
  test.beforeAll(async () => {
    await CommonMethods.removePreviousReports();
    await CommonMethods.createReportFolders('android-test');
    browserServer = await android.launchServer();
  });

  test.afterAll(async () => {
    await browserServer.close();
  });

  test.beforeEach(async ({}, testInfo) => {
    testInfo.setTimeout(60 * 1000);
    await CommonMethods.appendTestToTrackTxt(testInfo.title);

    const [device] = await android.devices();
    console.log(`Model: ${device.model()}`);
    console.log(`Serial: ${device.serial()}`);
    await device.screenshot({ path: 'device.png' });

    // Stop the app if it's running
    await device.shell(`am force-stop ${APP.APP_PACKAGE_NAME}`);

    // Install and launch the app
    const apkPath = APP.APP_PATH;
    await device.shell(`pm install -r ${apkPath}`);
    await device.shell(`monkey -p ${APP.APP_PACKAGE_NAME} -c android.intent.category.LAUNCHER 1`);

    // Connect to the device and get the AndroidDevice
    androidDevice = await android.connect(browserServer.wsEndpoint());

    // Create a new page within the AndroidDevice
    page = await androidDevice.newWebViewPage();

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test.afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  test('User can login with valid credentials', async () => {
    await loginPage.clickMenuButton();
    await loginPage.login(CREDENTIALS.VALID_USERNAME, CREDENTIALS.VALID_PASSWORD);
    await expect.soft(await homePage.validateSuccesfullLoginGreeting()).toBeTruthy();
  });
});