import XLSX from "xlsx";
import pool from "../src/backend/db.js";

async function importTranslations(){
  try {
    // Array of dataset files to import
    const files = [
      "./public/0_jajedee.xlsx",
      "./public/1_jajedee.xlsx"
    ];

    let totalImported = 0;

    for (const file of files) {
      console.log(`Processing file: ${file}`);
      
      const workbook = XLSX.readFile(file);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (const row of rows) {
        await pool.query(
          `
          INSERT INTO translations (english, garhwali)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
          `,
          [
            row["English Sentence"],
            row["Garhwali Translation"]
          ]
        );
      }
      
      totalImported += rows.length;
      console.log(`Finished processing ${file} (${rows.length} rows)`);
    }

    console.log(`Imported all datasets successfully! Total rows checked/inserted: ${totalImported}`);
    process.exit(0);
  } catch(err) {
    console.error("Import Error:", err);
    process.exit(1);
  }
}

importTranslations();