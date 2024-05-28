const express = require('express');
const proxy = require('html2canvas-proxy');
const app = express();

app.use('/', proxy());

const PORT = 3002; // 프록시 서버 포트
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
