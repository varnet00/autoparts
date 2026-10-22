  /* ============ מסך הפתיחה: הסימן נבנה כשרטוט ============
   בקניית חלק יש שאלה אחת שמכריעה — האם הוא מתאים. הסצנה הזאת עונה
   עליה בשפה שבה עונים עליה במציאות: קו מתאר, שרטוט חתך, מידות עם
   מספרים, ושמפ. אין כאן מילה אחת של שכנוע.

   מצב הסיום כתוב ב-HTML: קו מלא, מידות באורכן, מסכת החתך פתוחה.
   הקובץ הזה הוא שמסתיר את הכול בציור הראשון ומחזיר אותו בדרך. כך
   מי שכיבה אנימציות, או מי שה-JS לא הגיע אליו, רואה שרטוט גמור —
   ולא חצי מסך ריק שממתין לסקריפט שלא בא.

   הקו נמשך בתעלול הישן והנכון: מקיפים את הנתיב בקו מקווקו שאורכו
   כאורך הנתיב כולו, ומזיזים את ההיסט. תחילה נמשכת הצללית החיצונית
   ורק אחריה החללים שבתוכה — ככה זה נקרא כיד שמשרטטת, ולא כארבעה
   קווים שמופיעים יחד.

   השרטוט מתמלא דרך מסכה שנפתחת בדיוק במקביל לקווי החתך. לכן הם
   מתווספים קו אחר קו, לא ככתם שנדלק. זה ההבדל בין "מישהו משרטט"
   לבין "מישהו הפעיל אפקט".

   הזמן נמדד בשניות אמיתיות ולא בפריימים, וכל מסלול הוא חלון של
   התחלה וסוף. מסך איטי מדלג על פריימים ומגיע לאותו מקום באותו
   רגע — הסצנה לא נמתחת ולא מתקצרת. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var sheet = $('spSheet'), ext = $('spExt');
  var outer = $('spOuter'), inner = $('spInner');
  var fill = $('spFill'), wipe = $('spWipeR');
  var dims = $('spDims'), nums = $('spNums');
  var lead = $('spLead'), leadL = $('spLeadL'), leadT = $('spLeadT');
  var dH1 = $('spDH1'), dH2 = $('spDH2'), dV1 = $('spDV1'), dV2 = $('spDV2');
  var block = $('spBlock'), word = $('spWord'), sub = $('spSub'), loadF = $('spLoadF');
  /* אם ה-HTML שהגיע מהמטמון ישן יותר מהקובץ הזה, החלקים החדשים
     פשוט לא קיימים. אז עוצרים בשקט — מה שמצויר יישאר על המסך
     ויימוג כרגיל — במקום ליפול על אלמנט חסר. */
  if (!outer || !inner || !fill || !wipe || !block || !word) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var chars = word.querySelectorAll('i');
  var cells = document.querySelectorAll('#splash .bb .c');

  /* מידות בקואורדינטות של השרטוט. קו המידה נמשך מהחץ פנימה עד
     לפני המספר, ולכן המספר תמיד יושב בפער ואינו נדרס. */
  var DIMS = [
    [dH1, 'x2', 71, 290], [dH2, 'x2', 567, 348],
    [dV1, 'y2', 180, 315], [dV2, 'y2', 513, 377]
  ];
  var LO = outer.getTotalLength(), LI = inner.getTotalLength(), LL = leadL.getTotalLength();

  /* חלונות הזמן. הרצף נגמר ב-2.28 שניות, ורצפת מסך הפתיחה עומדת
     על 2.5 — כך הוא אף פעם לא נקטע באמצע משיכת קו.

     הקו הראשון עולה כבר ב-150 מילישניות. מסך פתיחה שנשאר ריק רבע
     שנייה נקרא כתקלה, במיוחד כשהשרת מתעורר וההמתנה ארוכה בלאו הכי:
     צריך שיהיה מה לראות מיד, וממנו תימשך כל השאר. */
  var T_SHEET = [0.00, 0.24], T_EXT = [0.04, 0.30];
  var T_OUT = [0.10, 0.86], T_IN = [0.74, 1.10];
  var T_WIPE = [0.96, 1.46], T_DIM = [1.16, 1.54], T_NUM = [1.38, 1.62];
  var T_LEAD = [1.42, 1.74], T_LEADT = [1.68, 1.86];
  var T_BLOCK = [1.70, 2.02], T_WORD = [1.82, 2.20];
  var T_CELL = [2.00, 2.22], T_SUB = [2.10, 2.28];
  var TOTAL = 2.28;
  var CH_DUR = 0.13;                       // כמה נמשכת הופעת אות אחת
  var CH_STEP = chars.length > 1
    ? (T_WORD[1] - T_WORD[0] - CH_DUR) / (chars.length - 1) : 0;

  function u(t, w) { return Math.max(0, Math.min(1, (t - w[0]) / (w[1] - w[0]))); }
  function out3(v) { return 1 - Math.pow(1 - v, 3); }
  /* הקו נמשך כמעט בקצב אחיד, עם בלימה רכה בסוף — כך זזה יד או
     מכונת שרטוט. התחלה איטית הייתה נקראת כאנימציה שמתחילה, לא
     כקו שנמשך. */
  function ease2(v) { return 1 - Math.pow(1 - v, 1.5); }
  function op(el, v) { if (el) el.setAttribute('opacity', v.toFixed(3)); }

  var t = 0, last = 0, done = false;

  function frame() {
    if (sheet) sheet.style.opacity = (0.3 * out3(u(t, T_SHEET))).toFixed(3);
    op(ext, u(t, T_EXT));

    var a = ease2(u(t, T_OUT));
    outer.setAttribute('stroke-dasharray', LO);
    outer.setAttribute('stroke-dashoffset', (LO * (1 - a)).toFixed(2));
    var b = ease2(u(t, T_IN));
    inner.setAttribute('stroke-dasharray', LI);
    inner.setAttribute('stroke-dashoffset', (LI * (1 - b)).toFixed(2));

    /* המסכה נפתחת במקביל לקווי החתך: הרוחב גדל, והשפה המובילה שלה
       מקבילה לקווים — ולכן הם מתמלאים אחד־אחד ולא כגוש. */
    wipe.setAttribute('width', (1400 * u(t, T_WIPE)).toFixed(1));

    var d = out3(u(t, T_DIM));
    op(dims, u(t, T_DIM) > 0 ? 1 : 0);
    for (var i = 0; i < DIMS.length; i++) {
      var it = DIMS[i];
      if (it[0]) it[0].setAttribute(it[1], (it[2] + (it[3] - it[2]) * d).toFixed(1));
    }
    op(nums, u(t, T_NUM));
    op(lead, u(t, T_LEAD) > 0 ? 1 : 0);
    var l = out3(u(t, T_LEAD));
    leadL.setAttribute('stroke-dasharray', LL);
    leadL.setAttribute('stroke-dashoffset', (LL * (1 - l)).toFixed(2));
    op(leadT, u(t, T_LEADT));

    var bl = out3(u(t, T_BLOCK));
    block.style.opacity = Math.min(1, bl * 3).toFixed(3);
    block.style.clipPath = 'inset(0 0 ' + (100 * (1 - bl)).toFixed(2) + '% 0)';

    /* האותיות נכנסות אחת אחרי השנייה, כמו טקסט שנחתם בשמפ. */
    for (i = 0; i < chars.length; i++) {
      var ct = (t - (T_WORD[0] + i * CH_STEP)) / CH_DUR;
      chars[i].style.opacity = Math.max(0, Math.min(1, ct)).toFixed(3);
    }
    for (i = 0; i < cells.length; i++) {
      cells[i].style.opacity = u(t, [T_CELL[0] + i * 0.05, T_CELL[1] + i * 0.05]).toFixed(3);
    }
    if (sub) sub.style.opacity = u(t, T_SUB).toFixed(3);
    if (loadF) loadF.style.width = (100 * Math.min(1, t / TOTAL)).toFixed(2) + '%';
  }

  function step(now) {
    if (!last) last = now;
    t += Math.min((now - last) / 1000, 1 / 20);   // מסך שנתקע לא קופץ קדימה
    last = now;
    frame();
    if (t >= TOTAL) { t = TOTAL; frame(); done = true; return; }
    if (!done) requestAnimationFrame(step);
  }

  frame();                                  // הציור הראשון: הכול מוסתר
  requestAnimationFrame(step);
})();
