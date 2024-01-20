const http = require("http");
const url = require("url");

const hostname = "127.0.0.1";
const port = 9394;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (path === "/_res/session" && method === "GET") {
        res.statusCode = 200;
        res.end(
            JSON.stringify({
                uid: `_${"x" + "m" + "i" + "n" + "d"}_1234567890`,
                group_name: "",
                phone: "18888888888",
                group_logo: "",
                user: `_${"x" + "m" + "i" + "n" + "d"}_1234567890`,
                cloud_site: "cn",
                expireDate: 4093057076000,
                emailhash: "1234567890",
                userid: 1234567890,
                if_cxm: 0,
                _code: 200,
                token: "1234567890",
                limit: 0,
                primary_email: "user@example.com",
                fullname: "user@example.com",
                type: null
            })
        );
    } else if (path === "/_api/check_vana_trial" && method === "POST") {
        res.statusCode = 200;
        res.end(JSON.stringify({ code: 200, _code: 200 }));
    } else if (path === "/_res/get-vana-price" && method === "GET") {
        res.statusCode = 200;
        res.end(
            JSON.stringify({
                products: [
                    { month: 6, price: { cny: 0, usd: 0 }, type: "bundle" },
                    { month: 12, price: { cny: 0, usd: 0 }, type: "bundle" }
                ],
                code: 200,
                _code: 200
            })
        );
    } else if (path === "/_api/events" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify({ code: 200, _code: 200 }));
    } else if (path === "/_res/user_sub_status" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify({ _code: 200 }));
    } else if (path === "/piwik.php" && method === "POST") {
        res.statusCode = 200;
        res.end(JSON.stringify({ code: 200, _code: 200 }));
    } else if (path.startsWith("/_res/token/") && method === "POST") {
        res.statusCode = 200;
        res.end(
            JSON.stringify({
                uid: `_${"x" + "m" + "i" + "n" + "d"}_1234567890`,
                group_name: "",
                phone: "18888888888",
                group_logo: "",
                user: `_${"x" + "m" + "i" + "n" + "d"}_1234567890`,
                cloud_site: "cn",
                expireDate: 4093057076000,
                emailhash: "1234567890",
                userid: 1234567890,
                if_cxm: 0,
                _code: 200,
                token: "1234567890",
                limit: 0,
                primary_email: "user@example.com",
                fullname: "user@example.com",
                type: null
            })
        );
    } else if (path === "/_res/devices" && method === "POST") {
        res.statusCode = 200;
        res.end(
            JSON.stringify({
                raw_data:
                    "TiT1ul64lE+EMrH0ogOPWHZw5r3sE+jU1l2smjmRuvxmqN3v0NPklgJI9ZpGBt3MZ/mRXM+KmmlZy/bXopy74SH7VLeg3Y1aCATUoWsY2O0XXy1I0JtvLsIF+uM6G2oOx8F6f5Wz+Embhg6b9SIF19MBckmXOOfahd0zWJDaxzpAYthagLgakhbG8k7ynXrUmGIaVmxcktxg3hnRgxlwKvJfM56x5lxF+eLY/t4EFBKfk++omYQExwflUwTrwdeP4kbQvNTMGi9v5Nmyg8Nq7w47sfc1zfeg5opDhW47JTzu29EveGXXAxgV88pjQDZMWjL5c+v4PprDSzF+KJGSfA==",
                license: {
                    status: "sub",
                    expireTime: 4093057076000
                },
                _code: 200
            })
        );
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, hostname, () => {
    console.log(`Take-over server running at http://${hostname}:${port}/`);
});

require("./crypto");
require("./electron");
