/* ============ הגלגל של מסך הפתיחה — מודל תלת-ממדי אמיתי ============
   לא תמונה שמסובבים אלא גוף: משטח סיבוב (lathe) שנבנה מחתך הצמיג —
   טבור, צלחת החישוק, אוגן, דופן שמתנפחת, כתף, ורצועת ההילוכים שעוברת
   מסביב. הצילום מוטבע על משטח הסיבוב לפי הרדיוס, ולכן חזיתית הוא
   נראה בדיוק כמו קודם — אבל ברגע שיש סטייה קלה של המצלמה נחשפת
   רצועת הדריכה, והגוף מקבל עומק אמיתי.
   התאורה יושבת בעולם ולא על הגלגל: הברק על החישוק נשאר במקומו
   בזמן שהגלגל מסתובב תחתיו, ולכן זו לא תמונה שמסתובבת.
   מפת הבליטות נגזרת מהצילום עצמו (סובל על הבהירות), ולכן לחישוק יש
   חריצים אמיתיים לאור. הגומי נמעך בשיידר לפי החדירה הפיזיקלית
   האמיתית, והחישוק — שאינו גומי — נשאר קשיח. */
(function () {
  'use strict';

  var NSEG = 156;          // מקטעים בהיקף; 156 = 26 בלוקים × 6
  var NBLK = 26;           // בלוקים של דריכה מסביב
  var CAM = 20;            // מרחק המצלמה ביחידות רדיוס

  /* חתך הצמיג: לכל רדיוס יחסי p (כמו בצילום) הגובה z על הציר.
     r שווה ל-p בדיוק, ולכן ההיטל החזיתי זהה לתמונה המקורית. */
  var PROF = [
    [0.000, 0.255], [0.100, 0.250], [0.190, 0.232], [0.300, 0.222],
    [0.430, 0.233], [0.530, 0.259], [0.585, 0.293], [0.625, 0.318],
    [0.700, 0.340], [0.790, 0.352], [0.870, 0.357], [0.930, 0.353],
    [0.972, 0.344], [1.000, 0.330]
  ];
  var BAND_Z = [0.330, 0.198, 0.066, -0.066, -0.198, -0.330];

  var VS = [
    'attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aTan;',
    'attribute vec2 aUv;  attribute vec3 aInf;',   // kind, rubber, bandV
    'uniform mat4 uProj; uniform mat4 uMV; uniform mat3 uSpin; uniform float uContact;',
    'varying vec3 vN; varying vec3 vT; varying vec2 vUv; varying vec3 vInf;',
    'void main(){',
    '  vec3 p = uSpin * aPos;',
    '  float d = uContact - p.y;',            // חיובי מתחת למישור המגע
    '  if (d > 0.0 && aInf.y > 0.0) {',
    '    float k = aInf.y;',
    '    p.y += d * k;',                       // הגומי משתטח על הקרקע
    '    p.x += d * k * 0.55 * sign(p.x);',    // ומתנפח הצידה — נפח נשמר
    '    p.z += d * k * 0.40 * sign(p.z);',
    '  }',
    '  vN = mat3(uMV) * (uSpin * aNrm);',
    '  vT = mat3(uMV) * (uSpin * aTan);',
    '  vUv = aUv; vInf = aInf;',
    '  gl_Position = uProj * uMV * vec4(p, 1.0);',
    '}'
  ].join('\n');

  var FS = [
    'precision mediump float;',
    'varying vec3 vN; varying vec3 vT; varying vec2 vUv; varying vec3 vInf;',
    'uniform sampler2D uTex; uniform sampler2D uBump; uniform vec2 uRot;',
    'const vec3 L = vec3(-0.404, 0.808, 0.429);',
    'void main(){',
    '  vec3 N = normalize(vN);',
    '  vec3 V = vec3(0.0, 0.0, 1.0);',
    '  vec3 col; float shine = 0.0;',
    '  if (vInf.x < 0.5) {',
    /* פני הגלגל: הצילום כאלבדו, והבליטות מהצילום מסובבות יחד עם הגלגל
       כדי שהברק יישאר בעולם בזמן שהחישוק נע תחתיו */
    '    vec4 t = texture2D(uTex, vUv);',
    '    vec2 b = texture2D(uBump, vUv).xy * 2.0 - 1.0;',
    '    b = vec2(uRot.x * b.x - uRot.y * b.y, uRot.y * b.x + uRot.x * b.y);',
    '    N = normalize(N + vec3(b, 0.0) * 0.62);',
    '    float lum = dot(t.rgb, vec3(0.299, 0.587, 0.114));',
    '    float metal = smoothstep(0.20, 0.50, lum);',
    '    float ndl = max(dot(N, L), 0.0);',
    '    vec3 H = normalize(L + V);',
    '    shine = pow(max(dot(N, H), 0.0), 30.0) * (0.03 + 0.60 * metal);',
    '    col = t.rgb * (0.76 + 0.34 * ndl);',
    '  } else if (vInf.x < 1.5) {',
    /* רצועת הדריכה: בלוקים וחריצים מסביב, שורות חיצוניות מוסטות בחצי
       בלוק כמו בצמיג שטח. החריץ גם מכהה וגם מטה את הנורמל, ולכן
       האור רץ על הבלוקים כשהגלגל מתגלגל */
    '    float u = fract(vUv.x + (abs(vInf.z) > 0.42 ? 0.5 : 0.0));',
    '    float e = 0.13;',
    '    float blk = smoothstep(0.0, e, u) * smoothstep(1.0, 1.0 - e, u);',
    '    float slope = (u < e ? 1.0 : 0.0) - (u > 1.0 - e ? 1.0 : 0.0);',
    '    vec3 T = normalize(vT);',
    '    N = normalize(N + T * slope * 0.55);',
    '    float ndl = max(dot(N, L), 0.0);',
    '    float sh = 1.0 - 0.42 * smoothstep(0.52, 1.0, abs(vInf.z));',
    '    float alb = mix(0.030, 0.086, blk) * sh;',
    '    vec3 H = normalize(L + V);',
    '    shine = pow(max(dot(N, H), 0.0), 14.0) * 0.05 * blk;',
    '    col = vec3(alb) * (0.62 + 0.95 * ndl);',
    '  } else {',
    '    float ndl = max(dot(N, L), 0.0);',
    '    col = vec3(0.026 + 0.030 * ndl);',    // הצד הפנימי — כמעט שחור
    '  }',
    '  gl_FragColor = vec4(col + shine, 1.0);',
    '}'
  ].join('\n');

  function sh(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  /* מפת בליטות מהצילום: סובל על הבהירות. אין לנו גיאומטריה של חישוק,
     אבל לצילום יש כל החריצים והברגים — והם נותנים לאור על מה לרוץ. */
  var TEXN = 256;                                  // חזקת שתיים: תנאי ל-mipmap ב-WebGL1

  /* הצילום מוקטן לבד אטום בגוון הגומי: אחרת שוליים חצי-שקופים
     נמרחים לכהים בהקטנה ומופיע קו סביב הצמיג. */
  function toCanvas(img) {
    var c = document.createElement('canvas');
    c.width = c.height = TEXN;
    var g = c.getContext('2d');
    g.fillStyle = 'rgb(20,20,19)';
    g.fillRect(0, 0, TEXN, TEXN);
    g.drawImage(img, 0, 0, TEXN, TEXN);
    return c;
  }

  function bumpFrom(cv) {
    var n = cv.width;
    var g = cv.getContext('2d');
    var s = g.getImageData(0, 0, n, n).data;
    var lum = new Float32Array(n * n);
    for (var i = 0; i < n * n; i++) {
      lum[i] = (0.299 * s[i * 4] + 0.587 * s[i * 4 + 1] + 0.114 * s[i * 4 + 2]) / 255;
    }
    var out = new Uint8Array(n * n * 3);
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        var xm = x > 0 ? x - 1 : x, xp = x < n - 1 ? x + 1 : x;
        var ym = y > 0 ? y - 1 : y, yp = y < n - 1 ? y + 1 : y;
        var gx = lum[y * n + xp] - lum[y * n + xm];
        var gy = lum[yp * n + x] - lum[ym * n + x];
        var o = (y * n + x) * 3;
        out[o] = Math.max(0, Math.min(255, Math.round(128 - gx * 300)));
        out[o + 1] = Math.max(0, Math.min(255, Math.round(128 + gy * 300)));
        out[o + 2] = 255;
      }
    }
    return { data: out, size: n };
  }

  function build() {
    var pos = [], nrm = [], tan = [], uv = [], inf = [], idx = [];
    var cos = [], sin = [];
    var i, j;
    for (i = 0; i <= NSEG; i++) { var a = i / NSEG * Math.PI * 2; cos.push(Math.cos(a)); sin.push(Math.sin(a)); }

    // ---- טבעות: [r, z, kind, rubber, uvR, bandV, reliefRow]
    var rings = [];
    for (j = 0; j < PROF.length; j++) {
      var p = PROF[j][0];
      rings.push({ r: p, z: PROF[j][1], kind: 0, rub: p < 0.60 ? 0 : Math.min(1, (p - 0.60) / 0.16),
                   uvR: p * 0.985, bv: 0, rel: -1 });
    }
    for (j = 0; j < BAND_Z.length; j++) {
      var z = BAND_Z[j], v = z / 0.330;
      rings.push({ r: 1.0, z: z, kind: 1, rub: 1, uvR: 0, bv: v, rel: Math.abs(v) > 0.42 ? 1 : 0 });
    }
    for (j = PROF.length - 1; j >= 0; j--) {
      var p2 = PROF[j][0];
      rings.push({ r: p2, z: -PROF[j][1], kind: 2, rub: p2 < 0.60 ? 0 : Math.min(1, (p2 - 0.60) / 0.16),
                   uvR: 0, bv: 0, rel: -1 });
    }

    function ringR(rg, i) {
      if (rg.rel < 0) return rg.r;
      // תבליט דריכה: חריץ אחד מכל שישה מקטעים, שורות חיצוניות מוסטות
      var k = (i + (rg.rel ? 3 : 0)) % 6;
      return rg.r - (k === 0 ? 0.019 : 0);   // חריצים נחתכים פנימה: הרדיוס החיצוני נשאר 1
    }

    for (j = 0; j < rings.length; j++) {
      var rg = rings[j];
      for (i = 0; i <= NSEG; i++) {
        var r = ringR(rg, i), c = cos[i], s = sin[i];
        pos.push(r * c, r * s, rg.z);
        // נורמל מהמשיק של החתך, מסובב סביב הציר
        var pr = rings[Math.max(0, j - 1)], nx = rings[Math.min(rings.length - 1, j + 1)];
        var dr = ringR(nx, i) - ringR(pr, i), dz = nx.z - pr.z;
        var n1 = dz, n2 = -dr, L2 = Math.hypot(n1, n2) || 1;
        n1 /= L2; n2 /= L2;
        if (n1 * (rg.r - 0.72) + n2 * rg.z < 0) { n1 = -n1; n2 = -n2; }
        nrm.push(n1 * c, n1 * s, n2);
        tan.push(-s, c, 0);                        // כיוון היקפי
        if (rg.kind === 1) uv.push(i / NSEG * NBLK, 0);
        else uv.push(0.5 + rg.uvR * c * 0.5, 0.5 - rg.uvR * s * 0.5);
        inf.push(rg.kind, rg.rub, rg.bv);
      }
    }
    var W = NSEG + 1;
    for (j = 0; j < rings.length - 1; j++) {
      for (i = 0; i < NSEG; i++) {
        var A = j * W + i, B = A + 1, C = A + W, D = C + 1;
        idx.push(A, C, B, B, C, D);
      }
    }
    return { pos: pos, nrm: nrm, tan: tan, uv: uv, inf: inf, idx: idx };
  }

  function persp(fovy, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }

  /* canvas — היכן לצייר; texUrl — הצילום; margin — כמה רחב הבד ביחס
     לרדיוס הגלגל (מקום להתנפחות הגומי ולרצועה שנחשפת). */
  window.createWheel3D = function (canvas, texUrl, margin) {
    var gl;
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: true })
        || canvas.getContext('experimental-webgl', { alpha: true, antialias: true, depth: true });
    } catch (e) { gl = null; }
    if (!gl) return null;

    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl, gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, sh(gl, gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { return null; }
    gl.useProgram(prog);

    var m = build();
    function buf(arr, n, name) {
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0);
    }
    buf(m.pos, 3, 'aPos'); buf(m.nrm, 3, 'aNrm'); buf(m.tan, 3, 'aTan');
    buf(m.uv, 2, 'aUv'); buf(m.inf, 3, 'aInf');
    var ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    var big = m.pos.length / 3 > 65535;
    var ext = big ? gl.getExtension('OES_element_index_uint') : null;
    if (big && !ext) return null;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      big ? new Uint32Array(m.idx) : new Uint16Array(m.idx), gl.STATIC_DRAW);
    var nIdx = m.idx.length, iType = big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;

    function mkTex() {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([90, 90, 90, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    }
    var texA = mkTex(), texB = mkTex();
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0);
    gl.uniform1i(gl.getUniformLocation(prog, 'uBump'), 1);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texB);

    var api = { ready: false, onready: null };
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      try { load(); } catch (e) { /* בלי טקסטורה נשארים עם התמונה המסתובבת */ }
    };
    function load() {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      var cv = toCanvas(img);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      try {
        var bm = bumpFrom(cv);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texB);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, bm.size, bm.size, 0, gl.RGB, gl.UNSIGNED_BYTE, bm.data);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } catch (e) { /* בלי מפת בליטות — פשוט בלי הברק הרץ */ }
      api.ready = true;
      if (api.onready) api.onready();
    }
    img.src = texUrl;

    var uProj = gl.getUniformLocation(prog, 'uProj');
    var uMV = gl.getUniformLocation(prog, 'uMV');
    var uSpin = gl.getUniformLocation(prog, 'uSpin');
    var uContact = gl.getUniformLocation(prog, 'uContact');
    var uRot = gl.getUniformLocation(prog, 'uRot');

    // 1.02: הנטייה מגדילה מעט את ההיטל, וכך הרדיוס האנכי נשאר בדיוק R
    var half = margin * (1 + 0.33 / CAM) * 1.02;
    gl.uniformMatrix4fv(uProj, false, persp(2 * Math.atan(half / CAM), CAM - 2, CAM + 2));
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    var mv = new Float32Array(16), spin = new Float32Array(9);
    api.resize = function (cssSize, dpr) {
      var px = Math.round(cssSize * Math.min(dpr || 1, 3));
      if (canvas.width !== px) { canvas.width = px; canvas.height = px; }
      canvas.style.width = canvas.style.height = cssSize + 'px';
      gl.viewport(0, 0, px, px);
    };

    /* rot — זווית הגלגול; sink — חדירת הגומי לקרקע ביחידות רדיוס;
       yaw/pitch — נטיית הגוף מול המצלמה, כולל הרעד שאחרי פגיעה */
    api.render = function (rot, sink, yaw, pitch) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
      // mv = T(0,0,-CAM) · Ry(yaw) · Rx(pitch), עמודות
      mv[0] = cy;       mv[1] = sy * sx;   mv[2] = -sy * cx;  mv[3] = 0;
      mv[4] = 0;        mv[5] = cx;        mv[6] = sx;        mv[7] = 0;
      mv[8] = sy;       mv[9] = -cy * sx;  mv[10] = cy * cx;  mv[11] = 0;
      mv[12] = 0;       mv[13] = 0;        mv[14] = -CAM;     mv[15] = 1;
      var c = Math.cos(-rot), s = Math.sin(-rot);   // במסך חיובי הוא עם כיוון השעון
      spin[0] = c; spin[1] = s; spin[2] = 0;
      spin[3] = -s; spin[4] = c; spin[5] = 0;
      spin[6] = 0; spin[7] = 0; spin[8] = 1;
      gl.uniformMatrix4fv(uMV, false, mv);
      gl.uniformMatrix3fv(uSpin, false, spin);
      gl.uniform1f(uContact, -(1 - sink));
      gl.uniform2f(uRot, c, s);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, nIdx, iType, 0);
    };
    return api;
  };
})();
