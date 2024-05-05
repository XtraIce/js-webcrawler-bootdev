import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
    // get the URL from the command line
    // if no arguments are provided, print a usage message

    if (process.argv.length < 3) {
        return console.error(...['Requires URL\nUsage: node main.js <url>']);
    } 
    else if (process.argv.length > 3) {
        return console.error(...['Too Many Arguments\nUsage: node main.js <url>']);
    }
    const baseURL = process.argv[2];
    console.log(`starting crawl at baseURL: ${baseURL}`);

    // call the crawlPage function with the URL
    const pages = await crawlPage(baseURL);
    printReport(pages);
}

main();