import { Page, Locator, test } from '@playwright/test';
import { CommonMethods } from '../pages/CommonMethods';


export class HomePage{

    readonly page: Page;
    readonly loggedInGreetingXpath: string;
   
    constructor(page: Page){
        this.page = page;
        this.loggedInGreetingXpath = "(//android.widget.TextView[@text='Products'])";
       
    }

    async validateSuccesfullLoginGreeting(): Promise<Boolean>{
        return await test.step('Validate that after login in with valid credentials we have the "Products" label displayed', async ()=>{
            return await CommonMethods.elementExists(this.page, this.loggedInGreetingXpath);
        })
    }



}

   