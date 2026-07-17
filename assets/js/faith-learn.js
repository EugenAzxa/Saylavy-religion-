/* =========================================================
   Saylavy - Watch + interactive history learning for children
   Per faith: curated BBC Teach "Religions of the World" videos
   (embedded from YouTube), a tap-through journey in time, and
   a gentle quiz. All content follows the sensitivity framework
   and is replaceable by each community's teachers.
   ========================================================= */
(function () {
  "use strict";

  window.FAITH_LEARN = {

    protestant: {
      videos: [{ list: "PLcvEcrsF_9zIQm-KPGujuZkNRk_jTcehV", title: "Religions of the World - animated stories for children (BBC Teach)" }],
      history: [
        { era: "Long ago", title: "Jesus teaches", text: "In Galilee, Jesus taught people to love God and to love their neighbour. Christians believe he died and rose again." },
        { era: "Early days", title: "The Bible is gathered", text: "The stories of Jesus and the letters of his friends were gathered into one great book, the Bible." },
        { era: "1517", title: "Martin Luther's questions", text: "A monk named Martin Luther asked big questions and wanted everyone to be able to read the Bible for themselves." },
        { era: "1500s", title: "The Bible for everyone", text: "With the new printing press, the Bible was printed in the languages people spoke at home." },
        { era: "Today", title: "Around the world", text: "Churches everywhere read the Bible, sing together, and share the good news of God's love." }
      ],
      quiz: [
        { q: "Who posted ninety-five big questions on a church door?", options: ["Martin Luther", "John Wesley", "A Roman emperor"], correct: 0 },
        { q: "What book do Christians love to read?", options: ["The dictionary", "The Bible", "A cookbook"], correct: 1 },
        { q: "John 3:16 says, For God so loved...", options: ["the mountains", "the sea", "the world"], correct: 2 }
      ]
    },

    catholic: {
      videos: [{ id: "p7cUuxh3CYY", title: "Orthodox and Roman Catholic Christianity (Religions of the World)" }],
      history: [
        { era: "Long ago", title: "Jesus and his friends", text: "Jesus chose special friends called apostles. Peter became a great leader of the early Church." },
        { era: "Early days", title: "The Church in Rome", text: "The followers of Jesus met, prayed, and shared everything, and the Church grew and grew." },
        { era: "Middle Ages", title: "Great cathedrals", text: "People built soaring cathedrals with coloured glass windows that told Bible stories in light." },
        { era: "1200s", title: "Saint Francis", text: "Francis of Assisi gave away his riches, cared for the poor, and called every creature his brother and sister." },
        { era: "Today", title: "A worldwide family", text: "More than a billion Catholics pray the Our Father, receive First Communion, and follow the Pope." }
      ],
      quiz: [
        { q: "Who leads the Catholic Church today?", options: ["The Pope", "A king", "A knight"], correct: 0 },
        { q: "Which saint loved the poor and the animals?", options: ["Saint Nicholas", "Saint Francis", "Saint George"], correct: 1 },
        { q: "Around age seven, Catholic children receive...", options: ["a driving licence", "a crown", "First Communion"], correct: 2 }
      ]
    },

    orthodox: {
      videos: [{ id: "p7cUuxh3CYY", title: "Orthodox and Roman Catholic Christianity (Religions of the World)" }],
      history: [
        { era: "Long ago", title: "The faith travels east", text: "The friends of Jesus carried his teaching to Greece, Egypt, and many lands of the east." },
        { era: "300s", title: "Great teachers", text: "Wise teachers like Basil and John Chrysostom shaped the beautiful prayers of the Divine Liturgy." },
        { era: "Early days", title: "Holy icons", text: "Painters made icons, holy images like windows to heaven, to help people pray." },
        { era: "Through time", title: "Many lands, one faith", text: "The Orthodox faith became home in Greece, Russia, Egypt, and far beyond, each in its own language." },
        { era: "Today", title: "The Liturgy still sung", text: "The same ancient prayers are sung every Sunday, and Pascha is the greatest feast of all." }
      ],
      quiz: [
        { q: "What is an icon?", options: ["A holy image, a window to heaven", "A kind of sweet", "A boat"], correct: 0 },
        { q: "The greatest Orthodox feast is...", options: ["a birthday", "Pascha", "the first day of school"], correct: 1 },
        { q: "Kyrie eleison means...", options: ["good morning", "thank you", "Lord, have mercy"], correct: 2 }
      ]
    },

    muslim: {
      videos: [{ id: "Qk0AR9mCRAA", title: "Islam (Religions of the World)" }],
      history: [
        { era: "600s", title: "The Qur'an is revealed", text: "In Makkah, the Prophet Muhammad, peace be upon him, received the words of the Qur'an from Allah." },
        { era: "Early days", title: "The message spreads", text: "People learned to pray, to share with the poor, and to live by the Five Pillars." },
        { era: "Golden age", title: "A time of learning", text: "In the House of Wisdom, scholars like Ibn Sina and Al-Khwarizmi studied medicine, stars, and numbers." },
        { era: "Through time", title: "Beautiful masjids", text: "Across the world, people built masjids with domes and minarets, filled with the sound of recitation." },
        { era: "Today", title: "One ummah", text: "Muslims everywhere pray five times a day, fast in Ramadan, and learn the Qur'an by heart." }
      ],
      quiz: [
        { q: "How many Pillars of Islam are there?", options: ["Five", "Two", "Ten"], correct: 0 },
        { q: "The holy book of Islam is...", options: ["a diary", "the Qur'an", "a storybook"], correct: 1 },
        { q: "The month of fasting is called...", options: ["December", "Springtime", "Ramadan"], correct: 2 }
      ]
    },

    hindu: {
      videos: [{ id: "uRpNNF4fB4g", title: "The Hindu Story of Rama and Sita (Religions of the World)" }],
      history: [
        { era: "Very long ago", title: "The ancient songs", text: "In India, wise songs called the Vedas were sung and remembered, generation after generation." },
        { era: "Long ago", title: "The great stories", text: "The Ramayana and the Mahabharata told of Rama, Sita, Hanuman, and the victory of good." },
        { era: "Long ago", title: "Krishna's teaching", text: "In the Bhagavad Gita, Krishna taught Arjuna to do his duty with a steady and devoted heart." },
        { era: "Through time", title: "Mandirs rise", text: "Beautiful temples were built, with sacred murtis, bells, lamps, and the smell of incense." },
        { era: "Today", title: "Festivals of joy", text: "Diwali lights the darkness and Holi splashes the world with colour, celebrated all over the earth." }
      ],
      quiz: [
        { q: "The festival of lights is called...", options: ["Diwali", "Halloween", "New Year"], correct: 0 },
        { q: "The prince of the Ramayana is...", options: ["Arjuna", "Rama", "a dragon"], correct: 1 },
        { q: "Ahimsa means...", options: ["running fast", "eating sweets", "kindness, never harming"], correct: 2 }
      ]
    },

    sikh: {
      videos: [{ id: "35O67FllIBs", title: "Sikhism - the story of Guru Nanak (Religions of the World)" }],
      history: [
        { era: "1469", title: "Guru Nanak is born", text: "Guru Nanak taught that there is one God for everyone and that all people are equal." },
        { era: "Early days", title: "Langar begins", text: "The Gurus opened a free kitchen, the langar, where everyone sits together and shares a meal." },
        { era: "Through time", title: "Ten Gurus", text: "Ten Gurus, one after another, guided the Sikh community with wisdom and courage." },
        { era: "1699", title: "The Khalsa", text: "Guru Gobind Singh gave the community the Khalsa, and later the Guru Granth Sahib became the eternal Guru." },
        { era: "Today", title: "Gurdwaras everywhere", text: "Around the world, gurdwaras ring with kirtan, and langar is served to all, always for free." }
      ],
      quiz: [
        { q: "Who was the first Sikh Guru?", options: ["Guru Nanak", "A king", "A sailor"], correct: 0 },
        { q: "What is langar?", options: ["a game", "a free meal for everyone", "a mountain"], correct: 1 },
        { q: "Ik Onkar means...", options: ["good night", "hurry up", "there is one God"], correct: 2 }
      ]
    },

    jewish: {
      videos: [
        { id: "nmjv4Zns4ME", title: "Judaism (Religions of the World)" },
        { id: "RdSQT7DS1lI", title: "The Jewish Story of Moses (Religions of the World)" }
      ],
      history: [
        { era: "Very long ago", title: "Avraham trusts God", text: "Avraham listened to one God and set out on a great journey of trust." },
        { era: "Long ago", title: "Out of Egypt", text: "Moses led the people from slavery to freedom, and received the Torah at Mount Sinai." },
        { era: "Long ago", title: "The Temple and beyond", text: "There was a great Temple in Jerusalem, and later synagogues grew in every land." },
        { era: "Through time", title: "Learning never stops", text: "Great teachers like Rashi and Maimonides helped every generation understand the Torah." },
        { era: "Today", title: "Shabbat and joy", text: "Every week families light Shabbat candles, and holidays like Hanukkah and Pesach fill the year." }
      ],
      quiz: [
        { q: "Who led the people out of Egypt?", options: ["Moses", "A pharaoh", "A giant"], correct: 0 },
        { q: "The weekly day of rest is...", options: ["Monday", "Shabbat", "sports day"], correct: 1 },
        { q: "The festival with eight nights of candles is...", options: ["a birthday", "summer camp", "Hanukkah"], correct: 2 }
      ]
    },

    buddhist: {
      videos: [{ id: "J-UwlloVveI", title: "The Buddhist Stories of Siddhartha and the Swan (Religions of the World)" }],
      history: [
        { era: "2500 years ago", title: "The prince leaves home", text: "Prince Siddhartha left his palace to understand why people suffer and how hearts find peace." },
        { era: "The awakening", title: "Under the Bodhi tree", text: "Sitting quietly under a great tree, he awakened and became the Buddha, the awakened one." },
        { era: "Long ago", title: "Teaching the Dharma", text: "The Buddha taught the way of wisdom, calm, and kindness to everyone who wished to listen." },
        { era: "Through time", title: "The teaching travels", text: "Across Asia, people built temples and pagodas, and told the gentle Jataka tales." },
        { era: "Today", title: "Mindfulness everywhere", text: "People all over the world breathe, smile, and practise loving kindness, just as he taught." }
      ],
      quiz: [
        { q: "What does Buddha mean?", options: ["The awakened one", "A strong king", "A fast runner"], correct: 0 },
        { q: "Under what tree did he awaken?", options: ["An apple tree", "The Bodhi tree", "A palm tree"], correct: 1 },
        { q: "Metta means...", options: ["being sleepy", "being loud", "loving kindness"], correct: 2 }
      ]
    }
  };
})();
