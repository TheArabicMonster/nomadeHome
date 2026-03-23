//child_process -> module node qui permet de créer des processus enfant qui peuvent exécuter des commandes ou des scripts
// execFile -> fonction qui exécute un fichier et retourne le résultat
import {execFile} from "child_process";
// promisify -> fonction qui transforme une fonction qui utilise des callbacks en une fonction qui retourne une promesse
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function GET() {
    const ip = process.env.VPS_IP || undefined;

    try {
        const { stdout } = await execFileAsync("ping",
            ["-c", "1", "-W", "2", ip], { timeout: 5000 })
        const match =
            stdout.match(/time[=<]([\d.]+)\s*ms/)
        const time = match ? parseFloat(match[1]) : null
        return Response.json({
            success: !!time, time, ip
        })
    } catch {
        return Response.json({
            success: false, time:
                null, ip
        })
    }
}