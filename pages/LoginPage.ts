import { Page, test } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly UsernameInput: string;
  readonly PasswordInput: string;
  readonly LoginButton: string;
  readonly MenuButton: string;

  constructor(page: Page) {
    this.page = page;
    this.UsernameInput = 'input[placeholder="Username"]';
    this.PasswordInput = 'input[placeholder="Password input field"]';
    this.LoginButton = 'input[placeholder="Login button"]';
    this.MenuButton = '[content-desc="open menu"]';
  }

  async enterUsername(email: string) {
    await test.step('Enter Username on email input field', async () => {
      await this.page.fill(this.UsernameInput, email);
    });
  }

  async enterPassword(password: string) {
    await test.step('Enter Password on password input field', async () => {
      await this.page.fill(this.PasswordInput, password);
    });
  }

  async clickContinueButton() {
    await test.step('Click Continue Button for Login process', async () => {
      await this.page.tap(this.LoginButton);
    });
  }

  async clickMenuButton() {
    await test.step('Click Continue Button for Login process', async () => {
      await this.page.tap(this.MenuButton);
    });
  }

  async login(email: string, password: string) {
    await test.step('Login With Valid Credentials', async () => {
      await this.enterUsername(email);
      await this.enterPassword(password);
      await this.clickContinueButton();
    });
  }
}
