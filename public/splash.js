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
  var floor = document.getElementById('spFloor');    // קו הקרקע
  var glow = document.getElementById('spGlow');      // ההבזק החם
  var ring = document.getElementById('spRing');      // גל ההלם
  var trail = document.getElementById('spTrail');    // פס המהירות
  var chars = word.querySelectorAll('i');            // האותיות, אחת אחת
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
  var TW = trail ? trail.offsetWidth : 0, TH = trail ? trail.offsetHeight : 0;

  /* מרכז כל אות, במערכת הצירים של הבמה. הגלגל עובר על פניהן
     משמאל לימין, ולכן די להשוות את ה-x שלו כדי לדעת מתי כל אות
     נוחתת — אין כאן שום תזמון כתוב מראש. */
  var charCx = [], i;
  for (i = 0; i < chars.length; i++) {
    var cr = chars[i].getBoundingClientRect();
    charCx.push(cr.left - box.left + cr.width / 2);
  }
  var CH_DUR = 0.13;                      // כמה נמשכת נחיתת אות
  var CH_RISE = R * 0.34;                 // מאיזה גובה היא נופלת
  /* מרווח מזערי בין אות לאות. על מסך רחב הגלגל חוצה את השם מהר
     מאוד, ובלי זה כל האותיות היו נוחתות כמעט יחד — רעש ולא קצב.
     עם המרווח יוצא פעימה קבועה, והשם נבנה בזמן שהגלגל נוסע. */
  var CH_GAP = 0.055, chWait = 0;
  var charT = [];
  for (i = 0; i < chars.length; i++) charT.push(-1);

  /* הפגיעה בסימן. ממנה מתחילים שלושה דברים בבת אחת: רעד קצר של
     כל הסצנה, טבעת הלם שנפתחת ממקום המגע, וקו הרצפה שנמתח
     החוצה. שלושתם דועכים לבד ואינם משנים דבר בפיזיקה. */
  var impT = -1, impX = 0, impY = 0;
  var SHAKE_A = R * 0.11, SHAKE_F = 15, SHAKE_D = 0.075;
  var RING_R = R * 2.3, RING_DUR = 0.34;
  var GLOW_R = R * 2.2, GLOW_DUR = 0.40;
  var FLOOR_DUR = 0.46;

  var stageT = -1, stageDur = 0.70, stageE = 0;   // הבמה — מרגע הפגיעה

  function sgn(v) { return v > 0 ? 1 : v < 0 ? -1 : 0; }
  /* הבמה נדחפת מהפגיעה: מהר בהתחלה ונרגעת — כמו רתע. */
  function easeOut(u) { u = Math.max(0, Math.min(1, u)); return 1 - Math.pow(1 - u, 3); }

  /* נחיתת האותיות. אות מתחילה ליפול ברגע שהגלגל עבר את מרכזה,
     ונוחתת עם קפיצה קטנה — כאילו הגלגל הפיל אותה למקומה. */
  function backOut(u) {
    u = Math.max(0, Math.min(1, u)); var p = u - 1;
    return 1 + p * p * (2.4 * p + 1.4);
  }
  function dropChars(dt) {
    if (impT < 0) return;                 // לפני הפגיעה שום דבר לא נופל
    if (chWait > 0) chWait -= dt;
    for (var i = 0; i < chars.length; i++) {
      if (charT[i] < 0) {
        if (x < charCx[i] - R * 0.15 || chWait > 0) continue;
        charT[i] = 0; chWait = CH_GAP;
      } else if (charT[i] >= CH_DUR) continue;
      charT[i] = Math.min(CH_DUR, charT[i] + dt);
      var u = charT[i] / CH_DUR, e = backOut(u);
      chars[i].style.opacity = Math.min(1, u * 2.2).toFixed(3);
      chars[i].style.transform = 'translateY(' + (-CH_RISE * (1 - e)).toFixed(2) + 'px)';
    }
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
      if (onLogo && stageT < 0) {
        stageT = 0; impT = 0; impX = x; impY = ys;   // מרגע הפגיעה הכול מתחיל
      }
    } else {
      pen = 0;
      wasAir = true;
    }

    if (stageT >= 0 && stageT < stageDur) stageT = Math.min(stageDur, stageT + h);
  }

  /* אין מסננים ואין שכבות מתחלפות: כל פריים הוא שתי השמות של
     transform ותו לא. מסנן טשטוש התנועה היה יפה אבל הוא מה
     שהתקע במכשירים חלשים דווקא ברגעים המהירים — הנפילה והקפיצה. */
  function paint(dt) {
    dt = dt || 0;
    /* הגלגל קשיח ועגול תמיד. החדירה למשטח היא כוח בלבד ואינה
       מצוירת: מרימים את הציור בדיוק בגובה החדירה, ולכן תחתית
       הגלגל יושבת על המשטח ולא שוקעת בו. */
    wheel.style.transform = 'translate(' + (x - R) + 'px,' + (y - R - pen) + 'px)';
    tyre.style.transform = 'rotate(' + rot.toFixed(4) + 'rad)';

    /* פס המהירות: נמתח מאחורי הגלגל לפי המהירות האנכית. במקום
       מסנן טשטוש — צורה אחת שזזה, וזה כמעט חינם. */
    if (trail) {
      var sp = Math.min(1, Math.abs(vy) / (G * 0.62));
      if (sp > 0.05 && pen <= 0) {
        trail.style.opacity = (0.85 * sp).toFixed(3);
        trail.style.transform = 'translate(' + (x - TW / 2) + 'px,' + (y - TH) + 'px)'
          + ' scaleY(' + (0.35 + 0.65 * sp).toFixed(3) + ')';
      } else if (trail.style.opacity !== '0') trail.style.opacity = '0';
    }

    dropChars(dt);
    if (impT >= 0 && impT < 1) impT += dt;
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
    /* רגע הפגיעה. שלושה דברים דועכים במקביל, כל אחד בקצב שלו:
       טבעת הלם שנפתחת ממקום המגע, הבזק חם מאחורי הסימן, ורעד קצר
       של כל הסצנה — כמו מצלמה שקיבלה מכה. הרעד הוא תנודה דועכת
       ולא ניעור אקראי, ולכן הוא נקרא כמכה אחת ולא כרעש. */
    var sx = 0, sy = 0;
    if (impT >= 0) {
      if (impT < RING_DUR && ring) {
        var u = impT / RING_DUR, rr = RING_R * easeOut(u), dd = (2 * rr).toFixed(1) + 'px';
        ring.style.opacity = (0.8 * (1 - u) * (1 - u)).toFixed(3);
        ring.style.width = dd; ring.style.height = dd;
        ring.style.transform = 'translate(' + (impX - rr).toFixed(1) + 'px,'
          + (impY - rr).toFixed(1) + 'px)';
      } else if (ring && ring.style.opacity !== '0') ring.style.opacity = '0';

      if (impT < GLOW_DUR && glow) {
        var g = impT / GLOW_DUR;
        var gr = GLOW_R * (0.5 + 0.5 * easeOut(g));
        /* התיבה היא פיקסל אחד, וה-scale נעשה סביב מרכזה — ולכן
           ההזזה מציבה את המרכז, לא את הפינה. */
        glow.style.opacity = (0.75 * Math.min(1, g * 10) * (1 - g) * (1 - g)).toFixed(3);
        glow.style.transform = 'translate(' + (impX - 0.5).toFixed(1) + 'px,'
          + (impY - 0.5).toFixed(1) + 'px) scale(' + (2 * gr).toFixed(2) + ')';
      } else if (glow && glow.style.opacity !== '0') glow.style.opacity = '0';

      if (impT < 0.34) {
        var k = SHAKE_A * Math.exp(-impT / SHAKE_D);
        sy = k * Math.sin(2 * Math.PI * SHAKE_F * impT);
        sx = k * 0.35 * Math.sin(2 * Math.PI * SHAKE_F * 0.7 * impT);
      }
      if (floor) {
        var fu = Math.min(1, impT / FLOOR_DUR);
        floor.style.opacity = Math.min(1, impT / 0.14).toFixed(3);
        floor.style.transform = 'translateX(-50%) scaleX(' + easeOut(fu).toFixed(4) + ')';
      }
    }

    if (stageT >= 0) stageE = easeOut(stageT / stageDur);
    if (stageT >= 0 || sx || sy) {
      stage.style.transform = 'translate(' + (-SHIFT * stageE + sx).toFixed(2) + 'px,'
        + sy.toFixed(2) + 'px)';
    }
  }

  function step(now) {
    if (!last) last = now;
    var dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    var n = Math.max(1, Math.ceil(dt / H)), h = dt / n;
    for (var i = 0; i < n; i++) sub(h);
    paint(dt);
    if (x - R > exitX) { done = true; return; }
    if (!done) requestAnimationFrame(step);
  }

  paint();
  requestAnimationFrame(step);
})();
