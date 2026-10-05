const http = require('http');

const pages = [
  '/',
  '/index.html',
  '/shop.html',
  '/product-details.html?id=1',
  '/cart.html',
  '/checkout.html',
  '/login.html',
  '/register.html',
  '/account.html',
  '/order-confirmation.html?id=1',
  '/404.html',
  '/api/products',
  '/api/products/1'
];

async function testAllPages() {
  console.log('--- RUNNING FULL SYSTEM VERIFICATION ---');
  let passed = 0;
  let failed = 0;

  for (const page of pages) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000${page}`, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(`✅ [${res.statusCode}] GET ${page} OK`);
          passed++;
        } else {
          console.error(`❌ [${res.statusCode}] GET ${page} FAILED`);
          failed++;
        }
        resolve();
      }).on('error', (err) => {
        console.error(`❌ GET ${page} ERROR:`, err.message);
        failed++;
        resolve();
      });
    });
  }

  console.log(`\nVerification Summary: ${passed} Passed, ${failed} Failed out of ${pages.length} endpoints.`);
  if (failed === 0) {
    console.log('🎉 ALL SYSTEM ENDPOINTS & PAGES ARE 100% OPERATIONAL!');
  } else {
    process.exit(1);
  }
}

testAllPages();
