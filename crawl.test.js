import { test, expect } from '@jest/globals';
import { getURLsFromHTML, normalizeUrl, sortPages } from './crawl.js';

const links = `<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <header>
        <nav>
            <a href="https://blog.boot.dev">Blog</a>
            <a href="https://api.boot.dev">API</a>
        </nav>
    </header>
    <main>
        <section>
            <h1>Welcome to the Test Page</h1>
            <p>This is a test page with multiple URLs. Check out <a href="/multipleurls/here">Example</a></p>
        </section>
        <section>
            <h2>More Information</h2>
            <p>For more information, visit <a href="https://help.boot.dev">Example 4</a></p>
        </section>
    </main>
    <footer>
        <a href="/relative/path1">Privacy Policy</a>
        <a href="/relative/path2">Terms of Service</a>
    </footer>
</body>
</html>`;

test('normalizeUrl http', () => {
    expect(normalizeUrl('http://example.com/javascript/one'))
    .toBe('example.com/javascript/one');
});
test('normalizeUrl https', () => {
    expect(normalizeUrl('https://example.com/js/two'))
    .toBe('example.com/js/two');
});
test('normalizeUrl trailing slash', () => {
    expect(normalizeUrl('http://example.com/trailing/'))
    .toBe('example.com/trailing');
});
test('normalizeUrl invalid', () => {
    expect(normalizeUrl('example.com'))
    .toStrictEqual(new Error('Invalid URL'));
});

test('getURLsFromHTML single baseurl', () => {
    expect(getURLsFromHTML(`<html>
        <body>
            <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
        </body>
    </html>`
    , 'https://blog.boot.dev'))
    .toStrictEqual(Array('https://blog.boot.dev/'));
});

test('getURLsFromHTML single refurl', () => {
    expect(getURLsFromHTML(`<html>
        <body>
            <a href="/xdev/tree"><span>Xdev Tree</span></a>
        </body>
    </html>`
    , 'https://blog.boot.dev'))
    .toStrictEqual(Array('https://blog.boot.dev/xdev/tree'));
});

test('getURLsFromHTML mixed urls', () => {
    expect(getURLsFromHTML(
      links
    , 'https://blog.boot.dev'))
    .toStrictEqual(Array('https://blog.boot.dev/'
                        ,'https://api.boot.dev/'
                        ,'https://blog.boot.dev/multipleurls/here'
                        ,'https://help.boot.dev/'
                        ,'https://blog.boot.dev/relative/path1'
                        ,'https://blog.boot.dev/relative/path2'));
});

test('getURLsFromHTML no urls', () => {
    expect(getURLsFromHTML(`<html>
        <body>
            <p>There are no URLs in this HTML</p>
        </body>
    </html>`, 'https://blog.boot.dev'))
    .toStrictEqual(Array());
});

test('sortPages', () => {
    expect(sortPages({'example.com': 2, 'example.org': 1, 'example.net': 3}))
    .toStrictEqual([['example.net', 3], ['example.com', 2], ['example.org', 1]]);
});