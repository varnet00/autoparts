#!/usr/bin/env node
/* ============================ הרצה מקומית ============================

   פקודה אחת מרגע שהמאגר על המחשב: npm start.

   הסקריפט עושה את מה ששכחו בכל פעם מחדש — מתקין תלויות אם חסרות,
   יוצר .env עם סוד אקראי (בלעדיו השרת מסרב לעלות, בכוונה), ומדפיס
   גם את הכתובת ברשת המקומית: זו אפליקציה שנכתבה לטלפון, ואת הטלפון
   רוצים לפתוח על אותו Wi-Fi ולא על המחשב.

   אין כאן תלויות חיצוניות ואין bash — אותו קוד רץ ב-macOS, ב-Windows
   וב-Linux, כי Node ממילא נדרש. */
const { spawn, spawnSync } = require('child_process');
const { randomBytes } = require('crypto');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { networkInterfaces } = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const backend = path.join(root, 'backend');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// better-sqlite3 מגיע עם קבצים בנויים מראש לגרסאות LTS. על גרסה אחרת
// ההתקנה תנסה להדר מקומית, וזה נכשל על מחשב בלי כלי פיתוח.
const major = Number(process.versions.node.split('.')[0]);
if (major < 18) {
  console.error(`\n  צריך Node 18 ומעלה, כאן יש ${process.versions.node}.`);
  console.error('  מורידים מ-https://nodejs.org (גרסת LTS) ומריצים שוב.\n');
  process.exit(1);
}
if (major % 2 !== 0) {
  console.warn(`\n  ⚠ Node ${process.versions.node} אינה גרסת LTS. אם ההתקנה נכשלת, התקינו Node 22.\n`);
}

if (!existsSync(path.join(backend, 'node_modules'))) {
  console.log('  מתקין תלויות (פעם אחת, לוקח דקה)…');
  const install = spawnSync(npm, ['install', '--no-audit', '--no-fund'], { cwd: backend, stdio: 'inherit', shell: process.platform === 'win32' });
  if (install.status !== 0) {
    console.error('\n  ההתקנה נכשלה. אם השגיאה מזכירה better-sqlite3, התקינו Node 22 (LTS) ונסו שוב.\n');
    process.exit(install.status || 1);
  }
}

const envPath = path.join(backend, '.env');
if (!existsSync(envPath)) {
  const example = readFileSync(path.join(backend, '.env.example'), 'utf8');
  // סוד אקראי לכל התקנה: ברירת המחדל שבקובץ הדוגמה היא מחרוזת ידועה,
  // ואסור שהיא תהיה הסוד האמיתי של אף אחד
  writeFileSync(envPath, example.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${randomBytes(32).toString('hex')}`));
  console.log('  נוצר backend/.env עם סוד אקראי');
}

const port = process.env.PORT || 4000;
const lan = Object.values(networkInterfaces()).flat()
  .filter((n) => n && n.family === 'IPv4' && !n.internal).map((n) => n.address)[0];

console.log('');
console.log(`  על המחשב:  http://localhost:${port}`);
if (lan) console.log(`  מהטלפון:   http://${lan}:${port}   (באותו Wi-Fi)`);
console.log('  מוכר לבדיקה: hertzel@example.com / demo1234');
console.log('  לעצירה: Ctrl+C');
console.log('');

const server = spawn(npm, ['start'], { cwd: backend, stdio: 'inherit', env: { ...process.env, PORT: String(port) }, shell: process.platform === 'win32' });
server.on('exit', (code) => process.exit(code === null ? 0 : code));
process.on('SIGINT', () => server.kill('SIGINT'));
process.on('SIGTERM', () => server.kill('SIGTERM'));
