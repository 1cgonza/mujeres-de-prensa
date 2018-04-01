import XLSX from 'xlsx';

export default function(url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();

    req.open('GET', url, true);
    req.responseType = 'arraybuffer';

    req.onload = function(event) {
      let data = new Uint8Array(req.response);
      let workbook = XLSX.read(data, {
        type: 'array',
        cellStyles: true
      });
      resolve(workbook);
    };

    req.send();
  });
}
