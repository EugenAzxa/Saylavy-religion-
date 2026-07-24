/* =========================================================
   Saylavy - language switch for community leaders

   Many leaders read Arabic, Punjabi, Hindi, Hebrew, Greek,
   Urdu, Spanish or Chinese more comfortably than English.
   The switch translates the interface and the whole offer so
   a leader can understand the proposal without a translator.

   Right-to-left languages flip the page direction properly.
   Children's lesson content stays in the community's own
   teaching language and is set with their teachers.
   ========================================================= */
(function () {
  "use strict";

  var LANGS = [
    { code: "en", label: "English",  native: "English",  dir: "ltr" },
    { code: "ar", label: "Arabic",   native: "العربية",   dir: "rtl" },
    { code: "ur", label: "Urdu",     native: "اردو",      dir: "rtl" },
    { code: "he", label: "Hebrew",   native: "עברית",     dir: "rtl" },
    { code: "pa", label: "Punjabi",  native: "ਪੰਜਾਬੀ",     dir: "ltr" },
    { code: "hi", label: "Hindi",    native: "हिन्दी",      dir: "ltr" },
    { code: "el", label: "Greek",    native: "Ελληνικά",  dir: "ltr" },
    { code: "es", label: "Spanish",  native: "Español",   dir: "ltr" },
    { code: "zh", label: "Chinese",  native: "中文",       dir: "ltr" }
  ];

  var T = {
    en: {
      "nav.faiths": "Faiths", "nav.how": "How it works", "nav.safe": "Why it is safe",
      "nav.communities": "Communities", "nav.partner": "Partner",
      "cta.start": "Start a collaboration", "cta.write": "Write to us",
      "hero.eyebrow": "For faith communities",
      "hero.lead": "An interactive learning page and a QR code for your community. Scan it, listen, ask a question out loud, and hear the answer back in a voice your teachers approve.",
      "hero.meet": "Meet the eight faiths",
      "leaders.title": "For community leaders",
      "leaders.p1": "Saylavy builds your community a page where children meet your faith in real voices.",
      "leaders.p2": "They listen, ask questions out loud, and hear a warm answer back.",
      "leaders.p3": "Nothing goes live until your teachers approve every word. The faith stays yours.",
      "leaders.p4": "You receive a QR code for your bulletin, your wall, or a card to take home.",
      "leaders.p5": "It would be an honour to build one together with your community.",
      "faith.ask": "Ask a question", "faith.language": "Learn the language",
      "faith.people": "Meet the people",
      "sw.label": "Language"
    },
    ar: {
      "nav.faiths": "الأديان", "nav.how": "كيف يعمل", "nav.safe": "لماذا هو آمن",
      "nav.communities": "المجتمعات", "nav.partner": "شراكة",
      "cta.start": "ابدأ التعاون", "cta.write": "راسلنا",
      "hero.eyebrow": "للمجتمعات الدينية",
      "hero.lead": "صفحة تعليمية تفاعلية ورمز استجابة سريعة لمجتمعكم. امسحوه، استمعوا، اطرحوا سؤالاً بصوت عالٍ، واستمعوا إلى الإجابة بصوت يوافق عليه معلموكم.",
      "hero.meet": "تعرّف على الأديان الثمانية",
      "leaders.title": "إلى قادة المجتمع",
      "leaders.p1": "تبني Saylavy لمجتمعكم صفحة يتعرف فيها الأطفال على دينكم بأصوات حقيقية.",
      "leaders.p2": "يستمعون، ويطرحون الأسئلة بصوت عالٍ، ويسمعون إجابة دافئة.",
      "leaders.p3": "لا يُنشر شيء قبل أن يوافق معلموكم على كل كلمة. يبقى الدين ملككم.",
      "leaders.p4": "تحصلون على رمز استجابة سريعة للنشرة أو الجدار أو بطاقة تُؤخذ إلى البيت.",
      "leaders.p5": "يشرفنا أن نبنيها معكم.",
      "faith.ask": "اطرح سؤالاً", "faith.language": "تعلّم اللغة",
      "faith.people": "تعرّف على الشخصيات",
      "sw.label": "اللغة"
    },
    ur: {
      "nav.faiths": "مذاہب", "nav.how": "یہ کیسے کام کرتا ہے", "nav.safe": "یہ محفوظ کیوں ہے",
      "nav.communities": "کمیونٹیز", "nav.partner": "شراکت",
      "cta.start": "تعاون شروع کریں", "cta.write": "ہمیں لکھیں",
      "hero.eyebrow": "مذہبی کمیونٹیز کے لیے",
      "hero.lead": "آپ کی کمیونٹی کے لیے ایک انٹرایکٹو تعلیمی صفحہ اور کیو آر کوڈ۔ اسے اسکین کریں، سنیں، بلند آواز میں سوال پوچھیں، اور اس آواز میں جواب سنیں جسے آپ کے اساتذہ منظور کرتے ہیں۔",
      "hero.meet": "آٹھ مذاہب سے ملیں",
      "leaders.title": "کمیونٹی رہنماؤں کے لیے",
      "leaders.p1": "Saylavy آپ کی کمیونٹی کے لیے ایک صفحہ بناتا ہے جہاں بچے حقیقی آوازوں میں آپ کے دین سے ملتے ہیں۔",
      "leaders.p2": "وہ سنتے ہیں، بلند آواز میں سوال پوچھتے ہیں، اور نرم جواب سنتے ہیں۔",
      "leaders.p3": "جب تک آپ کے اساتذہ ہر لفظ کی منظوری نہ دیں کچھ شائع نہیں ہوتا۔ دین آپ کا رہتا ہے۔",
      "leaders.p4": "آپ کو ایک کیو آر کوڈ ملتا ہے، بلیٹن، دیوار یا گھر لے جانے والے کارڈ کے لیے۔",
      "leaders.p5": "ہمیں آپ کے ساتھ مل کر یہ بنانے پر فخر ہوگا۔",
      "faith.ask": "سوال پوچھیں", "faith.language": "زبان سیکھیں",
      "faith.people": "شخصیات سے ملیں",
      "sw.label": "زبان"
    },
    he: {
      "nav.faiths": "דתות", "nav.how": "איך זה עובד", "nav.safe": "למה זה בטוח",
      "nav.communities": "קהילות", "nav.partner": "שותפות",
      "cta.start": "התחילו שיתוף פעולה", "cta.write": "כתבו לנו",
      "hero.eyebrow": "לקהילות דתיות",
      "hero.lead": "דף לימוד אינטראקטיבי וקוד QR לקהילה שלכם. סרקו, האזינו, שאלו שאלה בקול, ושמעו תשובה בקול שהמורים שלכם אישרו.",
      "hero.meet": "הכירו את שמונה הדתות",
      "leaders.title": "למנהיגי הקהילה",
      "leaders.p1": "Saylavy בונה לקהילה שלכם דף שבו ילדים פוגשים את האמונה שלכם בקולות אמיתיים.",
      "leaders.p2": "הם מאזינים, שואלים שאלות בקול, ושומעים תשובה חמה.",
      "leaders.p3": "שום דבר לא עולה לאוויר עד שהמורים שלכם מאשרים כל מילה. האמונה נשארת שלכם.",
      "leaders.p4": "אתם מקבלים קוד QR לעלון, לקיר, או לכרטיס לקחת הביתה.",
      "leaders.p5": "יהיה לנו כבוד לבנות אותו יחד אתכם.",
      "faith.ask": "שאלו שאלה", "faith.language": "למדו את השפה",
      "faith.people": "הכירו את הדמויות",
      "sw.label": "שפה"
    },
    pa: {
      "nav.faiths": "ਧਰਮ", "nav.how": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ", "nav.safe": "ਇਹ ਸੁਰੱਖਿਅਤ ਕਿਉਂ ਹੈ",
      "nav.communities": "ਸੰਗਤਾਂ", "nav.partner": "ਭਾਈਵਾਲੀ",
      "cta.start": "ਸਾਂਝ ਸ਼ੁਰੂ ਕਰੋ", "cta.write": "ਸਾਨੂੰ ਲਿਖੋ",
      "hero.eyebrow": "ਧਾਰਮਿਕ ਸੰਗਤਾਂ ਲਈ",
      "hero.lead": "ਤੁਹਾਡੀ ਸੰਗਤ ਲਈ ਇੱਕ ਇੰਟਰੈਕਟਿਵ ਸਿੱਖਿਆ ਪੰਨਾ ਅਤੇ ਇੱਕ QR ਕੋਡ। ਇਸਨੂੰ ਸਕੈਨ ਕਰੋ, ਸੁਣੋ, ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ, ਅਤੇ ਉਸ ਆਵਾਜ਼ ਵਿੱਚ ਜਵਾਬ ਸੁਣੋ ਜਿਸਨੂੰ ਤੁਹਾਡੇ ਅਧਿਆਪਕ ਪ੍ਰਵਾਨ ਕਰਦੇ ਹਨ।",
      "hero.meet": "ਅੱਠ ਧਰਮਾਂ ਨੂੰ ਮਿਲੋ",
      "leaders.title": "ਸੰਗਤ ਦੇ ਆਗੂਆਂ ਲਈ",
      "leaders.p1": "Saylavy ਤੁਹਾਡੀ ਸੰਗਤ ਲਈ ਇੱਕ ਪੰਨਾ ਬਣਾਉਂਦਾ ਹੈ ਜਿੱਥੇ ਬੱਚੇ ਅਸਲੀ ਆਵਾਜ਼ਾਂ ਵਿੱਚ ਤੁਹਾਡੇ ਧਰਮ ਨੂੰ ਮਿਲਦੇ ਹਨ।",
      "leaders.p2": "ਉਹ ਸੁਣਦੇ ਹਨ, ਉੱਚੀ ਆਵਾਜ਼ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛਦੇ ਹਨ, ਅਤੇ ਨਿੱਘਾ ਜਵਾਬ ਸੁਣਦੇ ਹਨ।",
      "leaders.p3": "ਜਦੋਂ ਤੱਕ ਤੁਹਾਡੇ ਅਧਿਆਪਕ ਹਰ ਸ਼ਬਦ ਪ੍ਰਵਾਨ ਨਹੀਂ ਕਰਦੇ, ਕੁਝ ਵੀ ਲਾਈਵ ਨਹੀਂ ਹੁੰਦਾ। ਧਰਮ ਤੁਹਾਡਾ ਹੀ ਰਹਿੰਦਾ ਹੈ।",
      "leaders.p4": "ਤੁਹਾਨੂੰ ਇੱਕ QR ਕੋਡ ਮਿਲਦਾ ਹੈ, ਬੁਲੇਟਿਨ, ਕੰਧ ਜਾਂ ਘਰ ਲਿਜਾਣ ਵਾਲੇ ਕਾਰਡ ਲਈ।",
      "leaders.p5": "ਤੁਹਾਡੇ ਨਾਲ ਮਿਲ ਕੇ ਇਹ ਬਣਾਉਣਾ ਸਾਡੇ ਲਈ ਮਾਣ ਦੀ ਗੱਲ ਹੋਵੇਗੀ।",
      "faith.ask": "ਸਵਾਲ ਪੁੱਛੋ", "faith.language": "ਭਾਸ਼ਾ ਸਿੱਖੋ",
      "faith.people": "ਸ਼ਖਸੀਅਤਾਂ ਨੂੰ ਮਿਲੋ",
      "sw.label": "ਭਾਸ਼ਾ"
    },
    hi: {
      "nav.faiths": "धर्म", "nav.how": "यह कैसे काम करता है", "nav.safe": "यह सुरक्षित क्यों है",
      "nav.communities": "समुदाय", "nav.partner": "साझेदारी",
      "cta.start": "सहयोग शुरू करें", "cta.write": "हमें लिखें",
      "hero.eyebrow": "धार्मिक समुदायों के लिए",
      "hero.lead": "आपके समुदाय के लिए एक इंटरैक्टिव शिक्षा पृष्ठ और एक QR कोड। इसे स्कैन करें, सुनें, ज़ोर से प्रश्न पूछें, और उस स्वर में उत्तर सुनें जिसे आपके शिक्षक स्वीकृत करते हैं।",
      "hero.meet": "आठ धर्मों से मिलें",
      "leaders.title": "समुदाय के प्रमुखों के लिए",
      "leaders.p1": "Saylavy आपके समुदाय के लिए एक पृष्ठ बनाता है जहाँ बच्चे असली आवाज़ों में आपके धर्म से मिलते हैं।",
      "leaders.p2": "वे सुनते हैं, ज़ोर से प्रश्न पूछते हैं, और स्नेहपूर्ण उत्तर सुनते हैं।",
      "leaders.p3": "जब तक आपके शिक्षक हर शब्द स्वीकृत नहीं करते, कुछ भी प्रकाशित नहीं होता। धर्म आपका ही रहता है।",
      "leaders.p4": "आपको एक QR कोड मिलता है, बुलेटिन, दीवार या घर ले जाने वाले कार्ड के लिए।",
      "leaders.p5": "आपके साथ मिलकर इसे बनाना हमारे लिए सम्मान की बात होगी।",
      "faith.ask": "प्रश्न पूछें", "faith.language": "भाषा सीखें",
      "faith.people": "व्यक्तित्वों से मिलें",
      "sw.label": "भाषा"
    },
    el: {
      "nav.faiths": "Θρησκείες", "nav.how": "Πώς λειτουργεί", "nav.safe": "Γιατί είναι ασφαλές",
      "nav.communities": "Κοινότητες", "nav.partner": "Συνεργασία",
      "cta.start": "Ξεκινήστε μια συνεργασία", "cta.write": "Γράψτε μας",
      "hero.eyebrow": "Για θρησκευτικές κοινότητες",
      "hero.lead": "Μια διαδραστική σελίδα μάθησης και ένας κωδικός QR για την κοινότητά σας. Σαρώστε τον, ακούστε, κάντε μια ερώτηση δυνατά και ακούστε την απάντηση με φωνή που εγκρίνουν οι δάσκαλοί σας.",
      "hero.meet": "Γνωρίστε τις οκτώ θρησκείες",
      "leaders.title": "Για τους υπευθύνους της κοινότητας",
      "leaders.p1": "Η Saylavy φτιάχνει για την κοινότητά σας μια σελίδα όπου τα παιδιά συναντούν την πίστη σας με αληθινές φωνές.",
      "leaders.p2": "Ακούν, ρωτούν δυνατά και ακούν μια ζεστή απάντηση.",
      "leaders.p3": "Τίποτα δεν δημοσιεύεται πριν οι δάσκαλοί σας εγκρίνουν κάθε λέξη. Η πίστη παραμένει δική σας.",
      "leaders.p4": "Λαμβάνετε έναν κωδικό QR για το δελτίο, τον τοίχο ή μια κάρτα για το σπίτι.",
      "leaders.p5": "Θα ήταν τιμή μας να τη φτιάξουμε μαζί σας.",
      "faith.ask": "Κάντε μια ερώτηση", "faith.language": "Μάθετε τη γλώσσα",
      "faith.people": "Γνωρίστε τα πρόσωπα",
      "sw.label": "Γλώσσα"
    },
    es: {
      "nav.faiths": "Religiones", "nav.how": "Cómo funciona", "nav.safe": "Por qué es seguro",
      "nav.communities": "Comunidades", "nav.partner": "Colaborar",
      "cta.start": "Iniciar una colaboración", "cta.write": "Escríbanos",
      "hero.eyebrow": "Para comunidades de fe",
      "hero.lead": "Una página de aprendizaje interactiva y un código QR para su comunidad. Escanéelo, escuche, haga una pregunta en voz alta y escuche la respuesta con una voz que sus maestros aprueban.",
      "hero.meet": "Conozca las ocho religiones",
      "leaders.title": "Para los líderes de la comunidad",
      "leaders.p1": "Saylavy crea para su comunidad una página donde los niños conocen su fe con voces reales.",
      "leaders.p2": "Escuchan, preguntan en voz alta y reciben una respuesta cálida.",
      "leaders.p3": "Nada se publica hasta que sus maestros aprueben cada palabra. La fe sigue siendo suya.",
      "leaders.p4": "Usted recibe un código QR para el boletín, la pared o una tarjeta para llevar a casa.",
      "leaders.p5": "Sería un honor construirla junto a su comunidad.",
      "faith.ask": "Haga una pregunta", "faith.language": "Aprenda el idioma",
      "faith.people": "Conozca a las personas",
      "sw.label": "Idioma"
    },
    zh: {
      "nav.faiths": "信仰", "nav.how": "运作方式", "nav.safe": "为何安全",
      "nav.communities": "社区", "nav.partner": "合作",
      "cta.start": "开始合作", "cta.write": "联系我们",
      "hero.eyebrow": "为信仰社区而建",
      "hero.lead": "为您的社区打造的互动学习页面和二维码。扫描后即可聆听，大声提问，并听到由您的老师认可的声音作出的回答。",
      "hero.meet": "认识八大信仰",
      "leaders.title": "致社区领袖",
      "leaders.p1": "Saylavy 为您的社区建立一个页面，让孩子们以真实的声音认识你们的信仰。",
      "leaders.p2": "他们聆听、大声提问，并听到温暖的回答。",
      "leaders.p3": "在您的老师逐字批准之前，任何内容都不会发布。信仰始终属于你们。",
      "leaders.p4": "您会获得一个二维码，可用于周报、墙上或带回家的卡片。",
      "leaders.p5": "能与您的社区一同建设，将是我们的荣幸。",
      "faith.ask": "提出问题", "faith.language": "学习语言",
      "faith.people": "认识这些人物",
      "sw.label": "语言"
    }
  };

  var KEY = "saylavy-lang";
  var current = "en";

  function t(k) { return (T[current] && T[current][k]) || T.en[k] || k; }

  function apply(code) {
    if (!T[code]) code = "en";
    current = code;
    var meta = LANGS.filter(function (l) { return l.code === code; })[0] || LANGS[0];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });

    // whole-page direction for Arabic, Urdu and Hebrew
    document.documentElement.setAttribute("lang", code);
    document.documentElement.setAttribute("dir", meta.dir);
    document.body.classList.toggle("rtl", meta.dir === "rtl");

    var lbl = document.getElementById("langCurrent");
    if (lbl) lbl.textContent = meta.native;
    document.querySelectorAll("#langMenu button").forEach(function (b) {
      b.setAttribute("aria-current", b.dataset.code === code ? "true" : "false");
    });
    try { localStorage.setItem(KEY, code); } catch (e) {}
  }

  function build() {
    var host = document.querySelector(".nav-cta");
    if (!host || document.getElementById("langBtn")) return;
    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.innerHTML =
      '<button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-label="Language">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>' +
        '<span id="langCurrent">English</span>' +
      '</button>' +
      '<div class="lang-menu" id="langMenu" role="menu">' +
        LANGS.map(function (l) {
          return '<button type="button" role="menuitem" data-code="' + l.code + '" lang="' + l.code + '">' +
                 '<span>' + l.native + '</span><small>' + l.label + '</small></button>';
        }).join("") +
      '</div>';
    host.insertBefore(wrap, host.firstChild);

    var btn = wrap.querySelector("#langBtn"), menu = wrap.querySelector("#langMenu");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-code]");
      if (!b) return;
      apply(b.dataset.code);
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("click", function () {
      wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
    });
  }

  function init() {
    build();
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var url = new URLSearchParams(location.search).get("lang");
    apply(url || saved || "en");
  }

  window.SaylavyI18n = { init: init, apply: apply, t: t, langs: LANGS };
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
