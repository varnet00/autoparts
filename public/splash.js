  /* ============ מסך הפתיחה: גלגל שנופל, מקפיץ, ומתגלגל ============
   הגלגל הוא גוף תלת-ממדי אמיתי (ראו wheel3d.js) ולא תמונה שמסובבים:
   משטח סיבוב שנבנה מחתך הצמיג, עם הצילום כאלבדו, תאורה שיושבת
   בעולם ורצועת דריכה שעוברת מסביב. אם אין WebGL נופלים בחזרה
   לתמונה מסתובבת, ואז המעיכה נעשית בחיתוך CSS.

   המגע אינו החזרה מיידית אלא כוח: הצמיג הוא קפיץ עם בולם, החדירה
   שלו לקרקע היא בדיוק המעיכה שרואים, וההקפצה נולדת מהכוח הזה —
   ולכן הקפיצות דועכות מעצמן ואין שום מקדם החזרה כתוב ביד. בפתח
   המגע יש חיכוך קולומב אמיתי: הוא מסובב את הגלגל, בולם החלקה,
   ומייצר את התנגדות הגלגול. הכובד בקנה מידה אמיתי — 60 פיקסל הם
   גלגל של 70 ס"מ — ולכן הנפילה נראית כבדה ולא מהירה מדי.

   הפגיעה הראשונה היא בכתר הסימן. הכתר מעוגל קלות, ולכן נחיתה
   מעט מימין למרכזו מטה את הנורמל ימינה: הגלגל מוסט הצידה מהכוח
   עצמו, לא מקבוע. הסימן עצמו הוא מסה על קפיץ — הוא נלחץ תחת הכוח
   ומתאושש בתנודה דועכת, ומשטח המגע יורד יחד איתו.

   השם נחשף לאורך הקשת של הגלגל עצמו, ורק אחרי שהקפיצות נגמרו.
   הוא יושב מחוץ לזרימה, ולכן רוחב הבמה הוא הסימן בלבד והוא ממורכז
   כבר בציור הראשון. הבמה מחליקה שמאלה בחצי רוחב השם, וכשהיא
   מגיעה הצמד — סימן ושם — ממורכז.

   שתי התנועות מופרדות בכוונה. הבמה זזה כבר ברגע הפגיעה, בזמן
   שהגלגל באוויר: אילו הייתה זזה תוך כדי גלגול, המסך היה נגרר
   שמאלה בקצב קרוב לזה של הגלגל, הגלגל היה כמעט עומד במקום
   ומסתובב — וזו בדיוק התחושה של תמונה שמסתובבת. השם מתקרב
   אחר כך, בזמן הגלגול, וזה לא פוגע בקריאה של הנסיעה. */
(function () {
  var stage = document.getElementById('stage');
  var mark = document.getElementById('spMark');
  var word = document.getElementById('spWord');
  var wheel = document.getElementById('spWheel');   // המסגרת: מיקום במסך
  var spin = document.getElementById('spSpin');      // גיבוי דו-ממדי
  var glc = document.getElementById('spGl');        // הבד של המודל
  var shade = document.getElementById('spShade');
  if (!stage || !mark || !word || !wheel) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var G = 1800;            // מהירות הנפילה; עומק המעיכה אינו תלוי בו אלא בגובה
  var SAG = 0.0034;        // שקיעת הצמיג תחת משקלו שלו, ביחידות רדיוס
  var ZETA = 0.36;         // בולם הצמיג — ממנו נולדת ההקפצה הדועכת
  var MU = 1.05;           // אחיזת גומי
  var RR = 0.012;          // התנגדות גלגול
  var BOTTOM = 0.24;       // מאיזו חדירה הצמיג יושב על החישוק ומתקשה
  var SLOPE0;              // שיפוע כתר הסימן בנקודת הנחיתה — נגזר מהמסלול
  var YAW = -14 * Math.PI / 180;    // סטיית המצלמה: כך נחשפת רצועת הדריכה
  var PITCH = 9 * Math.PI / 180;
  var H = 0.0012;          // צעד הסימולציה — הקפיץ קשיח, צריך צעד קצר

  var box = stage.getBoundingClientRect();
  var mb = mark.getBoundingClientRect();
  var wb = word.getBoundingClientRect();
  var R = (wheel.offsetWidth || 60) / 2;   // offsetWidth: לא מושפע מהסיבוב

  var markTop = mb.top - box.top;
  var markLeft = mb.left - box.left;
  var markCx = markLeft + mb.width / 2;
  var markH = mb.height || 1;
  var ground = mb.bottom - box.top;       // קו הרצפה של הסימן
  var wordLeft = wb.left - box.left;
  var wordW = wb.width;
  var SHIFT = wb.width / 2;
  var exitX = (window.innerWidth - box.left) + SHIFT + 60;

  var K = G / (SAG * R);                  // קשיחות הצמיג ליחידת מסה
  var C = 2 * ZETA * Math.sqrt(K);        // בולם
  var startX = markCx + mb.width * 0.16;  // נוחתים מימין למרכז הכתר
  /* ככל שהמסלול ארוך יותר כך הנחיתה תלולה יותר על הכתר והבעיטה
     הצידה חזקה יותר. זה פרמטר של הסצנה ולא של הפיזיקה: הדינמיקה
     נשארת אותה דינמיקה, רק תנאי ההתחלה משתנים לפי רוחב המסך —
     אחרת על מסך רחב הגלגל היה מתגלגל בנחת עוד שניות אחרי שהכול
     כבר עמד במקום. */
  var runway = exitX + R - startX;
  SLOPE0 = Math.max(0.24, Math.min(0.75, 0.24 * runway / 345));
  var CROWN = SLOPE0 / (2 * (startX - markCx));
  var CROWN_HALF = mb.width * 0.42;       // מעבר לזה נגמר הסימן ונופלים ממנו

  var ML = 4, KL = 3600, CL = 38;         // הסימן: מסה על קפיץ עם בולם
  var KW = 484, CW = 7.9, WK = 4e-4;      // רעד הגוף אחרי פגיעה (קמבר)

  var RT = R * 0.98;                      // רדיוס הגומי לחשיפת האותיות
  var seen = 0, GAP = 0;
  var stageT = -1, stageDur = 1.00, stageE = 0;   // הבמה — מרגע הפגיעה
  var wordT = -1, wordDur = 1, wordE = 0;        // השם — מרגע ההתייצבות

  function sgn(v) { return v > 0 ? 1 : v < 0 ? -1 : 0; }
  /* הבמה נדחפת מהפגיעה: מהר בהתחלה ונרגעת — כמו רתע. השם מתקרב
     ברכות משני הצדדים, בלי זינוק ובלי עצירה חדה. */
  function easeOut(u) { u = Math.max(0, Math.min(1, u)); return 1 - Math.pow(1 - u, 3); }
  function easeInOut(u) {
    u = Math.max(0, Math.min(1, u));
    return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  }

  /* המודל התלת-ממדי נטען במקביל. עד שהוא מוכן מציירים את התמונה
     המסתובבת, ולכן גם בלי WebGL וגם לפני שהצילום הגיע יש גלגל. */
  var g3 = null, use3 = false;
  if (glc && window.createWheel3D) {
    g3 = window.createWheel3D(glc, spin ? spin.src : '/wheel.webp', 1.34);
    if (g3) {
      g3.resize(R * 2 * 1.34, window.devicePixelRatio || 1);
      g3.onready = function () {
        use3 = true;
        glc.style.display = 'block';
        if (spin) spin.style.display = 'none';
        wheel.style.clipPath = 'none';
      };
    }
  }

  /* חזית החשיפה עוברת במרכז הגלגל, ולכן האות יוצאת ממש מתחתיו.
     כל עוד הגלגל מקפץ אין חשיפה בכלל: הקפיצות מדלגות על אותיות. */
  function revealWord() {
    if (wordT < 0) return;
    var here = wordLeft + GAP * (1 - wordE);
    var f = Math.max(0, Math.min(wordW, x - here));
    if (f > seen) seen = f;
    word.style.transform = 'translateX(' + (GAP * (1 - wordE)).toFixed(2) + 'px)';
    word.style.clipPath = 'inset(0 ' + (wordW - seen).toFixed(1) + 'px 0 0)';
  }

  var x = startX;
  var y = R - box.top - 24;                // מתחיל מעל קצה המסך
  var vx = 0, vy = 0, rot = 0, om = 0;
  var md = 0, mdv = 0;                     // לחיצת הסימן ומהירותה
  var wob = 0, wobv = 0;                   // רעד הגוף
  var pen = 0, surface = ground, calm = 0, pastLogo = false;
  var last = 0, done = false;

  /* גובה המשטח ושיפועו במקום נתון. הכתר של הסימן מעוגל: נחיתה מחוץ
     למרכזו מטה את הנורמל, וזה מה שמעיף את הגלגל הצידה. */
  function surfaceAt(px) {
    if (!pastLogo) {
      var dx = px - markCx;
      if (Math.abs(dx) < CROWN_HALF) {
        return [markTop + md + CROWN * dx * dx, 2 * CROWN * dx, 1];
      }
    }
    return [ground, 0, 0];
  }

  function sub(h) {
    vy += G * h;
    x += vx * h; y += vy * h; rot += om * h;
    if (!pastLogo && x - markCx > CROWN_HALF) pastLogo = true;

    var s = surfaceAt(x);
    var ys = s[0], sl = s[1], onLogo = s[2];
    pen = (y + R) - ys;
    if (pen > 0) {
      var inv = 1 / Math.sqrt(1 + sl * sl);
      var nx = sl * inv, ny = -inv;          // נורמל היוצא מהמשטח
      var tx = -ny, ty = nx;                 // משיק, לכיוון ימין
      var vn = vx * nx + vy * ny;            // שלילי כשנכנסים פנימה
      var q = pen / (BOTTOM * R);
      var Fn = K * pen * (1 + 20 * q * q * q * q) - C * vn;   // מתקשה על החישוק
      if (Fn < 0) Fn = 0;
      var vt = vx * tx + vy * ty - om * R;   // החלקה בפתח המגע
      var Ft = -sgn(vt) * Math.min(MU * Fn, Math.abs(vt) / (2 * h));
      vx += (Fn * nx + Ft * tx) * h;
      vy += (Fn * ny + Ft * ty) * h;
      om -= Ft / R * h;                      // אותו כוח מסובב את הגלגל
      var rr = RR * Fn / R * h;              // התנגדות גלגול, דרך המומנט
      om -= sgn(om) * Math.min(Math.abs(om), rr);
      if (onLogo) {
        mdv += Fn / ML * h;                  // הסימן נלחץ תחת הכוח
        if (stageT < 0) stageT = 0;          // ומאותו רגע הבמה מתחילה לזוז
      }
      wobv += Fn * WK * h;                   // והגוף מקבל רעד
      if (!onLogo && Math.abs(vy) < 45) calm += h;
    } else {
      pen = 0;
      calm = 0;
    }
    surface = ys;

    mdv += (-KL * md - CL * mdv) / ML * h;   // הסימן מתאושש בתנודה דועכת
    md += mdv * h;
    if (md < 0 && mdv > -0.5) { md = 0; mdv = 0; }
    wobv += (-KW * wob - CW * wobv) * h;
    wob += wobv * h;

    if (wordT < 0 && calm > 0.04) {
      /* רגע ההתייצבות: כאן נגמרות הקפיצות ומתחיל הגלגול. השם מונח
         כך שקצהו השמאלי בדיוק כאן, ומכאן הוא נפתח ומתקרב אל הסימן. */
      GAP = Math.max(0, x - wordLeft);
      wordT = 0;
      wordDur = Math.max(0.55, Math.min(1.1, GAP / 90));
    }
    if (stageT >= 0 && stageT < stageDur) stageT = Math.min(stageDur, stageT + h);
    if (wordT >= 0 && wordT < wordDur) wordT = Math.min(wordDur, wordT + h);
  }

  function paint() {
    wheel.style.transform = 'translate(' + (x - R) + 'px,' + (y - R) + 'px)';
    if (use3) {
      g3.render(rot, Math.min(0.45, pen / R), YAW, PITCH + Math.max(-0.16, Math.min(0.16, wob)));
    } else {
      // בגיבוי הדו-ממדי הגומי לא נמעך אלא נחתך: מה שמתחת לקרקע נעלם
      wheel.style.clipPath = pen > 0.15 ? 'inset(0 0 ' + pen.toFixed(2) + 'px 0)' : 'none';
      if (spin) spin.style.transform = 'rotate(' + rot + 'rad)';
    }

    var near = Math.max(0, 1 - Math.max(0, surface - (y + R)) / 130);
    if (shade) {
      shade.style.opacity = (0.12 + 0.5 * near).toFixed(3);
      shade.style.transform = 'translate(' + (x - R) + 'px,' + (surface - 7) + 'px)'
        + ' scale(' + (1.25 - 0.35 * near) + ',' + (0.55 + 0.45 * near) + ')';
    }
    var k = Math.max(-0.09, Math.min(0.24, md / markH));
    mark.style.transform = 'scaleY(' + (1 - k) + ') scaleX(' + (1 + k * 0.55) + ')';

    if (stageT >= 0) {
      stageE = easeOut(stageT / stageDur);
      stage.style.transform = 'translateX(' + (-SHIFT * stageE).toFixed(2) + 'px)';
    }
    if (wordT >= 0) wordE = easeInOut(wordT / wordDur);
    revealWord();
  }

  function step(now) {
    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    var n = Math.max(1, Math.ceil(dt / H)), h = dt / n;
    for (var i = 0; i < n; i++) sub(h);
    paint();
    if (x - R > exitX) { done = true; return; }
    if (!done) requestAnimationFrame(step);
  }

  paint();
  requestAnimationFrame(step);
})();
