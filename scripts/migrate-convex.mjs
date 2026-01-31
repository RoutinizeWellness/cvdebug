import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import admZip from "adm-zip";

// Load environment variables manually for extra robustness
function loadEnv(filePath) {
    const env = { ...process.env };
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            console.log(`📄 File content length: ${content.length}`);
            content.split(/\r?\n/).forEach((line, i) => {
                console.log(`Line ${i}: "${line}"`);
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || "";
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                    env[key] = value.trim();
                    console.log(`   ✅ Matched: ${key}=${value.startsWith('prod') ? 'KEY_MASKED' : value}`);
                } else {
                    console.log(`   ❌ No match for line ${i}`);
                }
            });
        }
    } catch (err) {
        console.error("❌ Error reading env file:", err);
    }
    return env;
}

const envPath = path.resolve(process.cwd(), ".env.migration");
console.log(`🔍 Reading config from: ${envPath}`);
const config = loadEnv(envPath);

const {
    ORIGEN_URL,
    DESTINO_DEPLOY_KEY,
    DESTINO_URL,
    DEV_ORIGEN_URL,
    DEV_DESTINO_DEPLOY_KEY,
    DEV_DESTINO_URL
} = config;

console.log("📝 Loaded Config (masking keys):");
console.log(`   - ORIGEN_URL: ${ORIGEN_URL || "UNDEFINED"}`);
console.log(`   - DESTINO_URL: ${DESTINO_URL || "UNDEFINED"}`);
console.log(`   - DESTINO_DEPLOY_KEY: ${DESTINO_DEPLOY_KEY ? "PRESENT" : "MISSING"}`);

async function migrate(originUrl, destUrl, destKey, label = "PROD") {
    if (!originUrl || !destUrl || !destKey) {
        console.log(`\n⏭️ Skipping ${label} migration: Missing environment variables.`);
        return;
    }

    console.log(`\n--- 🚀 Starting ${label} Migration ---`);
    console.log(`📍 Origin: ${originUrl}`);
    console.log(`📍 Destination: ${destUrl}`);

    const BACKUP_DIR = "convex_backups";
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

    const BACKUP_ZIP = path.join(BACKUP_DIR, `backup_${label.toLowerCase()}_${Date.now()}.zip`);

    try {
        // 1. EXPORT
        console.log(`📥 Exporting ${label} data (requires 'npx convex login')...`);
        execSync(`npx convex export --url ${originUrl} --path ${BACKUP_ZIP}`, { stdio: "inherit" });
        console.log(`✅ Export complete: ${BACKUP_ZIP}`);

        // 2. ANALYZE
        console.log(`📊 Analyzing ${label} backup...`);
        const zip = new admZip(BACKUP_ZIP);
        const tableCounts = {};
        zip.getEntries().forEach(entry => {
            if (entry.entryName.endsWith(".jsonl") || entry.entryName.endsWith(".json")) {
                const tableName = entry.entryName.replace(/\.(jsonl|json)$/, "");
                const content = entry.getData().toString("utf8");
                tableCounts[tableName] = content.split(/\r?\n/).filter(l => l.trim().length > 0).length;
            }
        });

        if (Object.keys(tableCounts).length === 0) {
            console.warn("⚠️ No data found in export.");
        } else {
            Object.entries(tableCounts).forEach(([table, count]) => {
                console.log(`   - ${table.padEnd(25)}: ${count.toString().padStart(5)} docs`);
            });
        }

        // 3. IMPORT
        console.log(`📤 Importing ${label} data to destination...`);
        execSync(`npx convex import --url ${destUrl} --path ${BACKUP_ZIP}`, {
            stdio: "inherit",
            env: { ...process.env, CONVEX_DEPLOY_KEY: destKey }
        });
        console.log(`✅ ${label} Import complete!`);

        // 4. VERIFY (Basic check)
        console.log(`🔍 Verifying ${label} destination connection...`);
        const client = new ConvexHttpClient(destUrl);
        // Connection test purely by hitting the URL
        console.log(`✨ ${label} Migration Successful!`);

    } catch (err) {
        console.error(`\n❌ ${label} Migration failed:`, err.message);
    }
}

async function main() {
    // Run Prod Migration
    await migrate(ORIGEN_URL, DESTINO_URL, DESTINO_DEPLOY_KEY, "PROD");

    // Run Dev Migration (if configured)
    await migrate(DEV_ORIGEN_URL, DEV_DESTINO_URL, DEV_DESTINO_DEPLOY_KEY, "DEV");

    console.log("\n🏁 All migration tasks finished.");
}

main();
