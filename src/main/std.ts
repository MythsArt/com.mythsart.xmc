export namespace STD {
    export namespace Out {
        export function write(data: string) {
            process.stdout.write(data);
        }

        export function writeLine(data?: string) {
            write(`${data ? data : ""}\r\n`);
        }
    }

    export namespace In {
        export async function nextLine(): Promise<string> {
            return new Promise((reslove) => {
                process.stdin.resume();
                process.stdin.once("data", (data: Buffer) => {
                    reslove(data.toString().trim());
                    process.stdin.pause();
                });
            });
        }
    }
}
