import * as XLSX from "xlsx";

let cache = null;

async function loadSingleFile(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Cannot load ${path}`);
  }

  const buffer = await response.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array"
  });

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  return XLSX.utils.sheet_to_json(
    sheet
  );
}

export async function loadDataset() {
  try {

    if (cache)
      return cache;

    const files = [
      "/0_jajedee.xlsx",
      "/1_jajedee.xlsx"
    ];

    const datasets =
      await Promise.all(
        files.map(loadSingleFile)
      );

    cache =
      datasets.flat();

    console.log(
      "Dataset loaded:",
      cache.length
    );

    return cache;

  } catch (err) {

    console.error(
      "Dataset Error:",
      err
    );

    throw err;

  }
}