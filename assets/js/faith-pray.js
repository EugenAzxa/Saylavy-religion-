/* =========================================================
   Saylavy - how to pray, step by step

   A gentle, respectful walkthrough of prayer in each
   tradition, written for children and reviewed by the
   community's own teachers before it goes live.

   No depiction of God, prophets or sacred figures anywhere.
   Steps describe what a person does, never what God is.
   ========================================================= */
(function () {
  "use strict";

  window.FAITH_PRAY = {

    muslim: {
      title: "How we pray",
      intro: "Salah is prayed five times a day. Here is one unit, called a rakah, in simple steps. Your teachers will guide the details.",
      before: [
        "Make wudu, washing hands, mouth, nose, face, arms, head and feet.",
        "Find a clean place and a clean prayer mat.",
        "Face the qiblah, the direction of the Kaaba in Makkah."
      ],
      steps: [
        { n: "Niyyah", en: "Intention", text: "Stand quietly and intend in your heart which prayer you are about to offer." },
        { n: "Takbir", en: "Opening", text: "Raise your hands beside your ears and say Allahu akbar, God is greatest.", say: "الله أكبر", translit: "Allahu akbar" },
        { n: "Qiyam", en: "Standing", text: "Stand with hands folded and recite Surah Al-Fatihah, the opening of the Qur'an." },
        { n: "Ruku", en: "Bowing", text: "Bow with your back straight and hands on your knees, praising your Lord.", say: "سبحان ربي العظيم", translit: "Subhana rabbiyal adheem" },
        { n: "Qiyam", en: "Rising", text: "Rise again to standing, giving thanks." },
        { n: "Sujud", en: "Prostration", text: "Lower yourself so forehead, nose, palms, knees and toes touch the ground.", say: "سبحان ربي الأعلى", translit: "Subhana rabbiyal a'la" },
        { n: "Jalsa", en: "Sitting", text: "Sit calmly for a moment, then prostrate once more." },
        { n: "Tashahhud", en: "Testimony", text: "Sit and say the words of testimony at the end of the prayer." },
        { n: "Salam", en: "Peace", text: "Turn your face right and then left, giving peace to those beside you.", say: "السلام عليكم ورحمة الله", translit: "Assalamu alaikum wa rahmatullah" }
      ],
      note: "Times and details differ between communities. Your masjid's teachers set every word before this page goes live."
    },

    jewish: {
      title: "How we pray",
      intro: "Jewish prayer follows the day: morning, afternoon and evening. Here is how the Shema is said.",
      before: ["Wash your hands.", "Stand or sit quietly, facing Jerusalem if you can."],
      steps: [
        { n: "Kavanah", en: "Focus", text: "Pause and turn your attention toward God with intention." },
        { n: "Shema", en: "Hear", text: "Cover your eyes with your hand to concentrate, and say the Shema.", say: "שְׁמַע יִשְׂרָאֵל", translit: "Shema Yisrael" },
        { n: "V'ahavta", en: "And you shall love", text: "Continue with the words that follow, about loving God with all your heart." },
        { n: "Amidah", en: "Standing prayer", text: "Stand with feet together for the standing prayer, taking three small steps forward." },
        { n: "Aleinu", en: "Closing", text: "Close with the prayer of hope for the whole world." }
      ],
      note: "Customs differ between communities. Your teachers set every word before this page goes live."
    },

    hindu: {
      title: "How we pray",
      intro: "Puja is an offering of love. It can be done at a mandir or at a small shrine at home.",
      before: ["Bathe or wash your hands and feet.", "Light a lamp or a diya at the shrine."],
      steps: [
        { n: "Achamana", en: "Purify", text: "Sip a little water and settle your breath and your mind." },
        { n: "Dhyana", en: "Focus", text: "Sit calmly and bring your attention to the divine." },
        { n: "Avahana", en: "Welcome", text: "Welcome the divine presence as you would welcome an honoured guest." },
        { n: "Puja", en: "Offering", text: "Offer flowers, incense, a lamp and fruit with both hands." },
        { n: "Mantra", en: "Chant", text: "Chant a shloka you have learned, slowly and clearly.", say: "ॐ", translit: "Om" },
        { n: "Aarti", en: "Light", text: "Circle the lamp before the murti and sing together." },
        { n: "Prasad", en: "Sharing", text: "Share the blessed food with everyone present." }
      ],
      note: "Every family and mandir has its own beautiful way. Your teachers set every word before this page goes live."
    },

    sikh: {
      title: "How we pray",
      intro: "Sikhs remember God through Naam Simran and by listening to Gurbani in the gurdwara.",
      before: ["Wash your hands and feet.", "Cover your head.", "Remove your shoes before entering."],
      steps: [
        { n: "Matha tekna", en: "Bowing", text: "Bow before the Guru Granth Sahib as a sign of respect and humility." },
        { n: "Sangat", en: "Sitting together", text: "Sit on the floor with everyone, because all are equal here." },
        { n: "Simran", en: "Remembrance", text: "Repeat the name of God quietly in your heart.", say: "ਵਾਹਿਗੁਰੂ", translit: "Waheguru" },
        { n: "Kirtan", en: "Singing", text: "Listen to and join the singing of the shabads." },
        { n: "Ardas", en: "Prayer", text: "Stand together with hands folded for the community prayer." },
        { n: "Langar", en: "Sharing", text: "Share the free meal with everyone, sitting side by side." }
      ],
      note: "Your gurdwara's teachers set every word before this page goes live."
    },

    buddhist: {
      title: "How we practise",
      intro: "Buddhists pay respect to the Buddha as a teacher and practise calm and kindness.",
      before: ["Remove your shoes.", "Sit comfortably with a straight back."],
      steps: [
        { n: "Respect", en: "Bowing", text: "Bow three times before the image of the Buddha, honouring a wise teacher, not worshipping a statue." },
        { n: "Refuge", en: "Taking refuge", text: "Say the three refuges: the Buddha, the Dharma and the Sangha." },
        { n: "Precepts", en: "Promises", text: "Recall the gentle promises to be kind, honest and clear-minded." },
        { n: "Anapana", en: "Breathing", text: "Follow your breath in and out, without changing it.", say: "Breathing in, I am calm. Breathing out, I smile.", translit: "" },
        { n: "Metta", en: "Loving kindness", text: "Quietly wish happiness for yourself, for someone you love, and for all beings." },
        { n: "Dedication", en: "Sharing merit", text: "Wish that the good of your practice reaches everyone." }
      ],
      note: "Every tradition has its own form. Your teachers set every word before this page goes live."
    },

    catholic: {
      title: "How we pray",
      intro: "Catholics pray in many ways. Here is how to pray one decade of the Rosary.",
      before: ["Find a quiet place.", "Hold the rosary beads in your hand."],
      steps: [
        { n: "Sign of the Cross", en: "Beginning", text: "Touch forehead, chest, left shoulder and right shoulder." },
        { n: "Our Father", en: "The Lord's Prayer", text: "On the single bead, pray the Our Father, the prayer Jesus taught." },
        { n: "Hail Mary", en: "Ten times", text: "On each of the ten small beads, pray one Hail Mary." },
        { n: "Glory Be", en: "Praise", text: "Give glory to the Father, the Son and the Holy Spirit." },
        { n: "Mystery", en: "Remember", text: "Think about one moment from the life of Jesus and Mary as you pray." },
        { n: "Sign of the Cross", en: "Ending", text: "Close as you began, quietly and with peace." }
      ],
      note: "Your parish sets every word before this page goes live."
    },

    orthodox: {
      title: "How we pray",
      intro: "Orthodox Christians pray with the whole body, before the holy icons.",
      before: ["Stand before the icon corner.", "Light a candle or a lamp if you have one."],
      steps: [
        { n: "Sign of the Cross", en: "Beginning", text: "Join three fingers and touch forehead, chest, right shoulder, then left." },
        { n: "Trisagion", en: "Thrice-holy", text: "Say the ancient prayer to the Holy God three times." },
        { n: "Jesus Prayer", en: "Short prayer", text: "Repeat quietly and slowly, letting your heart follow.", say: "Κύριε ἐλέησον", translit: "Kyrie eleison, Lord have mercy" },
        { n: "Veneration", en: "Honouring", text: "Bow before the icon and kiss it, honouring the person it shows, never the wood or the paint." },
        { n: "Intercession", en: "Asking prayers", text: "Ask the Theotokos and the saints to pray with you." }
      ],
      note: "Your priest sets every word before this page goes live."
    },

    protestant: {
      title: "How we pray",
      intro: "Prayer is simply talking with God. Many Christians use a simple pattern to begin.",
      before: ["Find a quiet moment.", "You can close your eyes or keep them open."],
      steps: [
        { n: "Praise", en: "Adoration", text: "Begin by telling God what you love about him." },
        { n: "Sorry", en: "Confession", text: "Say sorry honestly for anything that is on your heart." },
        { n: "Thanks", en: "Thanksgiving", text: "Thank God for the good things in your day." },
        { n: "Please", en: "Supplication", text: "Ask for help, for yourself and for other people." },
        { n: "The Lord's Prayer", en: "Together", text: "Close with the prayer Jesus taught: Our Father in heaven, hallowed be your name." }
      ],
      note: "Your church sets every word before this page goes live."
    }
  };
})();
