  /* ============ מסך הפתיחה: גלגל שנופל, מקפיץ, ומתגלגל ============
   הגלגל הוא הרנדר עצמו — התמונה כפי שהיא, מסתובבת. בלי מודל ובלי
   נפח מודבק. החלונות שבין החישוקים שקופים בקובץ, ולכן רואים דרכם
   את הרקע, בדיוק כמו בגלגל אמיתי.

   התמונה מפוצלת לשתי שכבות: גומי וחישוק. מה שנכנס מתחת לקו הקרקע
   לא מצויר, והגומי גם מתרחב הצידה לפי עומק המעיכה — נפח נשמר.
   החישוק אינו נמתח לעולם: הוא נשאר עגול ורק שוקע עם הציר, בדיוק
   כמו בגלגל אמיתי שהאוויר בו מעט חסר.

   המגע אינו החזרה מיידית אלא כוח: הצמיג הוא קפיץ עם בולם, החדירה
   שלו למשטח היא בדיוק המעיכה שרואים, וההקפצה נולדת מהכוח הזה —
   ולכן הקפיצות דועכות מעצמן ואין שום מקדם החזרה כתוב ביד. בפתח
   המגע יש חיכוך קולומב אמיתי: הוא מסובב את הגלגל, בולם החלקה,
   ומייצר את התנגדות הגלגול.

   הגלגל נכנס למסך כשהוא כבר מסתובב, כמו גלגל שירד מקצה. הסיבוב
   הזה הוא מנוע הסצנה: ברגע שהוא תופס משטח, החיכוך הופך חלק ממנו
   לנסיעה קדימה — בדיוק כמו גלגל מסתובב שמניחים על הרצפה. אין שום
   דחיפה כתובה ביד.

   הסימן קשיח כאבן ואינו נע כלל. כל ההיענות במגע היא של הגומי בלבד,
   ולכן הפגיעה קצרה וחדה והגלגל ניתז ממנה — ולא שוקע ונזרק.
   אחר כך הוא נוחת על הרצפה ומקפץ כמו כדור: שרשרת קפיצות שהולכות
   וקטנות, ורק אז הוא מתיישב לגלגול. זה יוצא מעצמו מהבליעה של
   הגומי, שגדלה עם קצב העיוות — מכה חזקה בולעת הרבה וקפיצה קטנה
   כמעט לא.

   בנסיעה הוא מתנודד. גלגל מתגלגל אינו נופל: הסיבוב מייצב אותו,
   והנטייה הצידה מתחלפת בהיגוי דרך פרסציה גירוסקופית — ההיגוי
   מפגר אחרי הנטייה ברבע מחזור, ולכן זה יוצא נדנוד ולא נפילה.
   תדר הנדנוד עולה עם קצב הסיבוב, וכל נחיתה מנערת אותו לצד השני.

   השם נחשף לאורך הקשת של הגלגל עצמו, מהנגיעה הראשונה ברצפה — אחרי
   הקפיצה הגדולה מהסימן, כשהוא כבר נוסע. הוא יושב מחוץ לזרימה, ולכן רוחב
   הבמה הוא הסימן בלבד והוא ממורכז כבר בציור הראשון.

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
  var cut = document.getElementById('spCut');        // קופסת החיתוך, לא מסתובבת
  var tyre = document.getElementById('spTyre');      // הגומי — נמעך
  var rim = document.getElementById('spRim');        // החישוק — קשיח
  var shade = document.getElementById('spShade');
  /* אם ה-HTML שהגיע מהמטמון ישן יותר מהקובץ הזה, החלקים החדשים
     פשוט לא קיימים. אז עוצרים בשקט — מסך הפתיחה יישאר סטטי ויימוג
     כרגיל — במקום ליפול על אלמנט חסר ולהשאיר את הגלגל תקוע בפינה. */
  if (!stage || !mark || !word || !wheel || !cut || !tyre || !rim) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var G = 1200;            // נפילה קלה יותר; עומק המעיכה תלוי בגובה, לא בו
  var SAG = 0.016;         // צמיג מרוקן למחצה: שוקע יותר ונמעך עמוק יותר
  /* בליעה פנימית של הגומי לפי קצב העיוות (האנט-קרוסלי): הכוח הבולם
     גדל עם החדירה, ולכן אין קפיצת כוח ברגע הנגיעה, והוא גדל עם
     המהירות — פגיעה חזקה בולעת הרבה, וקפיצה קטנה כמעט לא. מזה יוצא
     בדיוק מה שרואים אצל כדור קופץ: מכה ראשונה בולעת, ואחריה שרשרת
     קפיצות חיות שדועכות לאט. */
  var HYST = 0.0010;
  var HDRY = 0.50;         // חיכוך פנימי שאינו תלוי בקצב
  var BULGE = 0.55;        // כמה הגומי מתרחב לרוחב ביחס לעומק המעיכה
  var VREST = 55;          // מתחת למהירות הזו המגע נחשב מנוחה
  var FLAT0 = 0.05;        // משטח המגע של צמיג רך גם בלי מכה, ביחידות רדיוס

  /* הסימן נותן קצת. הוא קשיח בערך פי שמונה מהצמיג, ולכן כמעט כל
     ההיענות במגע נשארת של הגומי והגלגל עדיין ניתז ממנו כמעט כמו מאבן —
     אבל העין קולטת שגם הוא הגיב. מסה על קפיץ עם בולם, מונע מכוח
     המגע עצמו, ומשטח הנחיתה יורד יחד איתו. */
  var ML = 8, KL = 13000, CL = 160;
  var MU = 1.05;           // אחיזת גומי
  var RR = 0.012;          // התנגדות גלגול
  var BOTTOM = 0.24;       // מאיזו חדירה הצמיג יושב על החישוק ומתקשה
  var CROWN_SLOPE = 0.05;  // כתר הסימן מעוגל קלות — הזריקה יוצאת מעט אלכסונית
  var BASE_OM = 6;         // קצב הסיבוב שאיתו הגלגל נכנס למסך, על מסך צר
  var OM0;                 // נגזר מאורך המסלול
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
  var startX = markCx + mb.width * 0.16;  // נוחתים מימין למרכז הכתר
  /* על מסך רחב יש יותר דרך לעבור, ולכן הגלגל נכנס מסתובב מהר יותר.
     זה תנאי התחלה של הסצנה ולא שינוי בדינמיקה — אחרת על מסך רחב
     הוא היה מתגלגל בנחת עוד שניות אחרי שהכול כבר עמד במקום. */
  var runway = exitX + R - startX;
  OM0 = Math.max(BASE_OM, Math.min(2.6 * BASE_OM, BASE_OM * runway / 345));
  var CROWN = CROWN_SLOPE / (2 * (startX - markCx));
  var CROWN_HALF = mb.width * 0.42;       // מעבר לזה נגמר הסימן ונופלים ממנו

  /* התנודדות בנסיעה. גלגל מתגלגל לא נופל: הסיבוב מייצב אותו, והנטייה
     הצידה מתחלפת בהיגוי דרך פרסציה גירוסקופית — ההיגוי מפגר אחרי
     הנטייה ברבע מחזור. תדר ההתנודדות עולה עם קצב הסיבוב, כמו בגוף
     מסתובב אמיתי, והדעיכה איטית: גלגל מתנודד הרבה זמן. */
  var LEAN_D = 0.055;                     // דעיכת ההתנודדות
  var LEAN_F = 0.62;                      // תדר ההתנודדות ביחס לקצב הסיבוב
  var STEER_A = 0.75;                     // כמה ההיגוי נגרר אחרי הנטייה
  var LEAN_KICK = 1.6e-4;                 // כמה כל נחיתה מנערת אותו — עדין

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
  /* הגלגל לא נופל מת: הוא כבר מסתובב כשהוא נכנס למסך, כמו גלגל
     שהתגלגל וירד מקצה. הסיבוב הזה הוא שנהפך למהירות קדימה ברגע
     שהוא תופס משטח — בלעדיו הוא נוחת בלי סיבוב, מחליק בכל
     נגיעה ומאבד חצי מהמהירות בכל נחיתה. */
  var vx = 0, vy = 0, rot = 0, om = OM0;
  var md = 0, mdv = 0;                     // הכנעת הסימן ומהירותה
  var lean = 0, leanV = 0, steer = 0;      // נטייה והיגוי
  var kick = 1, wasAir = true;             // כל נחיתה מנערת לצד השני
  var vIn = 0;                             // מהירות הכניסה למגע הנוכחי
  var pen = 0, surface = ground, pastLogo = false;
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
    var Fn = 0;
    if (pen > 0) {
      var inv = 1 / Math.sqrt(1 + sl * sl);
      var nx = sl * inv, ny = -inv;          // נורמל היוצא מהמשטח
      var tx = -ny, ty = nx;                 // משיק, לכיוון ימין
      var vn = vx * nx + vy * ny;            // שלילי כשנכנסים פנימה
      if (wasAir) { kick = -kick; wasAir = false; vIn = Math.abs(vn); }
      var q = pen / (BOTTOM * R);
      /* שתי בליעות. הראשונה תלויה בקצב העיוות ולכן בולעת מכה חזקה.
         השנייה היא חיכוך פנימי של הגומי שאינו תלוי בקצב: הוא מוסיף
         כוח בכניסה וגורע ביציאה, ולכן לוקח שבר קבוע מהאנרגיה בכל
         מגע — וזה מה שמחסל את שרשרת הקפיצות הקטנות. בלעדיו קפיצה
         איטית כמעט לא נבלעת והגלגל מרטט עד אין סוף. */
      Fn = K * pen * (1 + 20 * q * q * q * q) * (1 - HYST * vn - HDRY * sgn(vn));
      if (Fn < 0) Fn = 0;                                          // משטח לא מושך
      var vt = vx * tx + vy * ty - om * R;   // החלקה בפתח המגע
      var Ft = -sgn(vt) * Math.min(MU * Fn, Math.abs(vt) / (2 * h));
      vx += (Fn * nx + Ft * tx) * h;
      vy += (Fn * ny + Ft * ty) * h;
      om -= Ft / R * h;                      // אותו כוח מסובב את הגלגל
      var rr = RR * Fn / R * h;              // התנגדות גלגול, דרך המומנט
      om -= sgn(om) * Math.min(Math.abs(om), rr);
      /* מגע מנוחה. הבליעה של הגומי גדלה עם קצב העיוות, ולכן נגיעה
         איטית מאוד כמעט לא נבלעת והגלגל היה רועד בלי סוף בשבריר
         פיקסל. המבחן הוא על מהירות הכניסה למגע ולא על המהירות
         הרגעית — אחרת הוא היה מאפס גם את שיא הדחיסה של פגיעה חזקה
         ומבטל את ההקפצה עצמה. */
      if (vIn < VREST) { vx -= vn * nx; vy -= vn * ny; }
      if (onLogo && stageT < 0) stageT = 0;   // מרגע הפגיעה הבמה זזה
      // רק מכה של ממש מנערת את הגלגל; המשקל השוטף לא
      if (Fn > 4 * G) leanV += (Fn - 4 * G) * LEAN_KICK * h * kick;
    } else {
      pen = 0;
      wasAir = true;
    }
    surface = ys;

    // הסימן: מסה על קפיץ, מונע מכוח המגע ומתאושש בתנודה דועכת
    mdv += ((onLogo ? Fn : 0) - KL * md - CL * mdv) / ML * h;
    md += mdv * h;
    if (md < 0 && mdv > -0.5) { md = 0; mdv = 0; }

    var ws = Math.max(2.5, Math.abs(om) * LEAN_F);
    leanV += (-ws * ws * lean - 2 * LEAN_D * ws * leanV) * h;
    lean += leanV * h;
    if (lean > 0.2) { lean = 0.2; leanV = 0; }
    if (lean < -0.2) { lean = -0.2; leanV = 0; }
    steer = -(leanV / ws) * STEER_A;

    if (wordT < 0 && pen > 0 && pastLogo && vIn < 200) {
      /* הנגיעה הרכה הראשונה ברצפה: הקפיצות כבר נגמרו והגלגל נוסע.
         המבחן הוא על מהירות הכניסה למגע — נחיתה חזקה עוד אומרת
         שיש קפיצה אחריה, ואז אין טעם לפתוח אותיות. מכאן
         והלאה הגלגל כבר נוסע — הקפיצות שנשארו נמוכות. השם מונח כך
         שקצהו השמאלי בדיוק כאן, ומכאן הוא נפתח ומתקרב אל הסימן. */
      /* עוד קצת ימינה מנקודת הנגיעה: בקפיצה הראשונה הגלגל עדיין
         עולה גבוה, וכך האות הראשונה יוצאת רק כשהוא כבר יורד. */
      GAP = Math.max(0, x - wordLeft) + R * 0.7;
      wordT = 0;
      wordDur = Math.max(0.55, Math.min(1.1, GAP / 90));
    }
    if (stageT >= 0 && stageT < stageDur) stageT = Math.min(stageDur, stageT + h);
    if (wordT >= 0 && wordT < wordDur) wordT = Math.min(wordDur, wordT + h);
  }

  function paint() {
    /* בצמיג מעט מרוקן יש משטח מגע קטן גם סתם כך, ולכן במגע יש רצפה
       למעיכה הנראית — באוויר הגלגל עגול לגמרי, כמו צמיג אמיתי.
       מה שנחתך מעבר לחדירה הפיזיקלית מוחזר בשקיעת הציר, אחרת
       הגלגל היה מרחף מעל הקרקע בדיוק באותו שיעור. */
    var flat = pen > 0 ? Math.max(pen, R * FLAT0) : 0;
    wheel.style.transform = 'translate(' + (x - R) + 'px,' + (y - R + flat - pen) + 'px)';
    cut.style.clipPath = flat > 0.12 ? 'inset(0 0 ' + flat.toFixed(2) + 'px 0)' : 'none';
    // הסיבוב סביב הציר, ומעליו הנטייה וההיגוי של ההתנודדות
    var sp = 'rotateX(' + lean.toFixed(4) + 'rad) rotateY('
      + steer.toFixed(4) + 'rad) rotate(' + rot.toFixed(4) + 'rad)';
    // הגומי שנמעך לגובה מתרחב לרוחב; הרוחב נמדד במסך ולכן אחרי הסיבוב
    if (tyre) tyre.style.transform = 'scaleX(' + (1 + BULGE * flat / R).toFixed(4) + ') ' + sp;
    if (rim) rim.style.transform = sp;

    var near = Math.max(0, 1 - Math.max(0, surface - (y + R)) / 130);
    if (shade) {
      shade.style.opacity = (0.12 + 0.5 * near).toFixed(3);
      shade.style.transform = 'translate(' + (x - R) + 'px,' + (surface - 7) + 'px)'
        + ' scale(' + (1.25 - 0.35 * near) + ',' + (0.55 + 0.45 * near) + ')';
    }
    // הגומי לוחץ את הסימן לגובה והוא מתרחב מעט לרוחב
    var k = Math.max(-0.02, Math.min(0.09, md / markH));
    mark.style.transform = 'scaleY(' + (1 - k).toFixed(4) + ') scaleX(' + (1 + k * 0.45).toFixed(4) + ')';

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
