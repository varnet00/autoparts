  /* ============ מסך הפתיחה: גלגל שנופל, מקפיץ, ומתגלגל ============
   הגלגל הוא צילום אמיתי, מלפנים, ולכן הוא באמת מסתובב — הזווית
   נגזרת מהדרך שעבר, גלגול בלי החלקה: θ = x / r.
   הוא נכנס מעל קצה המסך, לא מתוך הבמה, נופל בתאוצת כובד, מאבד
   חלק מהמהירות בכל פגיעה (מקדם החזרה). בפגיעה נמעך רק הגומי:
   משטח המגע משתטח, הציר יורד, והחישוק נשאר עגול — לא מותחים
   את התמונה כולה. הסימן נלחץ כמו גומי
   ומתאושש בתנודה דועכת. השם נחשף לאורך הקשת של הגלגל עצמו, ולכן
   האותיות יוצאות ממש מתחתיו ולא מאחורי קו ישר שמשאיר רווח. */
(function () {
  var stage = document.getElementById('stage');
  var mark = document.getElementById('spMark');
  var word = document.getElementById('spWord');
  var wheel = document.getElementById('spWheel');   // המסגרת: מיקום וחיתוך
  var spin = document.getElementById('spSpin');      // התמונה שבתוכה: סיבוב בלבד
  var shade = document.getElementById('spShade');
  if (!stage || !mark || !word || !wheel) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var G = 3200;            // תאוצת כובד — גלגל שטח כבד נופל בחדות
  var E_LOGO = 0.52;       // מקדם החזרה מהסימן — גומי על מתכת
  var E_GROUND = 0.42;     // מהרצפה
  var DEFLECT, ROLL_MAX, ROLL_ACC;   // נגזרים מאורך המסלול, ראו למטה
  var R;                   // רדיוס הגלגל

  var box = stage.getBoundingClientRect();
  var mb = mark.getBoundingClientRect();
  var wb = word.getBoundingClientRect();
  R = (wheel.offsetWidth || 60) / 2;   // offsetWidth ולא getBoundingClientRect: לא מושפע מהסיבוב

  var markTop = mb.top - box.top;         // המשטח שעליו נוחתים
  var markLeft = mb.left - box.left;
  var markRight = markLeft + mb.width;
  var ground = mb.bottom - box.top;       // קו הרצפה של הלוגו
  var wordLeft = wb.left - box.left;
  var wordW = wb.width;
  // יוצא מהמסך ממש, לא רק מהבמה
  var exitX = box.width + (window.innerWidth - box.right) + 60;

  /* מהירות הגלגול נגזרת מהדרך שנותרה, לא קבועה: על טלפון צר יוצא
     גלגול נינוח, ועל מסך רחב הוא לא נמרח לנצח. */
  var startX = markLeft + mb.width * 0.44;
  ROLL_MAX = Math.max(170, Math.min(340, (exitX + R - startX) / 2));
  DEFLECT = ROLL_MAX * 0.92;
  ROLL_ACC = ROLL_MAX * 1.7;

  /* חזית החשיפה של השם היא הקשת של הגלגל, לא קו אנכי: קו ישר
     חותך את האות במרחק R מהמרכז, והרווח שנשאר עד לצמיג העגול
     נראה כמו צל לבן שממנו האות מבצבצת. */
  var ROWS = 8;
  var wordTop = wb.top - box.top;
  var wordH = wb.height;
  var RT = R * 0.98;                      // רדיוס הגומי בפועל, מעט פנימה מהמסגרת
  var seen = [];                          // חזית לכל שורה — אות שנחשפה לא נעלמת
  for (var i = 0; i <= ROWS; i++) seen.push(0);

  /* השם נחשף לפי הקשת של הגלגל במקום שבו הוא באמת נמצא עכשיו, ולא
     לפי גובה הגלגול: כשהוא מקפץ מעל השם, קשת של גלגל שיושב על
     הרצפה כבר לא מכסה את האות, ונפער רווח לפניה. שורה שהגלגל לא
     חוצה כרגע פשוט לא מתקדמת — ככה אין קפיצה קדימה, והחזית לכל
     שורה רק גדלה, ולכן אות שנחשפה לא נעלמת. */
  function revealWord() {
    var cy = y + flat;                    // מרכז הגלגל כפי שהוא מצויר
    var pts = '0 0';
    for (var i = 0; i <= ROWS; i++) {
      var yl = wordH * i / ROWS;
      var dy = (wordTop + yl) - cy;
      if (Math.abs(dy) <= R) {          // שורה שהגלגל חוצה כרגע
        var half = Math.sqrt(Math.max(0, RT * RT - dy * dy));
        var f = Math.max(0, Math.min(wordW, (x - half) - wordLeft));
        if (f > seen[i]) seen[i] = f;
      }
      pts += ',' + seen[i].toFixed(1) + 'px ' + yl.toFixed(1) + 'px';
    }
    word.style.clipPath = 'polygon(' + pts + ',0 ' + wordH.toFixed(1) + 'px)';
  }

  var x = startX;                         // נופל על כתר הסימן
  var y = R - box.top - 24;               // מתחיל מעל קצה המסך, לא בתוך הבמה
  var vx = 0, vy = 0, rot = 0;
  var squash = 0, squashT = 0, hitLogo = false;
  var FLAT_MAX = 0.13 * R;                 // כמה הגומי נדחס לכל היותר
  var flat = 0;                            // עומק משטח המגע כרגע
  var last = 0, done = false, surface = 0;

  function paint() {
    // הציר שוקע בדיוק כעומק המעיכה, והתחתית נחתכת באותו שיעור: הגומי
    // משתטח על הקרקע, והחישוק נשאר עגול ולא נמתח לאליפסה
    wheel.style.transform = 'translate(' + (x - R) + 'px,' + (y + flat - R) + 'px)';
    wheel.style.clipPath = flat > 0.15 ? 'inset(0 0 ' + flat.toFixed(2) + 'px 0)' : 'none';
    if (spin) spin.style.transform = 'rotate(' + rot + 'rad)';

    // כמה הגלגל קרוב למשטח: 0 באוויר, 1 בנגיעה
    var under = surface || ground;
    var near = Math.max(0, 1 - Math.max(0, under - (y + R)) / 130);
    // צל מגע: ככל שקרוב יותר — קטן, כהה וחד יותר
    if (shade) {
      shade.style.opacity = (0.12 + 0.5 * near).toFixed(3);
      shade.style.transform = 'translate(' + (x - R) + 'px,' + (under - 7) + 'px)'
        + ' scale(' + (1.25 - 0.35 * near) + ',' + (0.55 + 0.45 * near) + ')';
    }
    // גומי: נלחץ לגובה ומתרחב לרוחב, ושומר על נפח בערך
    var k = squash;
    mark.style.transform = 'scaleY(' + (1 - k) + ') scaleX(' + (1 + k * 0.55) + ')';
    revealWord();
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
          squash = Math.min(0.2, Math.abs(vy) / 5200);   // הסימן נלחץ לפי עוצמת הפגיעה
          squashT = 0;
          vx = DEFLECT;                                   // ומדיח את הגלגל הצידה
        }
        vy = -vy * e;
        flat = Math.min(FLAT_MAX, Math.abs(vy) / 260);    // רק הגומי, לפי עוצמת הפגיעה
      } else {
        vy = 0;
        if (vx < ROLL_MAX) vx += ROLL_ACC * dt;           // מתייצב ומתגלגל הלאה
      }
    }

    if (flat > 0) flat *= Math.exp(-dt / 0.045);          // הגומי חוזר לצורתו

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
