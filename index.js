const fetch = require("node-fetch");
const prompt = require("prompt-sync")({sigint: true});

let response;
(async () => {
    while(true) {
        const url = prompt("URL > ");
        const method = prompt("Method > ");
        const headersPrompt = prompt("Headers > ");
        let headers = {};
        if(headersPrompt !== "") {
            headers = JSON.parse(headersPrompt);
        }
        let data;
        if(method === "POST" || method === "PUT") {
            data = prompt("Body > ");
            response = await fetch(url, {
                method: method.toUpperCase(),
                body: data,
                headers: headers
            });
        } else {
            data = prompt("Query > ");
            response = await fetch(`${url}?${data}`, {
                method: method.toUpperCase(),
                headers: headers
            });
        }
        console.log();
        const contentType = response.headers.get("Content-Type");
        console.log(`Response: HTTP ${response.status} | ${contentType}`);
        if(contentType === "application/json") {
            if(response.status >= 200 && response.status <= 399) {
                console.log(await response.json());
            } else {
                console.error(await response.json());
            }
        } else {
            if(response.status >= 200 && response.status <= 399) {
                console.log(await response.text());
            } else {
                console.log(await response.text());
            }
        }
        console.log();
    }
})();