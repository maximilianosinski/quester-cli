const fetch = require("node-fetch");
const prompt = require("prompt-sync")({sigint: true});
const fs = require("fs");

let response;
(async () => {
    while(true) {
        const option = parseInt(prompt("Manual Inputs (1) | From Quester File (2) > "));
        let config = {};
        if(option === 2) {
            const path = prompt("Path > ");
            config = JSON.parse(fs.readFileSync(path, "utf8"));
        }
        const url = config["url"] ?? prompt("URL > ");
        const method = config["method"] ?? prompt("Method > ");
        const headersPrompt = config["headers"] ?? prompt("Headers > ");
        let headers = config["headers"] ?? {};
        if(headersPrompt !== "" && headers === {}) {
            headers = JSON.parse(headersPrompt);
        }
        let data;
        if(method === "POST" || method === "PUT") {
            data = config["body"] ?? prompt("Body > ");
            response = await fetch(url, {
                method: method.toUpperCase(),
                body: data,
                headers: headers
            });
        } else {
            data = config["query"] ?? prompt("Query > ");
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
                console.error(await response.text());
            }
        }
        if(Object.keys(config).length === 0 && config.constructor === Object) {
            const saveOption = prompt("Save as quester config? (yes/no) > ").toLowerCase();
            if(saveOption === "yes") {
                const configJson = {
                    url: url,
                    method: method,
                    headers: headers
                };
                if(method === "POST" || method === "PUT") {
                    configJson["body"] = data;
                } else {
                    configJson["query"] = data;
                }
                if(!fs.existsSync("./questers")) {
                    fs.mkdirSync("./questers");
                }
                fs.writeFileSync(`./questers/${method}-${url.replace(/^https?:\/\//, "").replaceAll("/", "-")}.json`, JSON.stringify(configJson));
            }
        }
        console.log();
    }
})();