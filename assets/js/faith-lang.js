/* =========================================================
   Saylavy - the living language of each faith
   Real script, transliteration, meaning, and the letters
   children learn first. Short everyday phrases only, so
   nothing sacred is reduced to a lesson snippet.
   Each entry: {script, translit, meaning}
   ========================================================= */
(function () {
  "use strict";

  window.FAITH_LANG = {

    protestant: {
      lang: "Koine Greek and Hebrew", dir: "ltr", langCode: "el",
      note: "The Bible reaches us through Hebrew and Greek. A few words are still used in worship everywhere.",
      letters: { title: "First letters", dir: "ltr", items: ["Α α", "Β β", "Γ γ", "Δ δ"], caption: "Alpha, Beta, Gamma, Delta - the Greek alphabet of the New Testament" },
      phrases: [
        { script: "Ἀμήν", translit: "Amen", meaning: "So be it, truly" },
        { script: "Ἀλληλούϊα", translit: "Alleluia", meaning: "Praise the Lord" },
        { script: "Χάρις", translit: "Charis", meaning: "Grace, a gift freely given" },
        { script: "Ἀγάπη", translit: "Agape", meaning: "Love that gives itself away" }
      ]
    },

    catholic: {
      lang: "Latin", dir: "ltr", langCode: "la",
      note: "Latin is the language of the Church's oldest prayers, still sung at Mass around the world.",
      letters: { title: "Words at Mass", dir: "ltr", items: ["Amen", "Alleluia", "Sanctus", "Gloria"], caption: "Words a child hears at Mass in any country" },
      phrases: [
        { script: "Pax vobiscum", translit: "paks vo-BEES-koom", meaning: "Peace be with you" },
        { script: "Deo gratias", translit: "DEH-o GRAH-tsee-as", meaning: "Thanks be to God" },
        { script: "Sanctus", translit: "SANK-toos", meaning: "Holy" },
        { script: "Ave Maria", translit: "AH-veh ma-REE-ah", meaning: "Hail Mary" }
      ]
    },

    orthodox: {
      lang: "Greek, Church Slavonic and Coptic", dir: "ltr", langCode: "el",
      note: "Each Orthodox people prays in its own mother tongue, and many share the same ancient Greek phrases.",
      letters: { title: "Greek letters", dir: "ltr", items: ["Α α", "Β β", "Γ γ", "Δ δ"], caption: "Alpha, Beta, Gamma, Delta - learned in many Sunday schools" },
      phrases: [
        { script: "Κύριε ἐλέησον", translit: "Kyrie eleison", meaning: "Lord, have mercy" },
        { script: "Χριστὸς ἀνέστη", translit: "Christos anesti", meaning: "Christ is risen" },
        { script: "Ἀληθῶς ἀνέστη", translit: "Alithos anesti", meaning: "Truly he is risen" },
        { script: "Θεοτόκος", translit: "Theotokos", meaning: "The God-bearer, the Virgin Mary" }
      ]
    },

    muslim: {
      lang: "Arabic", dir: "rtl", langCode: "ar",
      note: "The Qur'an is recited in Arabic everywhere in the world, so children learn its letters early.",
      letters: { title: "First letters", dir: "rtl", items: ["ا", "ب", "ت", "ث"], caption: "Alif, Ba, Ta, Tha - Arabic is read from right to left" },
      phrases: [
        { script: "السلام عليكم", translit: "Assalamu alaikum", meaning: "Peace be upon you" },
        { script: "بسم الله", translit: "Bismillah", meaning: "In the name of Allah" },
        { script: "الحمد لله", translit: "Alhamdulillah", meaning: "Praise be to Allah" },
        { script: "شكرا", translit: "Shukran", meaning: "Thank you" }
      ]
    },

    hindu: {
      lang: "Sanskrit and Hindi", dir: "ltr", langCode: "hi",
      note: "Sanskrit carries the oldest prayers, and families speak Hindi, Gujarati, Tamil and many more.",
      letters: { title: "First letters", dir: "ltr", items: ["अ", "आ", "इ", "ई"], caption: "A, Aa, I, Ee - the Devanagari script" },
      phrases: [
        { script: "नमस्ते", translit: "Namaste", meaning: "I bow to the light in you" },
        { script: "धन्यवाद", translit: "Dhanyavaad", meaning: "Thank you" },
        { script: "शांति", translit: "Shanti", meaning: "Peace" },
        { script: "गुरु", translit: "Guru", meaning: "Teacher, one who brings light" }
      ]
    },

    sikh: {
      lang: "Punjabi in Gurmukhi script", dir: "ltr", langCode: "pa",
      note: "Gurbani is written in Gurmukhi, so learning the letters lets a child read the scripture themselves.",
      letters: { title: "First letters", dir: "ltr", items: ["ੳ", "ਅ", "ੲ", "ਸ"], caption: "Oorraa, Airraa, Eerree, Sassaa - the Gurmukhi script" },
      phrases: [
        { script: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", translit: "Sat Sri Akal", meaning: "Timeless truth is great" },
        { script: "ਧੰਨਵਾਦ", translit: "Dhanvaad", meaning: "Thank you" },
        { script: "ਸੇਵਾ", translit: "Seva", meaning: "Selfless service" },
        { script: "ਸੰਗਤ", translit: "Sangat", meaning: "The community gathered together" }
      ]
    },

    jewish: {
      lang: "Hebrew", dir: "rtl", langCode: "he",
      note: "Hebrew is the language of the Torah and of prayer, read from right to left.",
      letters: { title: "First letters", dir: "rtl", items: ["א", "ב", "ג", "ד"], caption: "Aleph, Bet, Gimel, Dalet - Hebrew is read from right to left" },
      phrases: [
        { script: "שָׁלוֹם", translit: "Shalom", meaning: "Peace, and also hello and goodbye" },
        { script: "תּוֹדָה", translit: "Todah", meaning: "Thank you" },
        { script: "שַׁבָּת שָׁלוֹם", translit: "Shabbat shalom", meaning: "A peaceful Sabbath to you" },
        { script: "מַזָּל טוֹב", translit: "Mazal tov", meaning: "Good fortune, congratulations" }
      ]
    },

    buddhist: {
      lang: "Pali, Sanskrit and Tibetan", dir: "ltr", langCode: "sa",
      note: "The Buddha's words were carried in Pali and Sanskrit, and today they are chanted in many languages.",
      letters: { title: "Words to know", dir: "ltr", items: ["Metta", "Dharma", "Sangha", "Karuna"], caption: "Loving kindness, the teaching, the community, compassion" },
      phrases: [
        { script: "नमो बुद्धाय", translit: "Namo Buddhaya", meaning: "Homage to the awakened one" },
        { script: "मेत्ता", translit: "Metta", meaning: "Loving kindness for every being" },
        { script: "करुणा", translit: "Karuna", meaning: "Compassion" },
        { script: "संघ", translit: "Sangha", meaning: "The community that walks together" }
      ]
    }
  };
})();
