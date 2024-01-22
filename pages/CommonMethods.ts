import { Page, Locator, BrowserContext } from '@playwright/test';
const exec = require('child_process').exec;
const os = require('os');
import fs from 'fs';
import path from 'path';
const dfd = require('danfojs-node');
const readline = require('readline');
let df;
let rl;
let dateExecution: Date;
let dateTestQATracking: string[] = [];
let testName: string[] = [];
let reportsFolder: string;
const date: Date = new Date();
let finalReportFolder: string;
let finalReportFolderTraces: string;
let finalReportFolderVideos: string;
let finalReportFolderAllure: string;
let srcGeneratedReportsFolder: string;


export class CommonMethods{

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

    static async appendTestToTrackTxt(testName: string){
        dateExecution = new Date();
        let dateTestStarted: string = dateExecution.toString().split(' ').slice(1, 5).join('-').replace(':', '.').replace(':', '.');
        await fs.appendFile('track.txt', `${testName.split('@')[0]},${dateTestStarted}\n`, (error)=>{
            if (error){
                console.log(`Error when trying to add testName and dateTestStarted to track.txt file: ${error}`);
            }
            console.log(`test: ${testName} appended to track file correctly`);
        })
    }

    static async elementExists(page: Page, locator: string, waitingTime: number = 5000){
        try{
          await page.waitForSelector(locator, {state: 'visible', timeout: waitingTime});
          return true;
        } 
        catch{
          console.log(`Element with locator: ${locator} does NOT EXIST`);
          return false;
        }
      }

      static async moveReports(reportFolder: string){
        finalReportFolder = await reportFolder.toLowerCase() === 'traces' ? finalReportFolderTraces
                          : await reportFolder.toLowerCase() === 'videos' ? finalReportFolderVideos
                          : await reportFolder.toLowerCase() === 'allure' ? finalReportFolderAllure : 'No Report folder passed';
        srcGeneratedReportsFolder = await reportFolder.toLowerCase() === 'traces' ? './test-results'
                                  : await reportFolder.toLowerCase() === 'videos' ? './videos'
                                  : await reportFolder.toLowerCase() === 'allure' ? './allure-results' : 'No Report folder passed';
        const files = await fs.readdirSync(srcGeneratedReportsFolder);
        for (const file of files) {
          const srcPath = path.join(srcGeneratedReportsFolder, file);
          const destinationFolder: string = path.join(finalReportFolder, file);
          if(!file.includes('artifact')){
            // await fs.renameSync(srcPath, destinationFolder);
            await fs.rename(srcPath, destinationFolder, (error)=>{
              if (error){
                console.log(`Error - File ${file} could not be moved to ${destinationFolder}`);
              } 
              else {
                console.log(`File: "${file}" moved correctly to ${destinationFolder}`);
              }
            });
          }
        }
      }

      static async createReportFolder(reportFolderPath: string){
        if (!fs.existsSync(reportFolderPath)){
          fs.mkdirSync(reportFolderPath, { recursive: true })
        }
      }

      static async removePreviousReports(){
        if (os.userInfo().username != 'circleci'){
          await exec("rm -rf ../../test-results/*");
          await exec("rm -rf allure-results/*");
          await exec("rm -rf ../../allure-report");
          console.log("Reports removed");
        }
        reportsFolder = os.userInfo().username != 'circleci' ?`/Users/${os.userInfo().username}/Desktop/0-Reports/` : '/tmp/0-Reports/';
      }

      static async createReportFolders(filename: string){
        if (!fs.existsSync(reportsFolder)){
          fs.mkdirSync(reportsFolder);
        }
        const finalDate: string = date.toString().split(' ').slice(1, 5).join('-').replace(':', '.').replace(':', '.');
        finalReportFolder = reportsFolder + filename + " - " + finalDate;
        finalReportFolderTraces = reportsFolder + filename + " - " + finalDate + "/Traces";
        finalReportFolderVideos = reportsFolder + filename + " - " + finalDate + "/Videos";
        finalReportFolderAllure = reportsFolder + filename + " - " + finalDate + "/AllureReport";
        this.createReportFolder(finalReportFolder);
        this.createReportFolder(finalReportFolderTraces);
        this.createReportFolder(finalReportFolderVideos);
        this.createReportFolder(finalReportFolderAllure);
      }

      static async createCSVDataFrameWithExecutedTests(){
        rl = readline.createInterface({
          input: fs.createReadStream('track.txt'),
          crlfDelay: Infinity,
        })
        await rl.on('line', async (line: string)=>{
          await testName.push(line.split(',')[0]);
          await dateTestQATracking.push(line.split(',')[1]);
          const finalData = {
            "TestNames": testName,
            "Date": dateTestQATracking,
          }
          df = new dfd.DataFrame(finalData);
          await dfd.toCSV(df, {filePath: 'TestsQATracking.csv'});
        })
      }


 

   

 
}
