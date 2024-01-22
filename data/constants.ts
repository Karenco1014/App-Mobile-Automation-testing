require('dotenv').config();

export const CREDENTIALS: {
    VALID_USERNAME: string,
    VALID_PASSWORD: string,
} = {
    VALID_USERNAME: process.env.VALID_USERNAME!,
    VALID_PASSWORD: process.env.VALID_PASSWORD!,
}

export const APP: {
    APP_PACKAGE_NAME: string,
    APP_PATH: string,
    APP_PACKAGE_ACTIVITY:string,
} = {
    APP_PACKAGE_NAME: process.env.APP_PACKAGE_NAME!,
    APP_PATH: process.env.APP_PATH!,
    APP_PACKAGE_ACTIVITY: process.env.APP_PACKAGE_ACTIVITY!,
}