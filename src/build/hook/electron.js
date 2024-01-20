const electron = require("electron");

const originalNet = electron.net;
const originalRequest = originalNet.request;

Object.defineProperty(originalNet, "request", {
    get() {
        return function (options, callback) {
            let url = options["url"];
            if (url.indexOf("/_api/share/vana_map/?lang=zh") > -1 || url.indexOf("/_api/share/maps") > -1) {
            } else {
                url = url.replace(`https://www.${"x" + "m" + "i" + "n" + "d"}.cn`, "http://127.0.0.1:9394");
                // url = url.replace(`https://www.${"x" + "m" + "i" + "n" + "d"}.com`, "http://127.0.0.1:9394");
            }
            options["url"] = url;
            const req = originalRequest(options, callback);
            req.on("response", (response) => {
                let data = "";
                response.on(
                    "data",
                    function (chunk) {
                        data += chunk;
                        chunk = "FUCKING data";
                        this.emit("continue", chunk);
                    }.bind(response)
                );
                response.on(
                    "end",
                    function () {
                        console.log(">>> Intercepting net.request with options: \n", options, "\n>>> Response:\n", data);
                        this.emit("continue");
                    }.bind(response)
                );
            });
            return req;
        };
    }
});

module.exports = electron;
