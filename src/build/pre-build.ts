import { Application } from "../application";
import { HookFileDeclare } from "../hook-file-declare";
import Path from "path";
import FileStream from "fs";
import FileStreamExtra from "fs-extra";

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

@Application.Main
export class PreBuild extends Application.MainClass {
    public async mounted(): Promise<void> {
        console.log(">>> Pre-building <<<");
        // convert hook files to JSON
        {
            console.log("Converting hook files to JSON.");
            const _path_crypto_js = Path.join(__dirname, "hook/crypto.js");
            const _path_electron_js = Path.join(__dirname, "hook/electron.js");
            const _path_hook_js = Path.join(__dirname, "hook/hook.js");
            const hookJsonPath = Path.join(__dirname, "hook.json");
            try {
                console.log(`Removing legacy hooks json file: "${hookJsonPath}".`);
                FileStream.unlinkSync(hookJsonPath);
            } catch (_) {}
            const jsonData: HookFileDeclare = {
                hook: FileStream.readFileSync(_path_hook_js).toString(),
                crypto: FileStream.readFileSync(_path_crypto_js).toString(),
                electron: FileStream.readFileSync(_path_electron_js).toString()
            };
            // write
            FileStream.writeFileSync(hookJsonPath, JSON.stringify(jsonData, null, 4), "utf-8");
        }
        // release external scripts
        {
            // node_modules original script path
            const regeditOriginalScriptPath = Path.join(__dirname, "../../node_modules/regedit/vbs");
            console.log(`Original regedit scripts path: "${regeditOriginalScriptPath}".`);
            // release path
            const regeditExternalScriptPath = Path.join(__dirname, "../../release/scripts");
            console.log(`External regedit scripts release path: "${regeditExternalScriptPath}".`);
            // copy
            deleteFolderRecursive(regeditExternalScriptPath);
            FileStreamExtra.copySync(regeditOriginalScriptPath, regeditExternalScriptPath);
            console.log(`Scripts release copy done.`);
        }
        console.log(">>> Pre-build Done <<<");
    }
}
