import Log4js from "log4js";

export namespace Application {
    export abstract class MainClass {
        public abstract mounted(): void;
    }

    export function Main<T extends { new (): MainClass }>(target: T): void {
        const main = new target(); /* Main instance */
        // Logger initialize
        {
            // configure
            Log4js.configure({
                appenders: {
                    raw: {
                        type: "stdout",
                        layout: {
                            type: "pattern",
                            pattern: "[%d{yyyy-MM-dd hh:mm:ss}] <%z> [%p] - %m"
                        }
                    }
                },
                categories: {
                    default: {
                        appenders: ["raw"],
                        level: "ALL",
                        enableCallStack: true
                    }
                }
            });
            // replace default console output levels
            const consoleLogger = Log4js.getLogger("console");
            console.log = consoleLogger.info.bind(consoleLogger);
            console.info = consoleLogger.info.bind(consoleLogger);
            console.warn = consoleLogger.warn.bind(consoleLogger);
            console.error = consoleLogger.error.bind(consoleLogger);
            console.trace = consoleLogger.trace.bind(consoleLogger);
            console.debug = consoleLogger.debug.bind(consoleLogger);
            console.debug("Logger initialized.");
        }
        // Mounted
        main.mounted();
    }
}
