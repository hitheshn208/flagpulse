const db = require("../config/postgres");

const getAllUrls = async ()=>{
    const response = await db.query("SELECT url FROM Projects");
    const urlArray = response.rows.map(resObj=> new URL(resObj.url).origin)
    console.log(response.rows);
    console.log(urlArray);
}

getAllUrls()