import Papa from 'papaparse';

export const loadPostalCodes = async () => {
   console.log('loadPostalCodes() called');
  const response = await fetch('/postal_codes.csv'); // assuming it's in /public
  const csvText = await response.text();
  console.log('loadPostalCodes() called');

  return new Promise((resolve) => {
    console.log('loadPostalCodes() called');

    Papa.parse(csvText, {
      header: true,
      delimiter: ';',
      complete: (results) => {
        const data = results.data
          .filter(row => row.Code_postal && row.Libellé_d_acheminement)
          .map(row => ({
            code: row.Code_postal,
            region: row["Libellé_d_acheminement"]
          }));
        resolve(data);
      }
    });
  });
};
