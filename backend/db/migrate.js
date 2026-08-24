const {Client} = require("pg");
const fs = require('fs');
const path = require("path");

const client = new Client({
    host: "postgres",
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const createTrackTable = async ()=>{
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            file_name TEXT NOT NULL UNIQUE
        )`)
}

const getMigratedFiles = async ()=>{
    const response = await client.query(`SELECT file_name FROM schema_migrations`);
    const files = response.rows.map(row=> row.file_name);
    return files
}

const run = async ()=>{
    await client.connect();
    console.log("Connected to Postgres");

    await createTrackTable();

    const mdir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(mdir).filter(f => f.endsWith(".sql")).sort();
    const migratedFiles = await getMigratedFiles(); 

    for(let i = 0; i < files.length; i++){
        const file = files[i];

        if(migratedFiles.includes(file))
            continue;

        const filePath = path.join(mdir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');
        await client.query("BEGIN");
        try {
            await client.query(sql);
            await client.query(
                `INSERT INTO schema_migrations (file_name) VALUES ($1)`,
                [file]
            );
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
    }
    console.log('All migrations completed successfully')
    await client.end()
}

run().catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
})