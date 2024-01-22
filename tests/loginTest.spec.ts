import { test, expect, _android as android, AndroidDevice, Page, BrowserContext } from '@playwright/test';
import { CommonMethods } from '../pages/CommonMethods';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CREDENTIALS, APP } from '../data/constants';

let androidDevice: AndroidDevice;
let browserContext: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let homePage: HomePage;

test.describe('Mobile Automation Test', () => {
  test.beforeAll(async () => {
    await CommonMethods.removePreviousReports();
    await CommonMethods.createReportFolders('android-test');

    const [device] = await android.devices();

    // Stop the app if it's running
    await device.shell(`am force-stop ${APP.APP_PACKAGE_NAME}`);

    // Install and launch the app
    const apkPath = APP.APP_PATH;
    await device.shell(`pm install -r ${apkPath}`);
    await device.shell(`monkey -p ${APP.APP_PACKAGE_NAME} -c android.intent.category.LAUNCHER 1`);

    // Launch the server
    const browserServer = await android.launchServer();

    // Connect to the device and create a new BrowserContext
    const wsEndpoint = browserServer.wsEndpoint();
    androidDevice = await android.connect(wsEndpoint);
    //browserContext = await androidDevice.launchBrowser();
    page = await browserContext.newPage();

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test.afterAll(async () => {
    await androidDevice.close();
  });

  test.beforeEach(async ({}, testInfo) => {
    testInfo.setTimeout(60 * 1000);
    await CommonMethods.appendTestToTrackTxt(testInfo.title);
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
