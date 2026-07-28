/* =========================================================
   Saylavy - Watch + interactive history learning for children
   Per faith: a tap-through journey in time, and
   a gentle quiz. All content follows the sensitivity framework
   and is replaceable by each community's teachers.
   ========================================================= */
(function () {
  "use strict";

  window.FAITH_LEARN = {

    protestant: {
      videos: [],
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
      videos: [],
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
      videos: [],
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
      videos: [],
      history: [
        { era: "600s", title: "The Qur'an is revealed", text: "In Makkah, the Prophet Muhammad, peace be upon him, received the words of the Qur'an from Allah." },
        { era: "Early days", title: "The message spreads", text: "People learned to pray, to share with the poor, and to live by the Five Pillars." },
        { era: "Golden age", title: "A time of learning", text: "In houses of learning from Baghdad to Bukhara, scholars like Al-Khwarizmi and Ibn Sina studied medicine, the stars, and numbers." },
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
      videos: [],
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
      videos: [],
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
      videos: [],
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
      videos: [],
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
    },

    bahai: {
      videos: [],
      history: [
        { era: "1844", title: "The Báb announces", text: "In Persia, a young messenger called the Báb announced that a great teacher of God was soon to come to unite humanity." },
        { era: "1817-1892", title: "Baháʼu'lláh", text: "Baháʼu'lláh taught the oneness of God, of religion, and of the whole human family, even through years of prison and exile." },
        { era: "Around the world", title: "ʻAbdu'l-Bahá travels", text: "His son ʻAbdu'l-Bahá journeyed far, speaking of peace, kindness to the poor, and the unity of all people." },
        { era: "Houses of Worship", title: "Nine-sided temples", text: "Baháʼís built beautiful nine-sided Houses of Worship, open to people of every faith to pray together." },
        { era: "Today", title: "One human family", text: "Baháʼís in every land work for unity, justice, and the equality of women and men, as one family." }
      ],
      quiz: [
        { q: "Baháʼu'lláh taught that humanity is...", options: ["many strangers", "one family", "always at war"], correct: 1 },
        { q: "The Baháʼí star has how many points?", options: ["Five", "Seven", "Nine"], correct: 2 },
        { q: "Baháʼí Houses of Worship are open to...", options: ["only Baháʼís", "people of every faith", "no visitors"], correct: 1 }
      ]
    },

    jain: {
      videos: [],
      history: [
        { era: "Long ago", title: "The Tirthankaras", text: "Great teachers called Tirthankaras showed the path of non-violence and truth, one after another through the ages." },
        { era: "About 2500 years ago", title: "Mahavira", text: "Born a prince, Mahavira gave up everything to seek truth, and taught ahimsa, non-violence toward every living being." },
        { era: "The five vows", title: "A gentle path", text: "Jains follow vows of non-violence, truth, non-stealing, self-control, and non-attachment." },
        { era: "Through time", title: "Temples and care for life", text: "Jains built beautiful temples and cared tenderly for every creature, even the smallest." },
        { era: "Today", title: "Ahimsa in daily life", text: "Jains around the world live gently, many as vegetarians, honouring the life in all beings." }
      ],
      quiz: [
        { q: "Ahimsa means...", options: ["non-violence", "loud singing", "fast running"], correct: 0 },
        { q: "Mahavira was the last...", options: ["king of Persia", "Tirthankara of this age", "Roman emperor"], correct: 1 },
        { q: "Many Jains follow a diet that is...", options: ["vegetarian", "meat only", "no vegetables"], correct: 0 }
      ]
    },

    zoroastrian: {
      videos: [],
      history: [
        { era: "Ancient Persia", title: "Zarathustra", text: "The prophet Zarathustra taught that there is one wise God, Ahura Mazda, and that we may freely choose good over evil." },
        { era: "The threefold path", title: "Good thoughts, words, deeds", text: "The whole faith is held in three choices: to think well, speak well, and act well, every day." },
        { era: "Great empires", title: "Kings of Persia", text: "Kings like Cyrus the Great ruled with tolerance, letting many peoples keep their own faiths." },
        { era: "A journey to India", title: "The Parsis", text: "Many Zoroastrians settled in India as the Parsis, keeping the sacred fire and their faith alive." },
        { era: "Today", title: "Keepers of the flame", text: "Zoroastrians tend the sacred fire and live by goodness, honesty, and care for the earth." }
      ],
      quiz: [
        { q: "The Zoroastrian golden rule is good thoughts, good words, and...", options: ["good deeds", "loud songs", "big houses"], correct: 0 },
        { q: "The sacred fire is a symbol of...", options: ["God's light", "anger", "winter"], correct: 0 },
        { q: "Zoroastrians in India are called...", options: ["Parsis", "Vikings", "Romans"], correct: 0 }
      ]
    },

    taoist: {
      videos: [],
      history: [
        { era: "Long ago", title: "Laozi and the Way", text: "The Old Master Laozi taught the Tao, the Way, and left behind the small, wise book called the Tao Te Ching." },
        { era: "Playful wisdom", title: "Zhuangzi's stories", text: "The joyful sage Zhuangzi taught freedom and ease through gentle tales, like his dream of the butterfly." },
        { era: "Yin and yang", title: "Gentle balance", text: "Taoists learned to keep life in balance, like day and night, rest and movement, soft and firm." },
        { era: "Through time", title: "Temples in the mountains", text: "Taoists built peaceful temples among mountains and streams, and honoured wise sages of the Way." },
        { era: "Today", title: "Living with nature", text: "People still practise the Tao, breathing slowly, living simply, and moving gently with nature." }
      ],
      quiz: [
        { q: "Tao means...", options: ["the Way", "a loud drum", "a tall tower"], correct: 0 },
        { q: "Wu wei is like...", options: ["forcing hard", "water flowing gently", "shouting"], correct: 1 },
        { q: "Yin and yang are...", options: ["enemies forever", "two sides in balance", "the same thing"], correct: 1 }
      ]
    }
  };
})();
