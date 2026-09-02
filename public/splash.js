  /* ============ מסך הפתיחה: גלגל שנופל, מקפיץ, ומתגלגל ============
   הגלגל הוא הרנדר עצמו — התמונה כפי שהיא, מסתובבת. בלי מודל ובלי
   נפח מודבק ובלי עיוות: גלגל קשיח, עגול תמיד. מאחורי החישוק יושב
   עיגול אטום בצבע הרקע, ולכן הוא גוף ולא מדבקה: כשהוא עובר מול
   הסימן הוא חוסם אותו, והעין קוראת שני גופים זה לפני זה.

   האור על הגומי אינו מסתובב. בקובץ הוא היה אפוי בתמונה — גם האור
   הכיווני וגם הברק המבריק — וכשהתמונה מסתובבת מסתובב איתו הכול.
   לכן ניקינו את הגומי בקואורדינטות קוטביות (הרדיוס נמדד מהצללית,
   ההחלקה לפי הזווית בחלון של 14 מעלות — רחב מצעד הפרוטקטור, צר
   מהברק), והאור מוחזר כשכבה אחת במסך: כהה מלמעלה, מואר מלמטה,
   תמיד באותו כיוון. 31% אי-אחידות ירדו ל-2%.

   המגע אינו החזרה מיידית אלא כוח: הצמיג הוא קפיץ עם בולם, וההקפצה
   נולדת מהכוח הזה — ולכן הקפיצות דועכות מעצמן ואין שום מקדם החזרה
   כתוב ביד. בפתח המגע יש חיכוך קולומב אמיתי: הוא מסובב את הגלגל,
   בולם החלקה, ומייצר את התנגדות הגלגול. העיוות הזה נשאר בפיזיקה
   בלבד — הוא לא מצויר. הגלגל תמיד עגול, ותחתיתו בדיוק על המשטח.

   הסימן קשיח לגמרי ואינו נע. כל ההיענות במגע היא של הגומי, ולכן
   הפגיעה קצרה וחדה והגלגל ניתז ממנה.

   הגלגל נופל בדיוק במרכז המסך, שהוא גם מרכז הסימן. שם המשטח
   אופקי, ולכן אין שום כוח שידחוף אותו הצידה: מה שמניע אותו הוא
   הסיבוב שאיתו הוא נכנס, כמו גלגל שהשתחרר ונפל. ברגע שהוא תופס
   משטח החיכוך הופך את הסיבוב לנסיעה, והירידה מכתר הסימן רק
   מוסיפה. אין שום דחיפה כתובה ביד.

   הוא נכנס לפריים כשהוא כבר נופל מהר. אם הוא מתחיל בתוך המסך
   וממנוחה, רואים אותו נתלה רגע בקצה העליון — וזה נראה כמו הופעה,
   לא כמו נפילה.

   הצל מונח תמיד על הרצפה, מתרחב ומחוויר ככל שהגלגל גבוה, ומצויר
   לפני הסימן כך שהסימן עומד לפניו ולא נמרח בו.

   השם נחשף לאורך הקשת של הגלגל עצמו, מהנגיעה הראשונה ברצפה — אחרי
   הקפיצה הגדולה מהסימן, כשהוא כבר נוסע. הוא יושב מחוץ לזרימה,
   ולכן רוחב הבמה הוא הסימן בלבד והוא ממורכז כבר בציור הראשון.

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
  var tyre = document.getElementById('spTyre');      // הגלגל עצמו — מסתובב
  var shade = document.getElementById('spShade');
  /* אם ה-HTML שהגיע מהמטמון ישן יותר מהקובץ הזה, החלקים החדשים
     פשוט לא קיימים. אז עוצרים בשקט — מסך הפתיחה יישאר סטטי ויימוג
     כרגיל — במקום ליפול על אלמנט חסר ולהשאיר את הגלגל תקוע בפינה. */
  if (!stage || !mark || !word || !wheel || !tyre) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var G = 1900;            // כובד — ממנו יוצא קצב הנפילה
  var SAG = 0.011;         // רכות הצמיג: קובעת את משך המגע ואת ההקפצה
  /* בליעה פנימית של הגומי לפי קצב העיוות (האנט-קרוסלי): הכוח הבולם
     גדל עם החדירה, ולכן אין קפיצת כוח ברגע הנגיעה, והוא גדל עם
     המהירות — פגיעה חזקה בולעת הרבה, וקפיצה קטנה כמעט לא. מזה יוצא
     בדיוק מה שרואים אצל כדור קופץ: מכה ראשונה בולעת, ואחריה שרשרת
     קפיצות חיות שדועכות לאט. */
  var HYST = 0.0010;
  var HDRY = 0.50;         // חיכוך פנימי שאינו תלוי בקצב
  var VREST = 55;          // מתחת למהירות הזו המגע נחשב מנוחה
  var MU = 1.05;           // אחיזת גומי
  var RR = 0.012;          // התנגדות גלגול
  var BOTTOM = 0.24;       // מאיזו חדירה הצמיג יושב על החישוק ומתקשה
  var CROWN_SLOPE = 0.16;  // שיפוע הכתר בשוליו — מסייע לגלגל לרדת ממנו
  var BASE_OM = 11;        // קצב הסיבוב שאיתו הגלגל נכנס למסך, על מסך צר
  var OM0;                 // נגזר מאורך המסלול
  var H = 0.0012;          // צעד הסימולציה — הקפיץ קשיח, צריך צעד קצר

  var box = stage.getBoundingClientRect();
  var mb = mark.getBoundingClientRect();
  var wb = word.getBoundingClientRect();
  var R = (wheel.offsetWidth || 60) / 2;   // offsetWidth: לא מושפע מהסיבוב

  var markTop = mb.top - box.top;
  var markLeft = mb.left - box.left;
  var markCx = markLeft + mb.width / 2;
  var ground = mb.bottom - box.top;       // קו הרצפה של הסימן
  var wordLeft = wb.left - box.left;
  var wordW = wb.width;
  var SHIFT = wb.width / 2;
  var exitX = (window.innerWidth - box.left) + SHIFT + 60;

  var K = G / (SAG * R);                  // קשיחות הצמיג ליחידת מסה
  /* הבמה רחבה בדיוק כרוחב הסימן והיא ממורכזת, ולכן מרכז הסימן הוא
     גם מרכז המסך. הגלגל נופל בדיוק לשם. */
  var startX = markCx;
  var CROWN_HALF = mb.width * 0.42;       // מעבר לזה נגמר הסימן ונופלים ממנו
  var CROWN = CROWN_SLOPE / (2 * CROWN_HALF);   // כתר מעוגל, שיפועו נמדד בשוליים
  /* על מסך רחב יש יותר דרך לעבור, ולכן הגלגל נכנס מסתובב מהר יותר.
     זה תנאי התחלה של הסצנה ולא שינוי בדינמיקה — אחרת על מסך רחב
     הוא היה מתגלגל בנחת עוד שניות אחרי שהכול כבר עמד במקום. */
  var runway = exitX + R - startX;
  OM0 = Math.max(BASE_OM, Math.min(3.6 * BASE_OM, BASE_OM * runway / 345));

  var SHH = shade ? shade.offsetHeight / 2 : 0;   // חצי גובה הצל, נמדד פעם אחת

  var seen = 0, GAP = 0;
  var stageT = -1, stageDur = 0.70, stageE = 0;   // הבמה — מרגע הפגיעה
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
  /* הגלגל נכנס לפריים כשהוא כבר נופל. אם הוא מתחיל בתוך המסך
     וממנוחה, רואים אותו נתלה רגע בקצה העליון ורק אז יוצא לדרך —
     וזה נראה כמו הופעה, לא כמו נפילה. לכן הוא מתחיל מעל הקצה
     ובמהירות, כאילו נפל כבר מגובה. */
  var y = -box.top - R - 30;
  var VY0 = 620;
  /* הוא נופל בדיוק על מרכז הכתר, ושם המשטח אופקי: אין שום כוח
     שידחוף אותו הצידה. מה שמניע אותו הוא הסיבוב שאיתו הוא נכנס,
     כמו גלגל שהשתחרר ונפל — ברגע שהוא תופס משטח, החיכוך הופך אותו
     לנסיעה, והירידה מהכתר רק מוסיפה. אין שום דחיפה כתובה ביד. */
  var vx = 0, vy = VY0, rot = 0, om = OM0;
  var wasAir = true;
  var vIn = 0;                             // מהירות הכניסה למגע הנוכחי
  var pen = 0, pastLogo = false;
  var last = 0, done = false;

  /* גובה המשטח ושיפועו במקום נתון. הכתר של הסימן מעוגל: נחיתה מחוץ
     למרכזו מטה את הנורמל, וזה מה שמעיף את הגלגל הצידה. */
  function surfaceAt(px) {
    if (!pastLogo) {
      var dx = px - markCx;
      if (Math.abs(dx) < CROWN_HALF) {
        return [markTop + CROWN * dx * dx, 2 * CROWN * dx, 1];
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
      if (wasAir) { wasAir = false; vIn = Math.abs(vn); }
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
    } else {
      pen = 0;
      wasAir = true;
    }

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
      wordDur = Math.max(0.34, Math.min(0.70, GAP / 170));
    }
    if (stageT >= 0 && stageT < stageDur) stageT = Math.min(stageDur, stageT + h);
    if (wordT >= 0 && wordT < wordDur) wordT = Math.min(wordDur, wordT + h);
  }

  /* אין מסננים ואין שכבות מתחלפות: כל פריים הוא שתי השמות של
     transform ותו לא. מסנן טשטוש התנועה היה יפה אבל הוא מה
     שהתקע במכשירים חלשים דווקא ברגעים המהירים — הנפילה והקפיצה. */
  function paint() {
    /* הגלגל קשיח ועגול תמיד. החדירה למשטח היא כוח בלבד ואינה
       מצוירת: מרימים את הציור בדיוק בגובה החדירה, ולכן תחתית
       הגלגל יושבת על המשטח ולא שוקעת בו. */
    wheel.style.transform = 'translate(' + (x - R) + 'px,' + (y - R - pen) + 'px)';
    tyre.style.transform = 'rotate(' + rot.toFixed(4) + 'rad)';
    paintRest();
  }

  function paintRest() {
    /* הצל תמיד על הרצפה — גם כשהגלגל עוד מעל הסימן. ככה הוא לא
       קופץ מטה ברגע שהגלגל יורד מהכתר, והוא מתנהג כמו צל אמיתי:
       ככל שהגוף גבוה יותר הוא רחב, בהיר ורך יותר. */
    var up = Math.max(0, ground - (y + R)) / (R * 3);
    var near = 1 / (1 + 2.2 * up * up);
    if (shade) {
      shade.style.opacity = (0.05 + 0.30 * near).toFixed(3);
      shade.style.transform = 'translate(' + (x - R) + 'px,' + (ground - SHH) + 'px)'
        + ' scale(' + (1.60 - 0.78 * near).toFixed(3) + ',' + (0.45 + 0.62 * near).toFixed(3) + ')';
    }
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
