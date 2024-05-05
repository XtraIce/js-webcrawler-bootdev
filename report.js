import { sortPages } from "./crawl.js";

function printReport(pages){
    console.log("Report is starting...\n");

    pages = sortPages(pages);

    for (const page of pages) {
        console.log(`Found ${page[1]} internal links to ${page[0]}`);
    }
}

export { printReport };