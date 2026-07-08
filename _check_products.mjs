import "dotenv/config";
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const rows = await sql`
  SELECT id, name,
         LEFT(image_url, 120)  as img,
         LEFT(image_urls, 120) as imgs
  FROM products
  WHERE name ILIKE '%jordan 1 mid se%split%'
     OR name ILIKE '%timberloop%'
     OR name ILIKE '%flyknit nsw%'
     OR name ILIKE '%1906r%'
     OR name ILIKE '%zoom flight%98%'
     OR (name ILIKE '%jordan 10 retro%' AND name ILIKE '%smoke%')
  ORDER BY id
`;
rows.forEach(r => {
  console.log(`[${r.id}] ${r.name}`);
  console.log(`  image_url  : ${r.img}`);
  console.log(`  image_urls : ${r.imgs}`);
  console.log();
});
await sql.end();
