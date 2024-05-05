import exp from 'constants';
import { JSDOM } from 'jsdom';
import { URL } from 'url';

async function crawlPage(baseURL, currentURL= baseURL, pages= {}) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }
    const normalURL = normalizeUrl(currentURL);
    if (pages[normalURL]) { // if the URL is already in the pages object
        pages[normalURL] += 1;
        return pages;
    }
    else { // if the URL is not in the pages object
        pages[normalURL] = 1;
    }
    let html;
    try {
        html = await fetchHtml(currentURL);
    } catch (error) {
        console.error(error.message + `: ${currentURL}`);
        return pages;
    }
    const urls = getURLsFromHTML(html, currentURL);
    for (const url of urls) {
        pages = await crawlPage(baseURL, url, pages);
    }
    return pages;
}

async function fetchHtml(baseURL) {
    let resp;
    try {
        resp = await fetch(baseURL);
    } catch (error) {
        throw new Error('Got Network Error: ' + error.message);
    }
    if (resp.status >= 400) {
        throw new Error(`Got HTTP Error: ${resp.status} ${resp.statusText}`);
    }
    //console.log("fetch successful")
    const contentType = resp.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
        throw new Error('Error: Not an HTML page');
    }
    return resp.text();
}

function normalizeUrl(url) {
    try {
        const urlObj = new URL(url);
        url = urlObj.hostname.toString() + urlObj.pathname.toString();
    } catch (error) {
        return new Error(error.message);
    }        
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    return url;

}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const urls = [];
    const anchors = Array(...dom.window.document.querySelectorAll('a'));
    for ( const url of anchors) {
        if (!url.hasAttribute('href')) {
            console.log('No href attribute');
            continue;
        }
        let href = url.getAttribute('href');
        try {
        href = new URL(href, baseURL).href;
        urls.push(href);
        } catch (error) {
            return new Error(`${error.message}: ${href}`);
        }
    }
    //console.log(urls);
    return urls;
}

function sortPages(pages) {
    return Object.entries(pages).sort((a,b) => b[1] - a[1]);
}

export { sortPages };
export { crawlPage };
export { normalizeUrl };
export { getURLsFromHTML };