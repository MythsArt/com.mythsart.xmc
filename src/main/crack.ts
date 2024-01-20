import { STD } from "./std";
import _Regedit from "regedit";
import FileStream from "fs";
import Path from "path";
import ASAR from "@electron/asar";
import { HookFileDeclare } from "../hook-file-declare";
import _HookJson from "../build/hook.json";

const HookJson: HookFileDeclare = _HookJson;

// set external regedit script
const regeditExternalScriptPath = Path.join(process.cwd(), "/scripts");
_Regedit.setExternalVBSLocation(regeditExternalScriptPath);
const Regedit = require("regedit").promisified;
console.debug(`External regedit script path: "${regeditExternalScriptPath}".`);
console.debug(`__dirname = "${__dirname}"`);

export namespace Crack {
    async function getXmVersion(): Promise<string> {
        // start
        return new Promise<string>(async (resolve) => {
            // find list
            const regKey = `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\`;
            const uninsList = await Regedit.list(["HKCU\\", regKey]);
            // find xm
            let version: string | undefined = undefined;
            for (const key of uninsList[regKey].keys) {
                const _regKey = `${regKey}${key}\\`;
                const appList = await Regedit.list([_regKey]);
                // get version
                if (appList[_regKey].values["DisplayName"].value.toString().indexOf(`${"X" + "m" + "i" + "n" + "d"}`) !== -1) {
                    version = appList[_regKey].values["DisplayVersion"].value.toString();
                }
            }
            if (version !== undefined) {
                resolve(version);
            } else {
                throw new Error("Version data not found.");
            }
        });
    }

    const rsaOriginalCode: string =
        "String.fromCharCode(45,45,45,45,45,66,69,71,73,78,32,80,85,66,76,73,67,32,75,69,89,45,45,45,45,45,10,77,73,71,102,77,65,48,71,67,83,113,71,83,73,98,51,68,81,69,66,65,81,85,65,65,52,71,78,65,68,67,66,105,81,75,66,103,81,67,68,89,72,51,49,108,48,108,108,105,99,66,97,118,98,85,90,82,103,48,121,49,76,110,73,10,50,74,74,117,80,90,97,107,48,52,57,56,119,71,109,75,48,78,43,107,115,113,67,122,65,48,88,85,102,67,103,81,53,69,57,105,116,89,121,80,117,84,43,122,54,80,122,47,43,48,113,54,78,101,65,112,107,87,99,110,67,47,84,104,10,87,81,89,54,90,108,69,79,77,111,110,114,104,80,117,98,56,122,115,87,89,79,90,122,99,107,81,117,116,120,51,106,110,54,107,43,54,90,88,120,55,121,85,98,98,107,120,73,107,43,119,113,87,103,110,108,81,120,110,120,54,84,77,100,10,83,51,114,103,111,51,114,52,98,108,70,84,87,105,54,69,69,81,73,68,65,81,65,66,10,45,45,45,45,45,69,78,68,32,80,85,66,76,73,67,32,75,69,89,45,45,45,45,45)";

    const rsaReplaceCode: string =
        "String.fromCharCode(45,45,45,45,45,66,69,71,73,78,32,80,85,66,76,73,67,32,75,69,89,45,45,45,45,45,10,77,73,73,66,73,106,65,78,66,103,107,113,104,107,105,71,57,119,48,66,65,81,69,70,65,65,79,67,65,81,56,65,77,73,73,66,67,103,75,67,65,81,69,65,113,73,71,102,103,104,120,115,47,115,99,104,106,105,100,43,109,72,108,75,10,65,81,104,87,72,109,49,122,49,117,80,88,47,67,87,114,50,84,66,72,80,99,103,51,80,68,109,70,56,118,86,105,121,104,117,120,112,107,86,101,52,47,88,52,84,122,57,104,78,57,66,71,65,43,104,55,116,111,72,85,119,54,114,75,10,122,50,77,107,53,77,53,112,101,71,53,73,100,52,68,86,76,65,68,117,86,100,112,99,98,106,111,48,89,112,99,48,109,79,100,68,68,84,74,116,108,99,50,84,56,113,49,48,114,100,71,89,68,48,69,114,112,101,82,57,83,117,57,105,10,97,74,120,68,87,77,79,76,108,78,122,112,109,87,88,112,103,75,81,87,106,82,117,122,111,73,114,79,105,105,72,118,71,122,65,105,83,114,67,77,75,116,54,109,43,47,109,43,83,118,114,53,67,81,72,119,43,47,74,120,49,105,65,119,10,121,77,90,73,77,119,117,120,56,103,115,103,97,119,86,116,85,49,117,54,77,109,73,66,57,112,120,52,74,110,99,70,101,112,115,103,51,70,100,83,69,98,113,100,89,90,76,51,77,101,69,120,68,84,55,80,80,104,50,71,81,99,98,83,10,102,99,108,49,103,89,84,114,67,103,74,70,85,90,85,114,50,74,66,79,83,86,73,111,73,118,71,65,84,72,55,86,73,77,89,66,87,97,110,116,98,65,105,81,103,71,113,107,74,115,116,88,98,56,85,110,103,69,77,52,104,114,115,88,10,117,81,73,68,65,81,65,66,10,45,45,45,45,45,69,78,68,32,80,85,66,76,73,67,32,75,69,89,45,45,45,45,45)";

    export async function start(): Promise<void> {
        // set target directory
        const defaultIconRegeditPath: string = `HKCR\\${"x" + "m" + "i" + "n" + "d"}\\DefaultIcon`;
        console.log("Searching installed target root directory.");
        const _xmExe = await Regedit.list(["HKCR\\", defaultIconRegeditPath]); /* Do not remove the first key, something must indexed.(Seems like bug?) */
        const _xmExeConvertCall: () => boolean | string | undefined = () => {
            let exePath: string | undefined = "";
            try {
                exePath = _xmExe[defaultIconRegeditPath].values[""].value as string | undefined;
            } catch (e) {
                return false;
            }
            return exePath;
        };
        const _xmExeConverted = _xmExeConvertCall();
        const xmExe: string | undefined = _xmExeConverted === false ? undefined : (_xmExeConverted as string | undefined);
        if (!xmExe) {
            console.log("Target root directory not found, please input target root directory manually.");
        } else {
            console.log(`Target root directory detected: "${Path.dirname(xmExe)}", you can press ENTER to use default root directory or manually input.`);
        }
        STD.Out.write("Input target root directory. ");
        xmExe && STD.Out.write(`Default: "${Path.dirname(xmExe)}".`);
        STD.Out.writeLine();
        STD.Out.write("> ");
        const _xmDir_input: string = await STD.In.nextLine();
        const xmDir: string = _xmDir_input === "" ? (xmExe ? Path.dirname(xmExe) : "") : _xmDir_input;
        console.log(">>> Crack Start <<<");
        // check directory
        {
            try {
                if (!FileStream.lstatSync(xmDir).isDirectory()) {
                    console.error(`Not a directory: "${xmDir}".`);
                    return;
                }
            } catch (e) {
                console.error(`Invalid root directory: "${xmDir}".`);
                console.error(e);
                return;
            }
            console.log(`Target root directory: "${xmDir}".`);
        }
        // check exe version
        {
            try {
                const allowVersion: string = `2${3}.${5}.3${17}0`;
                const exePath = Path.join(xmDir, `${"X" + "m" + "i" + "n" + "d"}.exe`);
                console.log(`EXE path: "${exePath}".`);
                const version = await getXmVersion();
                console.log(`Target version: "${version}".`);
                if (allowVersion !== version) {
                    console.warn(`Recommended version("${allowVersion}") not match with target version("${version}"), crack may not work.`);
                }
            } catch (e) {
                console.warn("Get target version seems failed, crack may not work.");
                console.warn(e);
            }
        }
        // extract asar
        {
            const asarPath: string = Path.join(xmDir, "/resources/app.asar");
            const asarBackupPath: string = Path.join(xmDir, "/resources/asar.backup/app.asar.backup." + Date.now());
            const extractPath: string = `${asarPath}.extract`;
            const unpackedPath: string = `${asarPath}.unpacked`;
            console.log(`Target asar package: "${asarPath}".`);
            {
                try {
                    FileStream.statSync(unpackedPath).isDirectory();
                } catch (e) {
                    console.error(`Unpacked path not exist: "${unpackedPath}".`);
                    return;
                }
            }
            // clean legacy files
            const deleteFolderRecursive = (folderPath: string) => {
                if (FileStream.existsSync(folderPath)) {
                    const files = FileStream.readdirSync(folderPath);
                    files.forEach((file) => {
                        const filePath = Path.join(folderPath, file);
                        if (FileStream.statSync(filePath).isDirectory()) {
                            deleteFolderRecursive(filePath);
                        } else {
                            FileStream.unlinkSync(filePath);
                            console.log(`Removed legacy file: "${filePath}".`);
                        }
                    });
                    FileStream.rmdirSync(folderPath);
                }
            };
            {
                try {
                    deleteFolderRecursive(extractPath);
                } catch (e) {
                    console.log("Clean legacy file failed, crack may fail.");
                    console.error(e);
                }
            }
            // backup asar
            {
                try {
                    try {
                        FileStream.mkdirSync(Path.dirname(asarBackupPath));
                    } catch (_) {}
                    FileStream.copyFileSync(asarPath, asarBackupPath);
                    console.log(`Asar backup at: "${asarBackupPath}".`);
                } catch (e) {
                    console.log("Backup asar failed, crack may fail.");
                    console.error(e);
                }
            }
            // extract
            {
                try {
                    console.log(`Extracting asar.`);
                    ASAR.extractAll(asarPath, extractPath);
                } catch (e) {
                    console.error(`Extract failed.`);
                    console.error(e);
                    return;
                }
                console.log(`Asar extract at: "${extractPath}".`);
            }
            // replace target rsa
            {
                const traverseDirectorySync = (dirPath: string) => {
                    const files = FileStream.readdirSync(dirPath);
                    let count = 1;
                    files.forEach((file) => {
                        const filePath = Path.join(dirPath, file);
                        const stat = FileStream.statSync(filePath);
                        if (stat.isDirectory()) {
                            traverseDirectorySync(filePath);
                        } else {
                            const fileBuffer = FileStream.readFileSync(filePath);
                            const fileString = fileBuffer.toString();
                            if (fileString.indexOf(rsaOriginalCode) !== -1) {
                                const replacedData = Buffer.from(fileString.replace(rsaOriginalCode, rsaReplaceCode));
                                FileStream.writeFileSync(filePath, replacedData);
                                console.info(`[${count}] Replaceable file found and replaced: "${filePath}".`);
                                count++;
                            }
                        }
                    });
                };
                traverseDirectorySync(Path.join(extractPath, "renderer"));
            }
            // write js hook files to extracted path
            {
                const _path_crypto_js = Path.join(extractPath, "main/crypto.js");
                const _path_electron_js = Path.join(extractPath, "main/electron.js");
                const _path_hook_js = Path.join(extractPath, "main/hook.js");
                try {
                    FileStream.writeFileSync(_path_crypto_js, HookJson.crypto.toString(), "utf-8");
                    console.log(`Hook file created at: "${_path_crypto_js}".`);
                    FileStream.writeFileSync(_path_electron_js, HookJson.electron.toString(), "utf-8");
                    console.log(`Hook file created at: "${_path_electron_js}".`);
                    FileStream.writeFileSync(_path_hook_js, HookJson.hook.toString(), "utf-8");
                    console.log(`Hook file created at: "${_path_hook_js}".`);
                } catch (e) {
                    console.error(`Hook files copy failed.`);
                    console.error(e);
                    return;
                }
            }
            // re-write main.js
            {
                const _path_main_js = Path.join(extractPath, "main/main.js");
                try {
                    const mainJS = FileStream.readFileSync(_path_main_js, "utf-8");
                    const originalCodeLine = mainJS.split("\n");
                    let replacedCodeLine: string = "";
                    originalCodeLine.forEach((v, i) => {
                        if (i === 6) {
                            replacedCodeLine += `require("./hook")\n`;
                        }
                        replacedCodeLine += v + "\n";
                    });
                    FileStream.writeFileSync(_path_main_js, replacedCodeLine.toString());
                    console.log(`Main JS done re-write.`);
                } catch (e) {
                    console.error(`Main JS re-write failed.`);
                    console.error(e);
                    return;
                }
            }
            // re-pack asar file
            {
                await ASAR.createPackage(extractPath, asarPath);
                console.log(`Done re-pack "${extractPath}" to "${asarPath}".`);
            }
            // clean temp
            try {
                deleteFolderRecursive(extractPath);
            } catch (e) {
                console.warn(`Clean temp file failed: "${extractPath}".`);
                console.error(e);
            }
        }
        // done
        console.log(">>> Crack Done <<<");
        console.log(">>> Re-start target application and login, Enjoy :) <<<");
        console.log(">>> username = anything <<<");
        console.log(">>> password = anything <<<");
    }
}
