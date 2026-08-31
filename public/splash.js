  /* ============ מסך הפתיחה: גלגל שנופל, מקפיץ, ומתגלגל ============
   אין כאן קיפצוצים מצוירים ביד: הגלגל נופל בתאוצת כובד, מאבד
   חלק מהמהירות בכל פגיעה (מקדם החזרה), והסיבוב שלו נגזר מהדרך
   שעבר — גלגול בלי החלקה, θ = x / r. הסימן נלחץ כמו גומי בפגיעה
   ומתאושש בתנודה דועכת, והשם נחשף בדיוק במקום שהגלגל כבר פינה. */
(function () {
  var stage = document.getElementById('stage');
  var mark = document.getElementById('spMark');
  var word = document.getElementById('spWord');
  var wheel = document.getElementById('spWheel');
  var gloss = document.getElementById('spGloss');
  if (!stage || !mark || !word || !wheel) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var G = 2600;            // תאוצת כובד, פיקסלים לשנייה בריבוע
  var E_LOGO = 0.52;       // מקדם החזרה מהסימן — גומי על מתכת
  var E_GROUND = 0.42;     // מהרצפה
  var DEFLECT = 255;       // הגלגל פוגע במדרון של הסימן ונדחף ימינה
  var R;                   // רדיוס הגלגל

  var box = stage.getBoundingClientRect();
  var mb = mark.getBoundingClientRect();
  var wb = word.getBoundingClientRect();
  R = wheel.getBoundingClientRect().width / 2;

  var markTop = mb.top - box.top;         // המשטח שעליו נוחתים
  var markLeft = mb.left - box.left;
  var markRight = markLeft + mb.width;
  var ground = mb.bottom - box.top;       // קו הרצפה של הלוגו
  var wordLeft = wb.left - box.left;
  var wordW = wb.width;
  // יוצא מהמסך ממש, לא רק מהבמה
  var exitX = box.width + (window.innerWidth - box.right) + 60;

  var x = markLeft + mb.width * 0.44;     // נופל על כתר הסימן
  var y = -190;
  var vx = 0, vy = 0, rot = 0;
  var squash = 0, squashT = 0, hitLogo = false;
  var tyre = 1;                            // הצמיג עצמו נלחץ רגע בפגיעה
  var last = 0, done = false;

  function paint() {
    var place = 'translate(' + (x - R) + 'px,' + (y - R) + 'px)';
    wheel.style.transform = place + ' rotate(' + rot + 'rad) scaleY(' + tyre + ')';
    // מקור האור עומד במקומו בזמן שהגלגל מסתובב, ולכן הברק לא מסתובב איתו
    if (gloss) gloss.style.transform = place + ' scaleY(' + tyre + ')';
    // גומי: נלחץ לגובה ומתרחב לרוחב, ושומר על נפח בערך
    var k = squash;
    mark.style.transform = 'scaleY(' + (1 - k) + ') scaleX(' + (1 + k * 0.55) + ')';
    var shown = Math.max(0, Math.min(wordW, (x - R) - wordLeft));
    word.style.clipPath = 'inset(0 ' + Math.max(0, wordW - shown) + 'px 0 0)';
  }

  function step(now) {
    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;

    vy += G * dt;
    x += vx * dt;
    y += vy * dt;
    rot += (vx * dt) / R;                 // גלגול בלי החלקה

    // הפגיעה הראשונה: על הסימן
    var overLogo = x > markLeft - R * 0.4 && x < markRight + R * 0.4;
    var floor = overLogo && !hitLogo ? markTop : ground;
    if (y + R > floor) {
      y = floor - R;
      var e = (floor === markTop) ? E_LOGO : E_GROUND;
      if (Math.abs(vy) > 70) {
        if (floor === markTop) {
          hitLogo = true;
          squash = Math.min(0.2, Math.abs(vy) / 4200);   // הסימן נלחץ לפי עוצמת הפגיעה
          squashT = 0;
          vx = DEFLECT;                                   // ומדיח את הגלגל הצידה
        }
        vy = -vy * e;
        tyre = 0.86;                                      // הצמיג משתטח לרגע
        setTimeout(function () { tyre = 1; }, 70);
      } else {
        vy = 0;
        if (vx < 265) vx += 460 * dt;                     // מתייצב ומתגלגל הלאה
      }
    }

    // התאוששות הגומי: תנודה דועכת סביב הצורה המקורית
    if (squash !== 0) {
      squashT += dt;
      var amp = 0.2 * Math.exp(-7 * squashT) * Math.cos(26 * squashT);
      squash = Math.abs(amp) < 0.002 ? 0 : amp;
    }

    paint();

    if (x - R > exitX) { done = true; return; }
    if (!done) requestAnimationFrame(step);
  }

  paint();
  requestAnimationFrame(step);
})();
