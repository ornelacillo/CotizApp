const https = require('https');
const fs = require('fs');

https.get('https://ardg.ar/tarifario/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('ardg_raw.html', data);
    console.log('Saved ARDG HTML');
  });
});
