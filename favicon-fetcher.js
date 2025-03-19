const REGEX_GET_ICO = /<link(.|\n)*?href="(?<href>.*?(\.png|\.ico).*?)"(.|\n)*?>/gi;

/**
 * 
 * @param {string} oldUrl 
 * @returns {string}
 */
export function _getBaseUrl(oldUrl) {
    if (!oldUrl.includes("/")) {
        return oldUrl;
    }
    else if (oldUrl.includes("://")) {
        const urlWithoutProtocol = oldUrl.substring(oldUrl.indexOf("://") + 3);
        if (!urlWithoutProtocol.includes("/")) {
            return oldUrl;
        } else {
            let newUrl = oldUrl.substring(0, oldUrl.indexOf("://") + 3);
            newUrl += urlWithoutProtocol.substring(0, urlWithoutProtocol.indexOf("/"))
            return newUrl;
        }
    }
    else if (oldUrl.includes("/")) {
        return oldUrl.substring(0, oldUrl.indexOf("/"));
    }
}

/**
 * 
 * Turns a HTML string into favicon href's
 * 
 * @param {string} html string of HTML code
 * @param {string|null} url Add specified url to the start of favicons, if not was already there. Null/disabled by default
 * 
 * @returns {Array<string>} ["/favicon.ico", "/icon.png"] || ["https://example.com/favicon.ico", "https://example.com/logo.png"]
 */
export function getFaviconsFromHtmlString(html, url=null) {
    try {
        const icoPathsMatches = Array.from(
            html.matchAll(REGEX_GET_ICO))
            .map((match) => match.groups.href);
        if (url === null) {
            return icoPathsMatches;
        } else {
            const icoPaths = icoPathsMatches.map((icoPath) => {
                if (icoPath.includes("://")) {
                    return icoPath
                }
                const addition = icoPath.startsWith("/") ?
                    "" : "/";
                return url + addition + icoPath;
            })
            return icoPaths;
        }
    } catch (e) {
        console.log("Error during parsing favicons from HTML");
        throw e;
    }
}

/**
 * 
 * @param {String} url 
 * 
 * @returns {Promise<Response>}
 */
export async function _request(url) {
    return new Promise(async (resolve, reject) => {
        fetch(url)
            .then((response) => {resolve(response)})
            .catch((e) => {
                console.log("Error whilst requesting data from " + url);
                reject(e);
            });
    });
}



/*
async function downloadFavicon(url, outputFilename, tried={baseDomain:false, fromHtml:false}) {
    const fullOutputFilename = "src/assets/" + outputFilename + ".ico";
    return new Promise(async (resolve, reject) => {
        let error;
        try {
            const requestUrl = url.endsWith(".ico") ?
                url : join(url, "favicon.ico")
            console.log("Requesting favicon from " + requestUrl)
            const data = await fetch(requestUrl);
            // Thanks to antonok on https://stackoverflow.com/a/74722818
            const body = data.body;
            if (data.status < 400) {
                const stream = createWriteStream(fullOutputFilename);
                await finished(Readable.fromWeb(body).pipe(stream))
                resolve(fullOutputFilename);
            }
        } catch (e) {
            error = e;
        }
        if (!tried.fromHtml) {
            tried.fromHtml = true;
            const requestUrl = url.endsWith(".ico") ?
                url.substring(0, url.lastIndexOf("/") + 1) :
                url;
            console.log("Determining favicon from " + requestUrl)
            const data = await fetch(requestUrl);
            contents = await data.text();
            console.log(contents)
            console.log("***")
            try {
                const icoPath = contents.match(REGEX_GET_ICO)[0];
                let newUrl;
                if (icoPath.startsWith("/")) {
                    newUrl = join(getBaseUrl(url), icoPath);
                } else {
                    newUrl = join(url, icoPath);
                }
                downloadFavicon(newUrl, outputFilename, tried).then(resolve);
            } catch (e) {
                console.log("Error during determining faivcon from HTML")
                console.log(`status code: ${data.status}, url: ${url}, outputFilename: ${outputFilename}, tried: ${JSON.stringify(tried)}`);
                throw e;
            }
            
        } else if (!tried.baseDomain) {
            tried.baseDomain = true;
            downloadFavicon(getBaseUrl(url), outputFilename, tried).then(resolve);
        } else if (error) {
            console.log(`Error whilst downloading favicon. URL: ${url}, outputFilename: ${outputFilename}, tried: ${JSON.stringify(tried)}`)
            throw error;
        }
    });
}
*/