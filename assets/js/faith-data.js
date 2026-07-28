/* =========================================================
   Saylavy - Faith path data
   One object per faith. Content, colours, symbols and the
   Q&A knowledge base the "Ask & listen" feature answers from.

   Sensitivity rules baked in (see Multi_Faith_Content_Framework):
   - The answering voice is always a warm TEACHER / guide, never
     God, a prophet, a deity or the Guru. "Your teachers approve
     every page."
   - Islam: audio-first, no music, no depiction of Allah / the
     Prophet / any prophet. Say "masjid".
   - Sikh & Judaism: God is formless, no depiction of God.
   - Hindu: sacred images (murti) are welcome; never the word "idol".
   - Buddhist: the Buddha is a teacher, not God; "pay respect", not
     "pray to". Statues are revered, not idols.
   - Orthodox: icons are "venerated", never "worshipped" or "idols".
   - No em dashes, no emoji anywhere in copy.
   ========================================================= */

/* --- Shared inline SVG symbols (monochrome, inherit currentColor) --- */
const SYM = {
  protestant: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.4 2h3.2v5.2H19v3.2h-5.4V22h-3.2V10.4H5V7.2h5.4z"/></svg>`,
  catholic: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 0 1 .5 1 1v3.8l3.6-.7c.5-.1 1 .3 1 .8v2.2c0 .5-.5.9-1 .8L13 9.4V21c0 .6-.4 1-1 1s-1-.4-1-1V9.4l-3.6.7c-.5.1-1-.3-1-.8V7.1c0-.5.5-.9 1-.8l3.6.7V3c0-.5.4-1 1-1z"/></svg>`,
  orthodox: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 2h2v2.3h3v2h-3v3.1h5v2h-5V21c0 .6-.4 1-1 1s-1-.4-1-1v-2.1l-3.4 1.5-.8-1.8L11 16.8v-5.4H6v-2h5V6.3H8v-2h3z"/></svg>`,
  muslim: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.6 3.2A9 9 0 1 0 21 15.4a7.2 7.2 0 1 1-5.4-12.2z"/><path d="M18.6 8.2l.9 1.9 2.1.3-1.5 1.5.35 2.1-1.85-1-1.85 1 .35-2.1L15.6 10.4l2.1-.3z"/></svg>`,
  hindu: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3c.9 1.7.9 3.4 0 5.1-.9-1.7-.9-3.4 0-5.1zM7.2 5.1c1.6.9 2.5 2.3 2.8 4.2-1.8-.6-3-1.8-3.6-3.6zM16.8 5.1c-.6 1.8-1.8 3-3.6 3.6.3-1.9 1.2-3.3 2.8-4.2zM12 9.2a4.8 4.8 0 0 1 4.8 4.8c0 2.9-2.4 5.2-4.8 6.9-2.4-1.7-4.8-4-4.8-6.9A4.8 4.8 0 0 1 12 9.2zm0 2.2a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z"/></svg>`,
  sikh: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c.5 0 .9.4.9.9v6.3a3.4 3.4 0 0 1 0 6.5V21c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-5.1a3.4 3.4 0 0 1 0-6.5V3.1c0-.5.4-.9.9-.9zm0 8.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/><path d="M6.4 7.2c1.4 1.1 2.1 2.7 2.1 4.8s-.7 3.7-2.1 4.8c.6-1.6.9-3.2.9-4.8s-.3-3.2-.9-4.8zM17.6 7.2c-.6 1.6-.9 3.2-.9 4.8s.3 3.2.9 4.8c-1.4-1.1-2.1-2.7-2.1-4.8s.7-3.7 2.1-4.8z"/></svg>`,
  jewish: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.6 4.5h-5.2zM12 21.5l-2.6-4.5h5.2zM4.2 7l5.2.05-2.55 4.45-2.6-4.5zm15.6 0l-2.6 4.5-2.55-4.45zM6.85 12.5L9.4 17H4.2zm10.3 0l2.65 4.5H14.6z"/><path d="M8.1 7h7.8l3.9 6.7-3.9 6.8H8.1L4.2 13.7z" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".55"/></svg>`,
  buddhist: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2.1a7.9 7.9 0 0 1 7.8 6.9h-3.3a4.6 4.6 0 0 0-3.5-3.5V4.2c-.3 0-.7 0-1 0zm-1 0v3.2A4.6 4.6 0 0 0 7.5 11H4.2A7.9 7.9 0 0 1 11 4.1zm2.5 2.9A4.6 4.6 0 0 0 12 7.4V4.2c.5 0 1 .1 1.5.2zM12 9.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zM4.2 13h3.3a4.6 4.6 0 0 0 3.5 3.5v3.3A7.9 7.9 0 0 1 4.2 13zm12.3 0h3.3a7.9 7.9 0 0 1-6.8 6.8v-3.3a4.6 4.6 0 0 0 3.5-3.5z"/></svg>`,
  bahai: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.54 5.77 4.89-3.43-3.43 4.89L20.77 10.7l-5.77 1.54 3.43 4.89-4.89-3.43L12 19.47l-1.54-5.77-4.89 3.43 3.43-4.89L3.23 10.7l5.77-1.54L5.57 4.27l4.89 3.43z"/></svg>`,
  jain: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="1.3"/><path d="M4.6 9c2.2-2.5 12.6-2.5 14.8 0-2-1.1-4.9-1.7-7.4-1.7S6.6 7.9 4.6 9z"/><circle cx="7.6" cy="14" r="1.4"/><circle cx="12" cy="14" r="1.4"/><circle cx="16.4" cy="14" r="1.4"/><path d="M6 18c1.6 2.4 3.6 3.6 6 3.6s4.4-1.2 6-3.6c-1.7 1.3-3.8 2-6 2s-4.3-.7-6-2z"/></svg>`,
  zoroastrian: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c-2 3-4 5-4 8.5 0 1.7 1 3 2.3 3.6-.3-1.5.4-2.7 1.5-3.6-.2 1.9.7 2.8.7 4.3 0 .9-.5 1.5-1.1 1.9 2.2-.5 3.4-2.2 3.4-4.5 0-1-.3-1.9-.9-2.7.1 1-.5 1.5-1 1.5-.9 0-1.1-.9-.8-1.8.6-2.2.5-4.3-.1-7.2z"/><path d="M12 22a5.5 5.5 0 0 1-5.5-5.5c0-.6.1-1.2.3-1.7.8 3.7 2.9 5.4 5.2 5.4s4.4-1.7 5.2-5.4c.2.5.3 1.1.3 1.7A5.5 5.5 0 0 1 12 22z" opacity=".45"/></svg>`,
  taoist: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 5 5 0 0 1 0-10 5 5 0 0 0 0-10z"/><circle cx="12" cy="7" r="1.5"/><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z" opacity=".55"/></svg>`
};

/* --- small icons reused by learn cards --- */
const ICO = {
  story: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z"/></svg>`,
  prayer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v7"/><path d="M8 21c0-3 1.5-5 4-6 2.5 1 4 3 4 6"/><path d="M9 8c0-2 1.3-3 3-3s3 1 3 3"/></svg>`,
  language: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h9"/><path d="M8 3c0 6-2 11-5 13"/><path d="M6 9c1.5 3 4 5 7 6"/><path d="M13 19l4-9 4 9"/><path d="M14.5 16h5"/></svg>`
};

const FAITHS = {

  protestant: {
    slug: "protestant", theme: "theme-protestant", accent: "#3563a8", shape: "mote",
    name: "Protestant", tradition: "Evangelical & Protestant Christian",
    symbol: SYM.protestant,
    place: "your church",
    hero: {
      kicker: "For your congregation",
      title: "Bible stories that stay with you",
      lead: "An interactive page where your community hears Scripture in real voices, listens to memory verses, and asks about the stories they are learning. Your leaders approve every word."
    },
    approve: "Every story and verse is reviewed by your pastors before it goes live.",
    guide: { name: "Miss Grace", role: "your Bible story guide", g: "f", avatar: "assets/img/avatars/protestant-guide.jpg" },
    greeting: "Hello. I am Miss Grace, your Bible story helper. Ask me about a Bible story, a memory verse, or what it means to follow Jesus.",
    learn: [
      { kind: "Bible story", icon: ICO.story, title: "David and Goliath", body: "A shepherd boy trusted God and faced a giant with just a sling and a stone. It teaches us that God gives courage to the small and the brave." },
      { kind: "Memory verse", icon: ICO.prayer, title: "John 3:16", original: "For God so loved the world that he gave his one and only Son.", body: "A verse to hear, repeat, and carry with you all week." },
      { kind: "The gospel", icon: ICO.language, title: "The good news", body: "Jesus died and rose again, and salvation is a free gift received by faith. Told simply and warmly." }
    ],
    suggest: ["Tell me a Bible story", "What is a memory verse?", "Who is Jesus?"],
    qa: [
      { keys: ["goliath", "david", "story", "tell me"], a: "David was a young shepherd who trusted God. With one stone and a sling he defeated the giant Goliath. It reminds us that God can use anyone who trusts him, no matter how small." },
      { keys: ["jesus", "who is"], a: "Christians believe Jesus is the Son of God who came to earth, loved people, died on the cross for our sins, and rose again. We follow him and try to live the way he taught." },
      { keys: ["memory verse", "verse", "john 3"], a: "A memory verse is a short line from the Bible we learn by heart. A favourite is John 3 verse 16: For God so loved the world that he gave his one and only Son. Say it with me." },
      { keys: ["pray", "prayer"], a: "Prayer is simply talking to God. You can thank him, say sorry, or ask for help. Jesus taught us the Lord's Prayer, which begins, Our Father in heaven, hallowed be your name." },
      { keys: ["bible"], a: "The Bible is God's word, a library of 66 books full of true stories, songs, and letters. It tells us who God is and how much he loves us." },
      { keys: ["easter", "cross", "rose"], a: "At Easter we remember that Jesus died on the cross and then rose from the dead three days later. It is the heart of the good news, that death is not the end." },
      { keys: ["noah", "ark"], a: "Noah trusted God and built a great ark. God kept Noah, his family, and the animals safe through the flood, and gave a rainbow as a promise of his care." }
    ],
    fallback: "That is a wonderful question to bring to your Sunday school teacher. What I love most is that God cares about every question you have. Would you like to hear a Bible story?"
  },

  catholic: {
    slug: "catholic", theme: "theme-catholic", accent: "#9b2d3c", shape: "mote",
    name: "Catholic", tradition: "Roman Catholic",
    symbol: SYM.catholic,
    place: "your parish",
    hero: {
      kicker: "For sacrament prep & faith formation",
      title: "Prayers, saints, and the Catechism, made to stick",
      lead: "An interactive page for First Communion and Confirmation prep, the prayers, and the lives of the saints. You listen, pray along, and ask questions. Reviewed by your parish first."
    },
    approve: "Every prayer, saint's story, and Catechism answer is reviewed by your parish before it goes live.",
    guide: { name: "Sister Clara", role: "your catechism guide", g: "f", avatar: "assets/img/avatars/catholic-guide.jpg" },
    greeting: "Peace be with you. I am Sister Clara, your catechism helper. Ask me about a prayer, a saint, the sacraments, or the Mass.",
    learn: [
      { kind: "Prayer", icon: ICO.prayer, title: "The Hail Mary", original: "Hail Mary, full of grace, the Lord is with thee.", body: "We ask the Blessed Mother to pray for us. A prayer learned early and kept for life." },
      { kind: "A saint", icon: ICO.story, title: "Saint Francis of Assisi", body: "A joyful saint who loved the poor and all of God's creatures. His life shows us how to live simply and kindly." },
      { kind: "Catechism", icon: ICO.language, title: "Who made me?", original: "God made me to know him, love him, and serve him.", body: "The Catechism in a simple question and answer you can hold onto." }
    ],
    suggest: ["Teach me the Hail Mary", "Tell me about a saint", "What is First Communion?"],
    qa: [
      { keys: ["hail mary", "mary", "our lady"], a: "The Hail Mary is a beautiful prayer. We honour the Blessed Virgin Mary and ask her to pray for us. It begins, Hail Mary, full of grace, the Lord is with thee. We do not worship Mary, we ask her to pray with us to God." },
      { keys: ["saint", "francis"], a: "Saints are holy friends of God who lived good lives and are now in heaven. Saint Francis of Assisi loved the poor and every creature. We ask the saints to pray for us." },
      { keys: ["first communion", "communion", "eucharist"], a: "First Communion is a very special day, a milestone when someone receives Jesus in the Eucharist for the first time. We prepare our hearts with prayer and confession." },
      { keys: ["confirmation"], a: "In Confirmation we receive the gifts of the Holy Spirit and become fuller members of the Church. It is a step of growing up in the faith." },
      { keys: ["rosary"], a: "The Rosary is a prayer we count on beads, remembering moments from the lives of Jesus and Mary. It is a gentle, peaceful way to pray." },
      { keys: ["mass"], a: "The Mass is the heart of Catholic worship, where we listen to God's word and receive Jesus in Holy Communion. We gather as one family of God." },
      { keys: ["our father", "lord's prayer"], a: "The Our Father is the prayer Jesus taught us. It begins, Our Father, who art in heaven, hallowed be thy name. It is the prayer of the whole Church." },
      { keys: ["god made", "who made"], a: "God made you to know him, to love him, and to serve him, and to be happy with him for ever in heaven. That is the very first answer in the Catechism." }
    ],
    fallback: "What a thoughtful question. Your parish catechist would love to walk through that with you. Remember, God made you to know him, love him, and serve him. Shall I teach you a prayer?"
  },

  orthodox: {
    slug: "orthodox", theme: "theme-orthodox", accent: "#b3852c", shape: "spark",
    name: "Orthodox", tradition: "Greek, Coptic & Orthodox Christian",
    symbol: SYM.orthodox,
    place: "your church",
    hero: {
      kicker: "For Sunday & language school",
      title: "The saints, the icons, and the faith of the fathers",
      lead: "An interactive page for the lives of the saints, the meaning of the holy icons, the feasts and fasts, and prayers in the language of your liturgy. Reviewed by your priest first."
    },
    approve: "Every icon, saint's life, and prayer is reviewed by your priest before it goes live.",
    guide: { name: "Kyria Sophia", role: "your Sunday school guide", g: "f", avatar: "assets/img/avatars/orthodox-guide.jpg" },
    greeting: "Blessings to you. I am Kyria Sophia, your Sunday school helper. Ask me about the saints, the holy icons, a feast day, or a prayer.",
    learn: [
      { kind: "The icons", icon: ICO.story, title: "Why we venerate icons", body: "An icon is a window to heaven. We venerate the holy image, honouring the person it shows, and through them we lift our hearts to God." },
      { kind: "The Theotokos", icon: ICO.prayer, title: "Mary, the God-bearer", original: "Most Holy Theotokos, save us.", body: "We honour the Virgin Mary, the Theotokos, and ask her prayers, as the Church has done since the beginning." },
      { kind: "Liturgical language", icon: ICO.language, title: "Kyrie eleison", original: "Kyrie eleison - Lord, have mercy.", body: "A prayer sung in the Divine Liturgy. You hear it and learn to pray in the mother tongue of the Church." }
    ],
    suggest: ["What is an icon?", "Who is the Theotokos?", "Tell me about a saint"],
    qa: [
      { keys: ["icon", "venerate"], a: "An icon is a holy image, a window to heaven. We venerate it, which means we honour the saint or the Lord it shows. We never worship the wood or paint. Through the image our hearts rise to God." },
      { keys: ["theotokos", "mary", "virgin"], a: "The Theotokos is the Virgin Mary, whose name means God-bearer, because she gave birth to Christ. We honour her deeply and ask her to pray for us." },
      { keys: ["saint", "george", "nicholas"], a: "The saints are holy men and women who loved God with their whole lives. We remember them, keep their feast days, and ask their prayers. Saint Nicholas, for example, was a kind bishop who cared for the poor." },
      { keys: ["liturgy", "divine liturgy"], a: "The Divine Liturgy is the great service of worship where the Church prays, sings, and receives Holy Communion. It is heaven on earth." },
      { keys: ["kyrie", "lord have mercy", "mercy"], a: "Kyrie eleison means Lord, have mercy. We sing it many times in the Liturgy. It is a short, humble prayer the whole Church shares." },
      { keys: ["fast", "feast", "pascha", "easter"], a: "The Church keeps feasts and fasts through the year. The greatest feast is Pascha, the Resurrection of Christ. We prepare for it with the fast of Great Lent." },
      { keys: ["coptic", "greek", "language"], a: "Many Orthodox churches teach the language of their people and their liturgy, like Greek or Coptic, so the community can pray the ancient prayers in the mother tongue." }
    ],
    fallback: "A good question to bring to your Sunday school teacher and your priest, who guard the faith with love. Would you like to hear about a saint or a holy icon?"
  },

  muslim: {
    slug: "muslim", theme: "theme-muslim", accent: "#1f7a5a", shape: "star8",
    name: "Muslim", tradition: "Islam - masjid & Islamic centre",
    symbol: SYM.muslim,
    place: "your masjid",
    hero: {
      kicker: "For madrasah & weekend school",
      title: "Qur'an, Arabic, and the manners of the Prophet",
      lead: "An interactive, audio-first page for Qur'an recitation, learning the Arabic letters, the stories of the Prophets, and the Five Pillars. Voice only, no music. Reviewed by your teachers first."
    },
    approve: "Every recitation, du'a, and lesson is reviewed by your teachers before it goes live. Audio-first, and no music.",
    guide: { name: "Ustadh Yusuf", role: "your Qur'an teacher", g: "m", avatar: "assets/img/avatars/muslim-guide.jpg" },
    greeting: "Assalamu alaikum. I am Ustadh Yusuf, your teacher. Ask me about the Qur'an, the Arabic letters, the Five Pillars, or a du'a.",
    learn: [
      { kind: "Qur'an", icon: ICO.prayer, title: "Surah Al-Fatihah", original: "Bismillah ir-Rahman ir-Rahim", body: "The opening of the Qur'an, recited in every prayer. You listen to the recitation and repeat it, letter by letter." },
      { kind: "Arabic letters", icon: ICO.language, title: "Alif, Ba, Ta", original: "ا  ب  ت", body: "The first Arabic letters, heard and traced, so you can begin to read the Qur'an in its own language." },
      { kind: "The Pillars", icon: ICO.story, title: "The Five Pillars", body: "Shahada, Salah, Zakat, Sawm, and Hajj. The five foundations of a Muslim's life, explained gently and clearly." }
    ],
    suggest: ["What are the Five Pillars?", "Teach me an Arabic letter", "What is a du'a?"],
    qa: [
      { keys: ["five pillars", "pillars"], a: "The Five Pillars are the foundations of Islam. Shahada, believing in one God, Allah, and that Muhammad, peace be upon him, is his Prophet. Salah, praying five times a day. Zakat, giving to those in need. Sawm, fasting in Ramadan. And Hajj, the pilgrimage to Makkah." },
      { keys: ["allah", "god"], a: "Muslims believe in one God, Allah, the Most Merciful, who created everything and cares for us. We turn to him alone in prayer." },
      { keys: ["quran", "qur'an", "koran"], a: "The Qur'an is the holy book of Islam, the words of Allah revealed to the Prophet Muhammad, peace be upon him. We learn to recite it beautifully, and many memorise it by heart." },
      { keys: ["muhammad", "prophet"], a: "The Prophet Muhammad, peace be upon him, is the final Prophet of Islam. He taught kindness, honesty, and good manners. We follow his example, called the Sunnah." },
      { keys: ["arabic", "letter", "alif"], a: "The Arabic letters begin with Alif, Ba, Ta. We learn to hear them and trace them, so we can one day read the Qur'an in its own language. Listen and repeat after me." },
      { keys: ["dua", "du'a", "supplication"], a: "A du'a is a heartfelt prayer, when we ask Allah for something or thank him. A simple one before eating is, Bismillah, which means, In the name of Allah." },
      { keys: ["ramadan", "fast", "sawm"], a: "Ramadan is the holy month when Muslims fast from dawn to sunset. It teaches patience, gratitude, and care for those who have less." },
      { keys: ["salah", "pray", "prayer"], a: "Salah is the prayer Muslims offer five times a day, facing Makkah. We begin by saying Allahu akbar, God is greatest, and it keeps our hearts close to Allah." }
    ],
    fallback: "A beautiful question, and one your teacher at the masjid would be glad to answer with you. Remember, Allah loves those who seek knowledge. Would you like to hear about the Five Pillars?"
  },

  hindu: {
    slug: "hindu", theme: "theme-hindu", accent: "#d9772a", shape: "petal",
    name: "Hindu", tradition: "Hindu - mandir",
    symbol: SYM.hindu,
    place: "your mandir",
    hero: {
      kicker: "For balvihar & language classes",
      title: "The stories, the shlokas, and the festivals of light",
      lead: "An interactive page for the great stories of the Ramayana and Gita, Sanskrit shlokas to hear and repeat, the festivals, and the values of dharma and ahimsa. Reviewed by your teachers first."
    },
    approve: "Every story, shloka, and lesson is reviewed by your teachers before it goes live.",
    guide: { name: "Guruji", role: "your shloka teacher", g: "m", avatar: "assets/img/avatars/hindu-guide.jpg" },
    greeting: "Namaste. I am Guruji, your teacher. Ask me about a story from the Ramayana, a shloka, a festival like Diwali, or the meaning of dharma.",
    learn: [
      { kind: "Story", icon: ICO.story, title: "Rama and the lamp of Diwali", body: "The story of Prince Rama's return home, welcomed with rows of lamps. It teaches that light and goodness always find their way home." },
      { kind: "Shloka", icon: ICO.prayer, title: "A shloka to begin", original: "Om Gan Ganapataye Namah", body: "A gentle Sanskrit verse honouring Ganesha, heard and repeated, so learning begins with a calm and focused heart." },
      { kind: "Values", icon: ICO.language, title: "Dharma and ahimsa", body: "Dharma means doing what is right and true. Ahimsa means kindness and never harming. Two values at the heart of a good life." }
    ],
    suggest: ["Tell me about Diwali", "Who is Ganesha?", "What is dharma?"],
    qa: [
      { keys: ["diwali", "lamp", "light", "festival"], a: "Diwali is the festival of lights. We remember Prince Rama returning home, welcomed by rows of little lamps called diyas. We light lamps to celebrate that goodness and light win over darkness." },
      { keys: ["ganesha", "ganesh"], a: "Ganesha is the beloved deity with the elephant head, honoured at the start of anything new because he clears away obstacles. We say, Om Gan Ganapataye Namah, to begin with a calm mind." },
      { keys: ["rama", "ramayana"], a: "The Ramayana tells the story of Prince Rama, his wife Sita, and the loyal Hanuman. It teaches courage, truth, and devotion. It is one of our greatest and most loved stories." },
      { keys: ["krishna", "gita"], a: "Krishna is a much loved deity, playful and full of joy, and wise as a teacher. In the Bhagavad Gita he teaches Arjuna to do his duty with a steady, devoted heart." },
      { keys: ["dharma"], a: "Dharma means living the right way, doing your duty with honesty and goodness. It is like following the true path that keeps the world in balance." },
      { keys: ["ahimsa", "kind", "harm"], a: "Ahimsa means non-harming, being gentle and kind to every living being. It is one of the most important values we can practise every day." },
      { keys: ["shloka", "om", "sanskrit"], a: "A shloka is a short sacred verse in Sanskrit. We hear it and repeat it together. Om is a sacred sound we chant to calm and focus the mind." },
      { keys: ["holi"], a: "Holi is the joyful festival of colours, welcoming spring. We celebrate with bright colours, music, and the story of good triumphing over harm." }
    ],
    fallback: "What a lovely question to explore with your teacher at the mandir. Our stories are full of wisdom for it. Would you like to hear about Diwali or a shloka?"
  },

  sikh: {
    slug: "sikh", theme: "theme-sikh", accent: "#35408f", shape: "spark",
    name: "Sikh", tradition: "Sikhi - gurdwara",
    symbol: SYM.sikh,
    place: "your gurdwara",
    hero: {
      kicker: "For Gurmat & Punjabi classes",
      title: "Gurbani, the Gurus, and the gift of seva",
      lead: "An interactive, audio-first page for Kirtan and Gurbani, learning Gurmukhi, the lives of the Ten Gurus, and Sikh values like seva and equality. Reviewed by your teachers first."
    },
    approve: "Every shabad, lesson, and story is reviewed by your teachers before it goes live.",
    guide: { name: "Bhai Sahib", role: "your Gurmat teacher", g: "m", avatar: "assets/img/avatars/sikh-guide.jpg" },
    greeting: "Sat Sri Akal. I am Bhai Sahib, your teacher. Ask me about the Gurus, Gurbani, learning Gurmukhi, or what seva means.",
    learn: [
      { kind: "The Gurus", icon: ICO.story, title: "Guru Nanak Dev Ji", body: "The first Guru, who taught that there is one God for everyone and that all people are equal. He walked far and wide sharing kindness and truth." },
      { kind: "Gurbani", icon: ICO.prayer, title: "Ik Onkar", original: "Ik Onkar - There is one God.", body: "The very first words of the Guru Granth Sahib. God is one and formless. You hear Kirtan and learn to sing along." },
      { kind: "Gurmukhi", icon: ICO.language, title: "Learning the letters", original: "Oorraa, Airraa, Eerree", body: "The Gurmukhi letters, heard and traced, so you can read Gurbani in its own script." }
    ],
    suggest: ["Who was Guru Nanak?", "What is seva?", "What does Ik Onkar mean?"],
    qa: [
      { keys: ["guru nanak", "nanak"], a: "Guru Nanak Dev Ji was the first of the ten Gurus and the founder of Sikhi. He taught that there is one God for all people, that everyone is equal, and that we should live honestly, share with others, and remember God." },
      { keys: ["ik onkar", "one god", "waheguru"], a: "Ik Onkar means there is one God, and God is formless, without shape or picture. We call God Waheguru, the wonderful teacher. These are the first words of our holy scripture." },
      { keys: ["seva", "service"], a: "Seva means selfless service, helping others without wanting anything back. In the gurdwara we cook and serve langar, a free meal for everyone, as an act of seva." },
      { keys: ["guru granth", "scripture", "gurbani"], a: "The Guru Granth Sahib is our living, eternal Guru, a holy book of sacred writings and hymns called Gurbani. We treat it with the greatest love and respect." },
      { keys: ["kirtan", "shabad", "music"], a: "Kirtan is the singing of Gurbani with music. When we listen to and sing the shabads, our hearts feel peaceful and close to Waheguru." },
      { keys: ["five k", "5 k", "kesh", "kara"], a: "The Five Ks are five articles of faith many Sikhs keep, like Kesh, uncut hair, and the Kara, a steel bracelet. Each one is a reminder to live with courage, honesty, and devotion." },
      { keys: ["gurmukhi", "punjabi", "letter"], a: "Gurmukhi is the script we read Gurbani in. The letters begin with Oorraa, Airraa, Eerree. We hear them and trace them so we can read our prayers ourselves." },
      { keys: ["equal", "equality"], a: "A most important Sikh teaching is that everyone is equal, no matter who they are. That is why in the gurdwara everyone sits together on the floor and shares the same langar." }
    ],
    fallback: "A wonderful question to ask your teacher at the gurdwara. Guru Nanak taught us to always keep learning. Would you like to hear about the Gurus or the meaning of seva?"
  },

  jewish: {
    slug: "jewish", theme: "theme-jewish", accent: "#2f7fb0", shape: "star6",
    name: "Jewish", tradition: "Judaism - synagogue & Hebrew school",
    symbol: SYM.jewish,
    place: "your synagogue",
    hero: {
      kicker: "For Hebrew school",
      title: "Torah, Hebrew, and the joy of the holidays",
      lead: "An interactive page for Hebrew reading, the Torah stories, the holidays, the core prayers, and values like tikkun olam. Reviewed by your teachers first."
    },
    approve: "Every prayer, story, and lesson is reviewed by your teachers before it goes live.",
    guide: { name: "Morah Rivka", role: "your Hebrew school guide", g: "f", avatar: "assets/img/avatars/jewish-guide.jpg" },
    greeting: "Shalom. I am Morah Rivka, your Hebrew school teacher. Ask me about a Torah story, a holiday, the Hebrew letters, or a prayer like the Shema.",
    learn: [
      { kind: "Torah story", icon: ICO.story, title: "Noah and the rainbow", body: "After the great flood, God set a rainbow in the sky as a sign of the promise to care for the world. A story of hope and new beginnings." },
      { kind: "Prayer", icon: ICO.prayer, title: "The Shema", original: "Shema Yisrael, Adonai Eloheinu, Adonai Echad", body: "Hear, O Israel, the Lord is our God, the Lord is One. The heart of Jewish prayer, taught to every generation." },
      { kind: "Hebrew letters", icon: ICO.language, title: "Aleph, Bet, Gimel", original: "א  ב  ג", body: "The first Hebrew letters, heard and traced, so you can read the Torah and the prayers." }
    ],
    suggest: ["What is the Shema?", "Tell me about a holiday", "Teach me a Hebrew letter"],
    qa: [
      { keys: ["shema"], a: "The Shema is the most important Jewish prayer. It says, Hear, O Israel, the Lord is our God, the Lord is One. We say it to remember that there is one God, and we cover our eyes to help us concentrate." },
      { keys: ["torah"], a: "The Torah is the holiest scroll in Judaism, the first five books, full of stories, teachings, and mitzvot, which are good deeds and commandments. We read from it in the synagogue with great care." },
      { keys: ["shabbat", "sabbath"], a: "Shabbat is our special day of rest each week, from Friday evening to Saturday night. We light candles, share a meal, and rest, remembering the gift of creation." },
      { keys: ["hanukkah", "chanukah", "holiday", "festival"], a: "Hanukkah is the festival of lights, lasting eight nights. We light the menorah, one more candle each night, remembering a small jar of oil that lasted far longer than anyone expected." },
      { keys: ["passover", "pesach"], a: "Passover, or Pesach, remembers when the Jewish people were freed from slavery in Egypt. We gather for a special meal called the seder and tell the story every year." },
      { keys: ["hebrew", "letter", "aleph"], a: "The Hebrew letters begin with Aleph, Bet, Gimel, and we read from right to left. We hear them and trace them so we can read the Torah and the prayers ourselves." },
      { keys: ["tikkun olam", "repair", "kind"], a: "Tikkun olam means repairing the world. It is the beautiful idea that each of us can make the world a little kinder and better through our good deeds." },
      { keys: ["god"], a: "In Judaism we believe in one God, who has no body and no picture. We do not make images of God. We show our love through prayer, learning, and doing good deeds." }
    ],
    fallback: "What a thoughtful question to bring to your Hebrew school teacher. Our tradition treasures good questions. Would you like to hear a Torah story or learn about a holiday?"
  },

  buddhist: {
    slug: "buddhist", theme: "theme-buddhist", accent: "#9a4f2b", shape: "petal",
    name: "Buddhist", tradition: "Buddhist - temple",
    symbol: SYM.buddhist,
    place: "your temple",
    hero: {
      kicker: "For dharma classes",
      title: "The Buddha's life, mindfulness, and kind hearts",
      lead: "An interactive page for the Buddha's life, the Jataka tales, gentle mindfulness, the Five Precepts, and loving kindness. Reviewed by your teachers first."
    },
    approve: "Every story, chant, and lesson is reviewed by your teachers before it goes live.",
    guide: { name: "Teacher Metta", role: "your Dharma guide", g: "f", avatar: "assets/img/avatars/buddhist-guide.jpg" },
    greeting: "A warm welcome to you. I am Teacher Metta, your Dharma helper. Ask me about the Buddha, a Jataka tale, mindful breathing, or loving kindness.",
    learn: [
      { kind: "The Buddha", icon: ICO.story, title: "The young prince who sought peace", body: "Prince Siddhartha left his palace to understand why people suffer, and became the Buddha, the awakened teacher. He showed a path to a calm and kind heart." },
      { kind: "Mindfulness", icon: ICO.prayer, title: "Breathing calm", original: "Breathing in, I am calm. Breathing out, I smile.", body: "A gentle practice you can do anywhere, to settle a busy mind and a worried heart." },
      { kind: "Values", icon: ICO.language, title: "Metta, loving kindness", body: "Metta means wishing happiness for every living being. May all beings be happy, may all beings be safe. Kindness we can grow like a garden." }
    ],
    suggest: ["Who was the Buddha?", "Teach me mindful breathing", "What is a Jataka tale?"],
    qa: [
      { keys: ["buddha", "siddhartha"], a: "The Buddha was a prince named Siddhartha who gave up his riches to understand why people suffer. When he found the answer, he became the Buddha, which means the awakened one. He was a wise teacher, and he showed us a path to a calm and kind heart." },
      { keys: ["mindful", "breathing", "meditat"], a: "Mindfulness is paying gentle attention to this very moment. Try this with me. Breathing in, I know I am breathing in. Breathing out, I smile. It helps a busy mind feel calm." },
      { keys: ["jataka", "tale", "story"], a: "The Jataka tales are gentle stories about the Buddha's earlier lives, often as an animal, that teach kindness, patience, and honesty. They are some of the oldest stories in the world." },
      { keys: ["metta", "loving kindness", "kind"], a: "Metta means loving kindness, wishing happiness for every living being. We quietly say, May all beings be happy, may all beings be safe. It grows a warm and caring heart." },
      { keys: ["precept", "five precept"], a: "The Five Precepts are gentle promises to live well. To be kind and not harm, to take only what is given, to be honest, to speak truthfully, and to keep a clear mind. They help us live in peace." },
      { keys: ["dharma", "dhamma", "teaching"], a: "The Dharma is the teaching of the Buddha, the truth he discovered about how to live with wisdom and kindness. We learn it, and we practise it in small ways every day." },
      { keys: ["sangha", "community"], a: "The Sangha is the community of people who follow the Buddha's teaching and support one another. Learning together makes the path easier and happier." },
      { keys: ["statue", "pray", "worship"], a: "When we bow before a statue of the Buddha, we are not worshipping it. We are showing respect and gratitude to a wise teacher, and reminding ourselves to grow calm and kind like him." }
    ],
    fallback: "What a mindful question to explore with your teacher at the temple. The Buddha welcomed every honest question. Would you like to try a moment of mindful breathing together?"
  },

  bahai: {
    slug: "bahai", theme: "theme-bahai", accent: "#3f8f6b", shape: "star",
    name: "Baháʼí", tradition: "Baháʼí Faith",
    symbol: SYM.bahai,
    place: "your Baháʼí community",
    hero: {
      kicker: "For your community",
      title: "One human family, one unfolding faith",
      lead: "An interactive page for the life of Baháʼu'lláh, the oneness of God and religion, and a life of prayer and service. Reviewed by your community first."
    },
    approve: "Every story, prayer, and lesson is reviewed by your community before it goes live.",
    guide: { name: "Roya", role: "your Baháʼí guide", g: "f", avatar: "assets/img/avatars/scholar.jpg" },
    greeting: "Alláh-u-Abhá, and a warm welcome. I am Roya, your Baháʼí helper. Ask me about Baháʼu'lláh, the oneness of humanity, prayer, or service.",
    learn: [
      { kind: "One God", icon: ICO.story, title: "Every religion, one source", body: "Baháʼís believe there is one God who has taught humanity again and again through messengers such as Abraham, Krishna, Moses, the Buddha, Jesus, Muhammad, and Baháʼu'lláh. Each brought guidance for their time." },
      { kind: "Prayer", icon: ICO.prayer, title: "A daily turning of the heart", body: "Baháʼís pray each day and read from the sacred writings morning and evening, turning the heart toward God and toward kindness in the world." },
      { kind: "Values", icon: ICO.language, title: "The oneness of humanity", body: "Baháʼu'lláh taught that the earth is one country and all people its citizens. Baháʼís work for unity, justice, and the equality of women and men." }
    ],
    suggest: ["Who was Baháʼu'lláh?", "What do Baháʼís believe?", "Why a nine-pointed star?"],
    qa: [
      { keys: ["bahaullah", "baha'u'llah", "founder", "who"], a: "Baháʼu'lláh, whose name means the Glory of God, was born in Persia in 1817. Baháʼís believe he was the messenger of God for our age, teaching the oneness of God, of religion, and of the whole human family. He spent much of his life in prison and exile for his teaching." },
      { keys: ["believe", "teach", "faith", "about"], a: "Baháʼís believe in one God, that all the great religions come from that one God, and that humanity is one family. We are taught to pray, to serve others, to seek truth for ourselves, and to work for unity and justice." },
      { keys: ["oneness", "unity", "humanity", "family"], a: "Baháʼu'lláh wrote that the earth is but one country, and mankind its citizens. Baháʼís believe every person, of every race and nation, is a member of one human family." },
      { keys: ["nine", "star", "symbol"], a: "The nine-pointed star is a symbol of the Baháʼí Faith. Nine is the highest single number, and it stands for completeness and the coming together of all the world's religions in one." },
      { keys: ["bab", "the bab", "herald"], a: "The Báb, which means the Gate, was a young messenger in Persia who prepared the way for Baháʼu'lláh, much as John the Baptist prepared the way for Jesus. His shrine with its golden dome stands on Mount Carmel." },
      { keys: ["abdul", "abdu'l-baha", "son"], a: "ʻAbdu'l-Bahá was the son of Baháʼu'lláh and the perfect example of his teaching. He travelled the world speaking of peace, kindness to the poor, and the unity of all people." },
      { keys: ["pray", "prayer", "worship", "temple"], a: "Baháʼís pray every day and gather in Houses of Worship, nine-sided temples open to people of every faith. There is no clergy, so the community learns and serves together." },
      { keys: ["service", "help", "work", "justice"], a: "Baháʼís believe that work done in the spirit of service to others is a form of worship. We are asked to care for our neighbours and to build unity and justice in the world." }
    ],
    fallback: "What a thoughtful question to explore with your community. Baháʼu'lláh welcomed the independent search for truth. Would you like to hear about the oneness of humanity, or about daily prayer?"
  },

  jain: {
    slug: "jain", theme: "theme-jain", accent: "#3a8a86", shape: "lotus",
    name: "Jain", tradition: "Jain - Jainism",
    symbol: SYM.jain,
    place: "your temple",
    hero: {
      kicker: "For your temple",
      title: "Non-violence, truth, and reverence for all life",
      lead: "An interactive page for the lives of the Tirthankaras, ahimsa toward every creature, and the many-sided nature of truth. Reviewed by your teachers first."
    },
    approve: "Every story and lesson is reviewed by your teachers before it goes live.",
    guide: { name: "Ahana", role: "your Jain guide", g: "f", avatar: "assets/img/avatars/scholar.jpg" },
    greeting: "Jai Jinendra, and a warm welcome. I am Ahana, your Jain helper. Ask me about Mahavira, ahimsa, the Tirthankaras, or reverence for all living beings.",
    learn: [
      { kind: "Ahimsa", icon: ICO.prayer, title: "Do no harm to any living being", body: "Ahimsa, non-violence, is the heart of Jain life. Jains take great care not to harm any creature, in action, in words, and even in thought, and many follow a vegetarian life." },
      { kind: "Mahavira", icon: ICO.story, title: "The great teacher", body: "Mahavira was the twenty-fourth and last Tirthankara, a great teacher who showed the path of non-violence, truth, and self-control more than 2500 years ago." },
      { kind: "Values", icon: ICO.language, title: "Anekantavada, many-sided truth", body: "Jains teach that truth has many sides, and no single view holds all of it. This gentle idea grows humility, respect, and peace between people who see differently." }
    ],
    suggest: ["Who was Mahavira?", "What is ahimsa?", "What is a Tirthankara?"],
    qa: [
      { keys: ["mahavira", "founder", "who"], a: "Mahavira, whose name means great hero, was the twenty-fourth Tirthankara. Born a prince in India about 2500 years ago, he gave up everything to seek truth, and taught the path of non-violence, truth, non-stealing, self-control, and non-attachment." },
      { keys: ["ahimsa", "non-violence", "harm", "violence"], a: "Ahimsa means non-violence, and it is the first and greatest teaching of the Jains. We try never to harm any living being, not by our hands, our words, or even our thoughts. This is why many Jains are careful vegetarians." },
      { keys: ["tirthankara", "teacher", "24", "twenty"], a: "A Tirthankara is a great soul who has crossed over the ocean of life and shows others the way. Jains honour twenty-four Tirthankaras, and Mahavira was the last of them for our age." },
      { keys: ["anekant", "many", "truth", "sides"], a: "Anekantavada means the many-sidedness of truth. Jains teach that reality has many sides, and each of us sees only a part. Like people touching different parts of an elephant, we should stay humble and listen to one another." },
      { keys: ["vegetarian", "food", "eat", "animal"], a: "Because Jains cherish every living being, most follow a vegetarian life, and some take even greater care to avoid harming the smallest creatures. It is love and respect for all life, put into practice at every meal." },
      { keys: ["parshva", "parshvanatha"], a: "Parshvanatha was the twenty-third Tirthankara, who lived before Mahavira and taught non-violence, truth, non-stealing, and non-possession. He is often shown with a canopy of serpent hoods above his head." },
      { keys: ["forgive", "michhami", "pardon"], a: "Jains have a beautiful custom called Michhami Dukkadam. Once a year, and whenever needed, we ask forgiveness of everyone for any harm we may have caused, and we forgive freely in return." },
      { keys: ["temple", "worship", "derasar", "pray"], a: "Jains gather in temples, sometimes called derasars, to honour the Tirthankaras and reflect on their example. We do not ask them for favours, but we remember their teaching and try to live by it." }
    ],
    fallback: "A thoughtful question to bring to your teacher at the temple. Jains treasure the gentle search for truth. Would you like to hear about ahimsa, or about the life of Mahavira?"
  },

  zoroastrian: {
    slug: "zoroastrian", theme: "theme-zoroastrian", accent: "#c2892e", shape: "flame",
    name: "Zoroastrian", tradition: "Zoroastrian - Parsi",
    symbol: SYM.zoroastrian,
    place: "your fire temple",
    hero: {
      kicker: "For your community",
      title: "Good thoughts, good words, good deeds",
      lead: "An interactive page for the teaching of Zarathustra, the sacred fire, and a life of goodness and honesty. Reviewed by your community first."
    },
    approve: "Every story and lesson is reviewed by your community before it goes live.",
    guide: { name: "Roshan", role: "your Zoroastrian guide", g: "f", avatar: "assets/img/avatars/scholar.jpg" },
    greeting: "Ushta te, and a warm welcome. I am Roshan, your Zoroastrian helper. Ask me about Zarathustra, the sacred fire, or living with good thoughts, good words, and good deeds.",
    learn: [
      { kind: "The threefold path", icon: ICO.prayer, title: "Good thoughts, good words, good deeds", body: "Humata, Hukhta, Huvarshta. The whole of Zoroastrian life can be held in three simple choices: to think well, to speak well, and to act well, every single day." },
      { kind: "Zarathustra", icon: ICO.story, title: "The prophet of one God", body: "Long ago in ancient Persia, the prophet Zarathustra taught that there is one wise God, Ahura Mazda, and that each person is free to choose between good and evil." },
      { kind: "The fire", icon: ICO.language, title: "Fire, a symbol of light", body: "Zoroastrians keep a sacred fire in the temple as a symbol of God's light, truth, and purity. They do not worship the fire, but turn toward its light as they pray." }
    ],
    suggest: ["Who was Zarathustra?", "Why the sacred fire?", "What do Zoroastrians believe?"],
    qa: [
      { keys: ["zarathustra", "zoroaster", "prophet", "founder", "who"], a: "Zarathustra, also called Zoroaster, was a prophet of ancient Persia who may have lived more than 3000 years ago. He taught that there is one wise Creator, Ahura Mazda, and that every person is free to choose between good and evil." },
      { keys: ["believe", "teach", "faith", "about"], a: "Zoroastrians believe in one God, Ahura Mazda, the Wise Lord, and in the free choice between good and evil. The whole of the faith is captured in three words: good thoughts, good words, and good deeds." },
      { keys: ["fire", "temple", "flame", "worship"], a: "Zoroastrians keep a sacred fire burning in the temple as a symbol of God's light, warmth, and truth. They do not worship the fire itself. They face its light as a reminder to keep their own hearts pure." },
      { keys: ["good thoughts", "good words", "good deeds", "humata", "threefold"], a: "Humata, Hukhta, Huvarshta: good thoughts, good words, good deeds. This is the golden thread of the Zoroastrian life. Choose a kind thought, a true word, and a helpful action, and you walk the good path." },
      { keys: ["ahura mazda", "god", "one god"], a: "Ahura Mazda means the Wise Lord. Zoroastrians believe in this one good and wise God, the Creator of all that is bright and true, who asks us to choose goodness freely." },
      { keys: ["cyrus", "great"], a: "Cyrus the Great was a Persian king remembered for his kindness and tolerance. He freed captive peoples and let them keep their own faiths. His famous cylinder is sometimes called an early charter of human rights." },
      { keys: ["parsi", "india", "persia"], a: "Long ago, many Zoroastrians left Persia and settled in India, where they became known as the Parsis. They kept their faith alive and gave much to the world through learning, industry, and generosity." },
      { keys: ["navjote", "sudreh", "kusti"], a: "When a Zoroastrian child is old enough, they receive a sacred shirt called the sudreh and a cord called the kusti in a ceremony called the navjote. From then on they tie the cord in prayer as a reminder to choose the good." }
    ],
    fallback: "A bright question to bring to your community. Zoroastrians treasure the free and honest search for truth. Would you like to hear about the sacred fire, or about good thoughts, good words, and good deeds?"
  },

  taoist: {
    slug: "taoist", theme: "theme-taoist", accent: "#4f7a9a", shape: "wave",
    name: "Taoist", tradition: "Taoist - Daoism",
    symbol: SYM.taoist,
    place: "your temple",
    hero: {
      kicker: "For your temple",
      title: "The Way of nature, balance, and ease",
      lead: "An interactive page for the wisdom of the Tao, the harmony of yin and yang, and living gently in step with nature. Reviewed by your teachers first."
    },
    approve: "Every story and lesson is reviewed by your teachers before it goes live.",
    guide: { name: "Lian", role: "your Taoist guide", g: "f", avatar: "assets/img/avatars/scholar.jpg" },
    greeting: "A gentle welcome to you. I am Lian, your Taoist helper. Ask me about the Tao, yin and yang, Laozi, or living in harmony with nature.",
    learn: [
      { kind: "The Tao", icon: ICO.story, title: "The Way that flows through all", body: "Tao means the Way, the natural flow that runs through everything. Taoists try to live simply and gently, in step with nature rather than against it." },
      { kind: "Wu wei", icon: ICO.prayer, title: "Effortless action, like water", body: "Wu wei means acting without forcing, like water that flows around a stone. The highest good is like water, which nourishes all things and does not struggle." },
      { kind: "Values", icon: ICO.language, title: "Yin and yang, gentle balance", body: "Day and night, rest and movement, stillness and change: yin and yang are the two sides that balance each other. A good life keeps them in gentle harmony." }
    ],
    suggest: ["Who was Laozi?", "What is the Tao?", "What is yin and yang?"],
    qa: [
      { keys: ["laozi", "lao tzu", "founder", "who"], a: "Laozi, whose name means the Old Master, is honoured as the founder of Taoism. He is said to have written the Tao Te Ching, a small book of deep wisdom about living simply and gently in harmony with the Way." },
      { keys: ["tao", "the way", "dao"], a: "Tao means the Way, the quiet natural flow that runs through all of nature and life. Taoists teach that when we stop struggling and move with the Way, like a leaf on a stream, life becomes calm and clear." },
      { keys: ["yin", "yang", "balance"], a: "Yin and yang are the two sides of everything: dark and light, rest and movement, soft and firm. They are not enemies but partners, each holding a little of the other, always turning into balance." },
      { keys: ["wu wei", "effort", "water", "force"], a: "Wu wei means effortless action, doing without forcing. Think of water, which is soft yet wears away stone, and flows around whatever stands in its way. The wise act like water, gentle and unhurried." },
      { keys: ["tao te ching", "book", "writing"], a: "The Tao Te Ching is a short and beautiful book of eighty-one small chapters, said to be written by Laozi. It teaches simplicity, humility, and living in harmony with the Way." },
      { keys: ["zhuangzi", "butterfly", "dream"], a: "Zhuangzi was a joyful Taoist teacher who loved stories. He once dreamed he was a butterfly, and woke wondering whether he was a man who had dreamed of a butterfly, or a butterfly now dreaming he was a man." },
      { keys: ["nature", "simple", "harmony"], a: "Taoists love nature and try to live simply and gently within it. Watching a river, a mountain, or a growing tree, we learn to be patient, humble, and at peace." },
      { keys: ["immortal", "temple", "worship", "sage"], a: "Taoists gather in peaceful temples and honour wise sages who lived in harmony with the Way. There we grow quiet, breathe slowly, and remember to live in balance." }
    ],
    fallback: "A gentle question to carry to your teacher at the temple. The Way welcomes a calm and curious heart. Would you like to hear about the Tao, or about yin and yang?"
  }

};

/* People live in faith-people.js (single source of truth). */

const FAITH_ORDER = ["protestant", "catholic", "orthodox", "muslim", "hindu", "sikh", "jewish", "buddhist", "bahai", "jain", "zoroastrian", "taoist"];


// Each faith automatically uses its hero video when the file exists
// in assets/video/ (protestant.mp4, catholic.mp4, ...). A missing file
// is harmless: the player stays invisible until the video loads.
FAITH_ORDER.forEach(function (k) { FAITHS[k].video = "assets/video/" + k + ".mp4"; });

/* Native-script greeting shown in each faith hero */
var FAITH_SCRIPTS = {
  "protestant": {
    "text": "Grace and peace to you",
    "translit": "",
    "meaning": "A greeting from the letters of Paul",
    "lang": "en",
    "dir": "ltr"
  },
  "catholic": {
    "text": "Pax vobiscum",
    "translit": "paks vo-BEES-koom",
    "meaning": "Peace be with you",
    "lang": "la",
    "dir": "ltr"
  },
  "orthodox": {
    "text": "Χριστὸς ἀνέστη",
    "translit": "Christos anesti",
    "meaning": "Christ is risen",
    "lang": "el",
    "dir": "ltr"
  },
  "muslim": {
    "text": "السلام عليكم",
    "translit": "Assalamu alaikum",
    "meaning": "Peace be upon you",
    "lang": "ar",
    "dir": "rtl"
  },
  "hindu": {
    "text": "नमस्ते",
    "translit": "Namaste",
    "meaning": "I bow to the light in you",
    "lang": "hi",
    "dir": "ltr"
  },
  "sikh": {
    "text": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    "translit": "Sat Sri Akal",
    "meaning": "Timeless truth is great",
    "lang": "pa",
    "dir": "ltr"
  },
  "jewish": {
    "text": "שָׁלוֹם עֲלֵיכֶם",
    "translit": "Shalom aleichem",
    "meaning": "Peace be upon you",
    "lang": "he",
    "dir": "rtl"
  },
  "buddhist": {
    "text": "नमो बुद्धाय",
    "translit": "Namo Buddhaya",
    "meaning": "Homage to the awakened one",
    "lang": "sa",
    "dir": "ltr"
  },
  "bahai": {
    "text": "Alláh-u-Abhá",
    "translit": "",
    "meaning": "God is the All-Glorious",
    "lang": "ar",
    "dir": "ltr"
  },
  "jain": {
    "text": "जय जिनेन्द्र",
    "translit": "Jai Jinendra",
    "meaning": "Honour to the victorious ones",
    "lang": "hi",
    "dir": "ltr"
  },
  "zoroastrian": {
    "text": "Ušta tē",
    "translit": "Ushta te",
    "meaning": "May light be upon you",
    "lang": "ae",
    "dir": "ltr"
  },
  "taoist": {
    "text": "上善若水",
    "translit": "Shàng shàn ruò shuǐ",
    "meaning": "The highest good is like water",
    "lang": "zh",
    "dir": "ltr"
  }
};
FAITH_ORDER.forEach(function (k) { FAITHS[k].script = FAITH_SCRIPTS[k]; });

if (typeof window !== "undefined") { window.FAITHS = FAITHS; window.FAITH_ORDER = FAITH_ORDER; }
