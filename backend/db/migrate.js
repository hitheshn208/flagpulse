const {Client} = require("pg");
const fs = require('fs');
const path = require("path");
const dotenv = require("dotenv");
const { log } = require("console");

dotenv.config({path: path.join(__dirname, "../../.env")})

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const run = async ()=>{
    await client.connect();
    console.log("Connected to Postgres");

    const mdir = path.join(__dirname, "migrations");
    console.log(mdir)
    const files = fs.readdirSync(mdir).filter(f => f.endsWith(".sql")).sort();
    console.log(files);
    

    for(let i = 0; i < files.length; i++){
        const file = files[i];
        const filePath = path.join(mdir, file);
        console.log("File path printing", filePath);
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log("Running migration : ", file)
        await client.query(sql);
        console.log("Done : ", file);
    }

    console.log('All migrations completed successfully')
    await client.end()
}

run().catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
})