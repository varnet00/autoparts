  /* ============ מסך הפתיחה: גלגל שנופל, מקפיץ, ומתגלגל ============
   הגלגל הוא הצילום עצמו, בזווית שבה צולם. לכן אי אפשר פשוט לסובב
   את כל התמונה — היא הייתה מתהפכת. מה שמסתובב זה החישוק בלבד,
   סביב ציר הגלגל ולפי האליפסה שבה טבעת הבורגים נראית בצילום:
   אליפסה שמסתובבת ככה נשארת בדיוק במקומה, ולכן אין רעידה.
   שאר הפיזיקה אמיתית: נפילה בתאוצת כובד, איבוד מהירות בכל פגיעה
   (מקדם החזרה), וגלגול בלי החלקה — θ = x / r. */
(function () {
  var stage = document.getElementById('stage');
  var mark = document.getElementById('spMark');
  var word = document.getElementById('spWord');
  var wheel = document.getElementById('spWheel');
  var rim = document.getElementById('spRim');
  var shade = document.getElementById('spShade');
  if (!stage || !mark || !word || !wheel) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var G = 2600;            // תאוצת כובד, פיקסלים לשנייה בריבוע
  var E_LOGO = 0.52;       // מקדם החזרה מהסימן — גומי על מתכת
  var E_GROUND = 0.42;     // מהרצפה
  var DEFLECT = 255;       // הגלגל פוגע במדרון של הסימן ונדחף ימינה

  /* נמדד מהצילום: מיקום הציר בתוך הריבוע, קו המגע, והמטריצה
     שממירה סיבוב עגול לסיבוב בתוך האליפסה של טבעת הבורגים. */
  var HUB_X = 0.6333, HUB_Y = 0.4949, BOTTOM = 0.9964;
  var W00 = 0.707270, W01 = -0.029683, W10 = -0.029683, W11 = 0.996990;
  var I00 = 1.415655, I01 = 0.042147, I10 = 0.042147, I11 = 1.004274;

  function spin(th) {                       // W · R(θ) · W⁻¹
    var c = Math.cos(th), s = Math.sin(th);
    var a00 = W00 * c + W01 * s, a01 = -W00 * s + W01 * c;
    var a10 = W10 * c + W11 * s, a11 = -W10 * s + W11 * c;
    return 'matrix(' + (a00 * I00 + a01 * I10) + ',' + (a10 * I00 + a11 * I10) + ','
      + (a00 * I01 + a01 * I11) + ',' + (a10 * I01 + a11 * I11) + ',0,0)';
  }

  var box = stage.getBoundingClientRect();
  var mb = mark.getBoundingClientRect();
  var wb = word.getBoundingClientRect();
  var SZ = wheel.getBoundingClientRect().width || 52;   // הספרייט ריבועי
  var R = (BOTTOM - HUB_Y) * SZ;                        // רדיוס גלגול

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
  var last = 0, done = false, surface = 0;

  function paint() {
    var place = 'translate(' + (x - HUB_X * SZ) + 'px,' + (y - HUB_Y * SZ) + 'px)'
      + ' scaleY(' + tyre + ')';
    wheel.style.transform = place;
    if (rim) rim.style.transform = place + ' ' + spin(rot);
    // צל מגע: ככל שהגלגל קרוב למשטח הצל קטן, כהה וחד יותר
    if (shade) {
      var under = surface || ground;
      var gap = Math.max(0, under - (y + R));
      var k = Math.max(0, 1 - gap / 130);
      shade.style.opacity = (0.12 + 0.5 * k).toFixed(3);
      shade.style.transform = 'translate(' + (x - SZ / 2) + 'px,' + (under - 7) + 'px)'
        + ' scale(' + (1.25 - 0.35 * k) + ',' + (0.55 + 0.45 * k) + ')';
    }
    // גומי: נלחץ לגובה ומתרחב לרוחב, ושומר על נפח בערך
    var k = squash;
    mark.style.transform = 'scaleY(' + (1 - k) + ') scaleX(' + (1 + k * 0.55) + ')';
    var shown = Math.max(0, Math.min(wordW, (x - HUB_X * SZ) - wordLeft));
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
    surface = floor;
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

    if (x - HUB_X * SZ > exitX) { done = true; return; }
    if (!done) requestAnimationFrame(step);
  }

  paint();
  requestAnimationFrame(step);
})();
