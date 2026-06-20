function normalize(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "");
}

export function retrieve(data, query) {

  const q =
    normalize(query);

  const seen =
    new Set();

  const results =
    data

      .map((row) => {

        const english =
          normalize(
            row["English Sentence"]
          );

        let score = 0;

        q
          .split(" ")
          .forEach((word) => {

            if (
              english.includes(word)
            ) {
              score++;
            }

          });

        return {
          ...row,
          score
        };

      })

      .filter(
        r => r.score > 0
      )

      .sort(
        (a, b) =>
          b.score -
          a.score
      )

      .filter((r) => {

        const key =
          r["English Sentence"];

        if (
          seen.has(key)
        )
          return false;

        seen.add(key);

        return true;

      });

  return results.slice(0, 5);

}