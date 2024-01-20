const crypto = require("crypto");

const originalPublicDecrypt = crypto.publicDecrypt;

const originalPublicDecryptEx = function (message) {
    const _key = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDYH31l0llicBavbUZRg0y1LnI\n2JJuPZak0498wGmK0N+ksqCzA0XUfCgQ5E9itYyPuT+z6Pz/+0q6NeApkWcnC/Th\nWQY6ZlEOMonrhPub8zsWYOZzckQutx3jn6k+6ZXx7yUbbkxIk+wqWgnlQxnx6TMd\nS3rgo3r4blFTWi6EEQIDAQAB\n-----END PUBLIC KEY-----`;
    const n = originalPublicDecrypt(
        {
            key: _key,
            padding: 1
        },
        message
    );
    return n;
};

Object.defineProperty(crypto, "publicDecrypt", {
    get() {
        return function myPublicDecrypt(...args) {
            console.trace(">>> Hook trace.");
            console.log(">>> Hook start.");

            args[0]["key"] =
                "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqIGfghxs/schjid+mHlK\nAQhWHm1z1uPX/CWr2TBHPcg3PDmF8vViyhuxpkVe4/X4Tz9hN9BGA+h7toHUw6rK\nz2Mk5M5peG5Id4DVLADuVdpcbjo0Ypc0mOdDDTJtlc2T8q10rdGYD0ErpeR9Su9i\naJxDWMOLlNzpmWXpgKQWjRuzoIrOiiHvGzAiSrCMKt6m+/m+Svr5CQHw+/Jx1iAw\nyMZIMwux8gsgawVtU1u6MmIB9px4JncFepsg3FdSEbqdYZL3MeExDT7PPh2GQcbS\nfcl1gYTrCgJFUZUr2JBOSVIoIvGATH7VIMYBWantbAiQgGqkJstXb8UngEM4hrsX\nuQIDAQAB\n-----END PUBLIC KEY-----";
            let result;
            try {
                result = originalPublicDecrypt.call(this, ...args);
                let data = JSON.parse(result.toString());
                result = Buffer.from(JSON.stringify(data));
                crypto.log(">>> Key crack succeed. ", data);
                console.log(">>> Key crack succeed. ", data);
            } catch (e) {
                crypto.log(">>> Crack failed, use official decrypt.");
                result = null;
                let ori = originalPublicDecryptEx(args[1]);
                crypto.log(">>> Crack error ", args[1].toString("base64"), "\n >>> Official decrypt ", ori, "\n>>> Detail\n", e);
                result = ori;
            }
            return result;
        };
    }
});

Object.defineProperty(crypto, "log", {
    get() {
        return function log(...args) {
            console.log(...args);
        };
    }
});

module.exports = crypto;
