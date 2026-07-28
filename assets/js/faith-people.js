/* =========================================================
   Saylavy - People of each faith (full personas)
   Loads AFTER faith-data.js and enriches FAITHS[x].people with
   a biography, a signature line, a voice, and a "speak with
   them" / "ask about them" chat.

   Sensitivity: persona "about" is used for the most revered
   founders (the Buddha, Moses, the Sikh Gurus) - a guide speaks
   ABOUT them in the third person, never impersonating them. The
   Prophet Muhammad is never given a persona. Everyone else
   speaks warmly in the first person.
   ========================================================= */
(function () {
  if (typeof FAITHS === "undefined") return;

  FAITHS.protestant.people = [
    { mono: "ML", name: "Martin Luther", tag: "Reformer, 1500s", note: "Began the Reformation and put the Bible into the language of the people.",
      voice: { g: "m", pitch: 0.9, rate: 0.92 },
      bio: "I was a monk in Germany who came to believe we are saved by God's grace through faith, not by our own works. In 1517 I nailed my questions to a church door and began the Reformation, and I translated the Bible so ordinary people could read it themselves.",
      quote: "Here I stand. I can do no other.",
      greeting: "Grace and peace to you. I am Martin Luther. Ask me about faith, the Bible, or the Reformation.",
      suggest: ["Why did you start the Reformation?", "What is grace?", "Why translate the Bible?"],
      qa: [
        { keys: ["reformation", "95", "door", "start", "began"], a: "I saw practices in the Church I could not accept, so I wrote ninety-five points for debate and posted them for all to see. I never meant to divide the Church, only to call it back to the gospel." },
        { keys: ["grace", "faith", "saved", "salvation", "works"], a: "This is the heart of it. We cannot earn God's love by our works. It is a free gift, received by faith. That truth set my conscience free." },
        { keys: ["bible", "translate", "german", "scripture", "read"], a: "I translated the Bible into German so a farmer and a child could read God's word for themselves, not only the scholars. God speaks to everyone." },
        { keys: ["here i stand", "afraid", "courage", "trial"], a: "When they ordered me to take back my words, I could not go against my conscience and Scripture. So I said, here I stand, I can do no other. God help me." }
      ],
      fallback: "A good question. I spent my life pointing away from myself and toward the grace of God. What would you like to know about that?" },
    { mono: "JW", name: "John Wesley", tag: "Preacher, 1700s", note: "Founded the Methodist movement and preached grace to the crowds.",
      voice: { g: "m", pitch: 0.96, rate: 0.95 },
      bio: "I was an English preacher in the 1700s. My heart was strangely warmed one evening, and I spent the rest of my life riding across the country on horseback, preaching God's grace to anyone who would listen, especially the poor.",
      quote: "Do all the good you can, in all the ways you can, as long as ever you can.",
      greeting: "Hello, friend. I am John Wesley. Ask me about preaching, grace, or doing good in the world.",
      suggest: ["What is your famous rule?", "Why preach outdoors?", "What warmed your heart?"],
      qa: [
        { keys: ["good", "rule", "all the good"], a: "I tried to live by a simple rule. Do all the good you can, by all the means you can, in all the ways you can, to all the people you can, as long as ever you can." },
        { keys: ["outdoor", "field", "preach", "horse", "travel"], a: "The churches would not always have me, so I preached in the fields and the marketplaces. I traveled many thousands of miles on horseback to reach people where they were." },
        { keys: ["heart", "warmed", "aldersgate", "change"], a: "One evening my heart was strangely warmed, and I felt I did trust in Christ alone for my salvation. That moment changed everything for me." },
        { keys: ["methodist", "method", "name"], a: "We were called Methodists because we were so methodical in prayer, study, and doing good. I did not mind the name at all." }
      ],
      fallback: "Well said. My life was about grace received and grace shared. What more would you like to ask?" },
    { mono: "CS", name: "C. S. Lewis", tag: "Writer, 1900s", note: "Explained the faith with clarity and imagination for a modern age.",
      voice: { g: "m", pitch: 0.92, rate: 0.97 },
      bio: "I was an Oxford scholar and writer. Once a stubborn atheist, I came to faith through reason and longing, and I spent my life explaining Christianity in plain words. I also wrote the Narnia stories, where a great Lion named Aslan mirrors Christ.",
      quote: "I believe in Christianity as I believe that the sun has risen.",
      greeting: "Hello. I am C. S. Lewis. Ask me about faith, reason, or the land of Narnia.",
      suggest: ["Who is Aslan?", "How did you find faith?", "Why do you believe?"],
      qa: [
        { keys: ["aslan", "narnia", "lion"], a: "Aslan is the great Lion of Narnia. He is not a tame lion, but he is good. Many readers see in him a picture of Christ, who lays down his life and rises again." },
        { keys: ["atheist", "found", "find", "convert", "believe how", "reluctant"], a: "I was a stubborn atheist, but reason and a deep longing led me, step by step, to God. I once called myself the most reluctant convert in all England." },
        { keys: ["why believe", "believe", "reason", "proof", "sun"], a: "I believe in Christianity as I believe the sun has risen. Not only because I see it, but because by it I see everything else." },
        { keys: ["joy", "longing", "desire"], a: "All my life I was chased by a deep longing I called Joy. In the end I found it was pointing me home, to God." }
      ],
      fallback: "A fine question. I always thought the deepest truths could be told simply. What would you like to explore?" },
    { mono: "BG", name: "Billy Graham", tag: "Evangelist, 1900s", note: "Shared the gospel with millions across the world.",
      voice: { g: "m", pitch: 0.93, rate: 0.95 },
      bio: "I was an American evangelist. For more than fifty years I preached the good news of Jesus to great crowds in stadiums around the world, and to presidents and ordinary people alike. My message was always simple: God loves you, and you can come home.",
      quote: "God loves you, and he will come into your life if you let him.",
      greeting: "Hello, and God bless you. I am Billy Graham. Ask me about the gospel, or about hope.",
      suggest: ["What is the gospel?", "What is your message?", "How do I find hope?"],
      qa: [
        { keys: ["gospel", "good news", "message", "preach"], a: "My message never changed. God loves you, Christ died for you, and if you turn to him you can be forgiven and made new. It is that simple, and that wonderful." },
        { keys: ["crowd", "stadium", "world", "million"], a: "I preached to millions in stadiums on every continent, but I was really speaking to one heart at a time. The gospel is always personal." },
        { keys: ["hope", "afraid", "death"], a: "My hope was never in this world. It was in Christ. Because he rose, I need not fear death, and neither do you." },
        { keys: ["president", "famous"], a: "I prayed with many presidents, but I tried to treat every person the same, because that is how God sees us." }
      ],
      fallback: "Thank you for asking. My whole life pointed to one thing, the love of God for you. What else is on your heart?" }
  ];

  FAITHS.catholic.people = [
    { mono: "FA", name: "St. Francis of Assisi", tag: "Saint, 1200s", note: "Loved the poor and all of creation, and lived the gospel simply.",
      voice: { g: "m", pitch: 0.96, rate: 0.93 },
      bio: "I was born to a rich family in Italy, but I gave it all up to follow Christ in poverty. I cared for the poor and the sick, preached peace, and loved every creature as my brother and sister.",
      quote: "Lord, make me an instrument of your peace.",
      greeting: "Peace and all good. I am Francis of Assisi. Ask me about poverty, peace, or God's creatures.",
      suggest: ["Why give up your wealth?", "What is your prayer for peace?", "Why love animals?"],
      qa: [
        { keys: ["wealth", "rich", "give up", "poverty", "money"], a: "I once loved fine things, but I found Christ was worth more than all of it. So I gave away my riches and married Lady Poverty, and I was never more free." },
        { keys: ["peace", "instrument", "prayer"], a: "I prayed, Lord, make me an instrument of your peace. Where there is hatred, let me sow love. That was the desire of my whole heart." },
        { keys: ["animal", "creature", "nature", "sun", "brother", "bird"], a: "All creation praises God. I called the sun my brother and the moon my sister, and I preached even to the birds. Every creature is a gift." },
        { keys: ["god", "christ", "follow", "simple"], a: "I tried to follow the footsteps of Christ, simply and joyfully, with nothing of my own. That was my only rule." }
      ],
      fallback: "God give you peace. I found joy in the smallest and poorest things. What would you like to ask?" },
    { mono: "AU", name: "St. Augustine", tag: "Doctor, 400s", note: "A great teacher of the Church whose writings still guide the faith.",
      voice: { g: "m", pitch: 0.9, rate: 0.92 },
      bio: "I was a restless young man in North Africa who chased pleasure and success, until my heart found rest in God. I became a bishop and a teacher, and my writings, like the Confessions, have guided the Church for over a thousand years.",
      quote: "You have made us for yourself, and our heart is restless until it rests in you.",
      greeting: "Peace be with you. I am Augustine. Ask me about my restless heart, or about God.",
      suggest: ["Why were you restless?", "How did you change?", "What did you write?"],
      qa: [
        { keys: ["restless", "heart", "rest", "happy"], a: "I searched for happiness in every wrong place. At last I understood. You have made us for yourself, O God, and our heart is restless until it rests in you." },
        { keys: ["change", "convert", "garden", "young", "read"], a: "In a garden I heard a child's voice say, take up and read. I opened the Scriptures, and my long wandering came to an end. God had been waiting for me all along." },
        { keys: ["confession", "write", "book"], a: "I wrote my Confessions as an honest prayer, telling God the whole story of my life, my sins, and his mercy. I hid nothing." },
        { keys: ["evil", "sin"], a: "I came to see that evil is not a thing God made, but a turning away from the good. Our healing is simply to turn back to him." }
      ],
      fallback: "A deep question. My whole life was a search that ended in God. What would you like to know?" },
    { mono: "MT", name: "Mother Teresa", tag: "Saint, 1900s", note: "Served the poorest of the poor with tireless love.",
      voice: { g: "f", pitch: 1.05, rate: 0.9 },
      bio: "I was a small nun who served the poorest of the poor in the streets of Calcutta. I gathered the dying, the sick, and the forgotten, and tried to show them they were loved. I believed we can do no great things, only small things with great love.",
      quote: "We can do no great things, only small things with great love.",
      greeting: "God bless you. I am Mother Teresa. Ask me about the poor, or about love.",
      suggest: ["How can I help others?", "Why serve the poor?", "What is love?"],
      qa: [
        { keys: ["small", "great love", "help", "how", "do"], a: "Not all of us can do great things. But we can do small things with great love. Begin where you are, with the person in front of you." },
        { keys: ["poor", "calcutta", "street", "dying", "sick"], a: "I saw Christ in every poor and dying person I met. To care for them was to care for him. No one should die feeling unwanted." },
        { keys: ["love", "lonely", "unwanted"], a: "The greatest poverty is not hunger, but to be unwanted and unloved. A kind word and a warm hand can be the greatest gift of all." },
        { keys: ["god", "pray", "faith"], a: "I began each day with prayer, for the work was God's, not mine. I was only a little pencil in his hand." }
      ],
      fallback: "God love you. Remember, do small things with great love. What else would you like to ask?" },
    { mono: "JP", name: "Pope John Paul II", tag: "Pope, 1900s", note: "Travelled the world as a shepherd of peace and hope.",
      voice: { g: "m", pitch: 0.92, rate: 0.93 },
      bio: "I was a young man in Poland under war and hard rule, and I became a priest, then a bishop, and then Pope. I traveled to more countries than any pope before me, calling the whole world to faith, freedom, and peace.",
      quote: "Be not afraid.",
      greeting: "Peace be with you. I am John Paul II. Ask me about courage, peace, or my travels.",
      suggest: ["Why say 'be not afraid'?", "Why travel so much?", "How did you forgive?"],
      qa: [
        { keys: ["afraid", "fear", "courage"], a: "I told the world, be not afraid. Open wide the doors to Christ. Fear closes the heart, but faith opens it wide." },
        { keys: ["travel", "country", "world", "visit"], a: "I visited more than a hundred countries, because the shepherd must go to the sheep. I wanted to look people in the eye and say, God loves you." },
        { keys: ["forgive", "shot", "attack", "prison"], a: "A man once shot me, and I nearly died. I went to his prison cell and forgave him, face to face. Mercy is stronger than hatred." },
        { keys: ["poland", "freedom", "communism", "war"], a: "I grew up under war and oppression, so I knew the price of freedom. I believed faith could help a people stand up without violence." }
      ],
      fallback: "Be not afraid. I gave my life to that message. What more would you like to ask?" }
  ];

  FAITHS.orthodox.people = [
    { mono: "JC", name: "St. John Chrysostom", tag: "Father, 300s", note: "The golden-mouthed preacher whose Divine Liturgy is still sung.",
      voice: { g: "m", pitch: 0.9, rate: 0.92 },
      bio: "I was a preacher in the early Church, so famous for my sermons that they called me Chrysostom, the golden-mouthed. I urged people to care for the poor and to live what they believed. The Divine Liturgy still sung in Orthodox churches carries my name.",
      quote: "The poor are the healers of your soul.",
      greeting: "Peace to you. I am John, called Chrysostom. Ask me about preaching, the poor, or the Liturgy.",
      suggest: ["Why care for the poor?", "Why 'golden-mouthed'?", "What is the Liturgy?"],
      qa: [
        { keys: ["poor", "charity", "give", "healer", "beggar"], a: "If you cannot find Christ in the beggar at the church door, you will not find him in the chalice. The poor are the healers of your soul." },
        { keys: ["golden", "preach", "sermon", "mouth"], a: "They called me golden-mouthed because the people loved to hear the word of God. But the gold was never mine, it was the truth I spoke." },
        { keys: ["liturgy", "worship", "service"], a: "In the Divine Liturgy heaven and earth meet. We give thanks, we hear the word, and we receive the holy gifts. It is the joy of the Church." },
        { keys: ["rich", "wealth"], a: "I told the rich plainly. What you hold in excess belongs to the poor. To share is not to give away what is yours, but to return what is theirs." }
      ],
      fallback: "Glory to God. I spoke plainly all my life. What would you like to ask?" },
    { mono: "BA", name: "St. Basil the Great", tag: "Father, 300s", note: "Shaped the faith and cared for the sick and the poor.",
      voice: { g: "m", pitch: 0.91, rate: 0.92 },
      bio: "I was a bishop in the early Church who loved both learning and the poor. I built one of the first hospitals and homes for the needy, a whole new city of mercy, and I helped shape the worship and teaching of the Church.",
      quote: "The bread you store up belongs to the hungry.",
      greeting: "Peace be with you. I am Basil. Ask me about mercy, learning, or the Church.",
      suggest: ["What did you build?", "Why help the poor?", "Why does learning matter?"],
      qa: [
        { keys: ["build", "hospital", "city", "home", "sick"], a: "Outside the city I built a place for the sick, the poor, and the stranger, with doctors and shelter. Some called it a new city. I called it simple mercy." },
        { keys: ["poor", "bread", "hungry", "share", "hoard"], a: "The bread you keep belongs to the hungry, and the coat in your closet to the one who has none. To hoard is to steal from the needy." },
        { keys: ["learning", "study", "greek", "wisdom", "young"], a: "I studied the best of Greek learning, and I taught the young to take what is good and true in it, like a bee gathering honey from many flowers." },
        { keys: ["church", "liturgy", "teach", "prayer"], a: "I helped order the prayers and the teaching of the Church, so the faith could be handed on whole and clear to those who came after." }
      ],
      fallback: "Glory to God. Faith and mercy always went together for me. What would you like to know?" },
    { mono: "SS", name: "St. Seraphim of Sarov", tag: "Monk, 1754-1833", note: "A gentle Russian saint known for his joy and deep prayer.",
      voice: { g: "m", pitch: 0.97, rate: 0.9 },
      bio: "I was a Russian monk who spent years alone in the forest in prayer. I came to know such joy in God that I greeted everyone with the words, my joy, Christ is risen. Even a wild bear was gentle with me.",
      quote: "Acquire a peaceful spirit, and thousands around you will be saved.",
      greeting: "My joy, welcome. I am Seraphim of Sarov. Ask me about prayer, joy, or peace.",
      suggest: ["What is your greeting?", "How do I find peace?", "Tell me about the bear."],
      qa: [
        { keys: ["joy", "greeting", "risen", "hello", "pascha"], a: "I greeted everyone as my joy, and often said, Christ is risen, no matter the season. When the heart is full of God, every day is Pascha." },
        { keys: ["peace", "peaceful", "spirit", "calm"], a: "Acquire a peaceful spirit, and thousands around you will be saved. Peace begins in one quiet heart and spreads to many." },
        { keys: ["bear", "animal", "forest"], a: "I lived long years alone in the forest in prayer. Even a great bear came to me gently and ate from my hand. At peace with God, we are at peace with all creation." },
        { keys: ["pray", "prayer", "jesus"], a: "I prayed the name of Jesus without ceasing. Lord Jesus Christ, have mercy on me. That short prayer warmed my whole life." }
      ],
      fallback: "My joy, God is good. Seek peace within, and much will follow. What would you like to ask?" },
    { mono: "NI", name: "St. Nicholas", tag: "Bishop, 300s", note: "A kind bishop remembered for his quiet generosity.",
      voice: { g: "m", pitch: 0.91, rate: 0.92 },
      bio: "I was a bishop in a town by the sea, known for my secret gifts to those in need. I once tossed gold through a poor family's window at night to save their daughters. Long after my time, the stories of my kindness gave the world Santa Claus.",
      quote: "Let the giver be hidden, so that God alone is thanked.",
      greeting: "Peace to you. I am Nicholas. Ask me about giving, kindness, or the stories about me.",
      suggest: ["Did you give gold in secret?", "Are you Santa Claus?", "Why give quietly?"],
      qa: [
        { keys: ["gold", "window", "secret", "dowry", "daughter"], a: "A poor man had no dowry for his daughters, so at night I threw gold through his window, three times, and slipped away. I did not want thanks. The joy was enough." },
        { keys: ["santa", "claus", "christmas"], a: "Long after my time, the stories of my gifts grew into the figure you call Santa Claus. I only ever wanted to give quietly, in the name of Christ." },
        { keys: ["quiet", "hidden", "why give"], a: "The best gift is given without being seen. Let the giver be hidden, so that God alone is thanked." },
        { keys: ["bishop", "sea", "sailor", "storm"], a: "I was a bishop in a town by the sea, and sailors prayed to God through me in their storms. I tried to be a friend to all in trouble." }
      ],
      fallback: "Peace and joy to you. Give quietly, and give with love. What would you like to ask?" }
  ];

  FAITHS.muslim.peopleNote = "Above all we honour the Prophet Muhammad, peace be upon him. Here are a few who walked his path.";
  FAITHS.muslim.people = [
    { mono: "RU", name: "Jalaluddin Rumi", tag: "Poet, 1200s", note: "A beloved poet whose verses turn the heart toward the divine.",
      voice: { g: "m", pitch: 0.96, rate: 0.9 },
      bio: "I was a scholar and poet in the 1200s. When I met a wandering mystic named Shams, my heart caught fire with the love of God, and poetry poured out of me. My verses still call people of every faith to look inward and to love.",
      quote: "The wound is the place where the light enters you.",
      greeting: "Peace be upon you, friend. I am Rumi. Ask me about love, the heart, or poetry.",
      suggest: ["What is love?", "Who was Shams?", "Why do you write poems?"],
      qa: [
        { keys: ["love", "heart", "beloved"], a: "Love is the bridge between you and everything. Do not seek it outside. The beloved you long for is already within, closer than your own breath." },
        { keys: ["shams", "friend", "teacher"], a: "Shams was a wandering soul who became my mirror. In his friendship I lost myself and found God. When he left, my grief became a river of poetry." },
        { keys: ["poem", "poetry", "write", "verse"], a: "I did not choose the poems. They came like water from a spring. I only tried to point beyond the words, to the One the words cannot hold." },
        { keys: ["wound", "broken", "pain", "light"], a: "Do not turn away from your wounds. The wound is the very place where the light enters you." }
      ],
      fallback: "Peace, my friend. Whatever you seek, seek it within. What would you like to ask?" },
    { mono: "IS", name: "Ibn Sina", tag: "Scholar, 1000s", note: "A great physician and thinker of the golden age of learning.",
      voice: { g: "m", pitch: 0.92, rate: 0.93 },
      bio: "I was a physician and philosopher in the golden age of Islam, a thousand years ago. I wrote a great book of medicine studied for centuries, and I tried to unite faith with reason and the knowledge of the world.",
      quote: "The mind is a gift from God, and to think clearly is a kind of worship.",
      greeting: "Peace be upon you. I am Ibn Sina. Ask me about medicine, learning, or the pursuit of knowledge.",
      suggest: ["What did you study?", "Why is knowledge important?", "How did you heal people?"],
      qa: [
        { keys: ["medicine", "heal", "doctor", "canon", "body"], a: "I gathered the medical knowledge of many lands into one great book, the Canon of Medicine. I taught that the body, the mind, and the soul must all be cared for together." },
        { keys: ["knowledge", "learn", "study", "science", "question"], a: "I could not stop asking questions. I believed that to seek knowledge is to honour the God who made an ordered and knowable world." },
        { keys: ["faith", "reason", "philosophy"], a: "I saw no war between faith and reason. The mind is a gift from God, and to think clearly is a kind of worship." },
        { keys: ["young", "memorize", "quran", "boy"], a: "As a boy I had memorised the Qur'an by the age of ten, and my thirst for learning never left me after that." }
      ],
      fallback: "Peace be upon you. Seek knowledge, and let it make you wiser and kinder. What would you like to ask?" },
    { mono: "KH", name: "Al-Khwarizmi", tag: "Scholar, 800s", note: "A pioneer of algebra whose name gave us the word algorithm.",
      voice: { g: "m", pitch: 0.93, rate: 0.94 },
      bio: "I was a mathematician in Baghdad, over a thousand years ago, in the great House of Wisdom. I wrote the first book on what we now call algebra, and my name, in a changed form, became the word algorithm.",
      quote: "In numbers there is order, and in order, a glimpse of the divine.",
      greeting: "Peace be upon you. I am Al-Khwarizmi. Ask me about numbers, algebra, or the House of Wisdom.",
      suggest: ["What is algebra?", "How is your name 'algorithm'?", "What was the House of Wisdom?"],
      qa: [
        { keys: ["algebra", "equation", "math", "balance"], a: "I wrote a book about balancing and restoring what is unknown in an equation. The Arabic word for restoring, al-jabr, became your word algebra." },
        { keys: ["algorithm", "name"], a: "When my name, Al-Khwarizmi, passed into Latin, it became algorithmi, and from there, algorithm. It still means a clear set of steps to solve a problem." },
        { keys: ["house of wisdom", "baghdad", "library", "translate"], a: "I worked in the House of Wisdom in Baghdad, where scholars of many faiths translated and shared the learning of the whole world. It was a wonder of its age." },
        { keys: ["number", "zero", "decimal"], a: "I helped spread the numerals and the idea of zero, which made calculation far easier for everyone who came after me." }
      ],
      fallback: "Peace be upon you. Even numbers can lead the mind toward wonder. What would you like to ask?" },
    { mono: "SA", name: "Salahuddin", tag: "Leader, 1100s", note: "Remembered across the world for his justice and his mercy.",
      voice: { g: "m", pitch: 0.9, rate: 0.93 },
      bio: "I was a leader and warrior in the 1100s, known in the West as Saladin. I united many lands, but I am remembered most for my mercy. Even to my enemies I showed kindness and kept my word, and I died with little wealth, for I had given it away.",
      quote: "Mercy is the finest ornament of the strong.",
      greeting: "Peace be upon you. I am Salahuddin. Ask me about leadership, mercy, or my life.",
      suggest: ["Why show mercy to enemies?", "What did you value?", "Why did you die poor?"],
      qa: [
        { keys: ["mercy", "enemy", "kind", "forgive"], a: "A ruler is tested not in victory but in how he treats the defeated. I chose mercy and kept my promises even to those who fought me. Strength without mercy is only cruelty." },
        { keys: ["poor", "wealth", "money", "die"], a: "When I died, there was scarcely enough in my treasury for my own burial, for I had given it to the poor and to my people. I carried nothing out of this world." },
        { keys: ["lead", "leader", "rule", "value", "justice", "servant"], a: "I tried to rule with justice and to listen to the humblest of my people. A leader is a servant of those he leads." },
        { keys: ["war", "battle", "jerusalem", "fight"], a: "There was war in my time, but even in it I sought to spare the innocent and to honour the word I had given. I take no pride in bloodshed." }
      ],
      fallback: "Peace be upon you. Remember, mercy is the strength of the strong. What would you like to ask?" }
  ];

  FAITHS.hindu.people = [
    { mono: "VI", name: "Swami Vivekananda", tag: "Teacher, 1800s", note: "Carried the wisdom of Vedanta to the world with courage and grace.",
      voice: { g: "m", pitch: 0.92, rate: 0.93 },
      bio: "I was a monk from Bengal who carried the wisdom of India to the world. In 1893 I stood in Chicago and greeted the world as sisters and brothers, calling all faiths to respect one another. I taught that serving people is serving the divine.",
      quote: "Arise, awake, and stop not until the goal is reached.",
      greeting: "Namaste, my friend. I am Vivekananda. Ask me about Vedanta, service, or courage.",
      suggest: ["What did you say in Chicago?", "How do I serve the divine?", "What is Vedanta?"],
      qa: [
        { keys: ["chicago", "speech", "sisters", "brothers", "world"], a: "In Chicago I began, sisters and brothers of America, and the hall rose in applause. I spoke of a faith that has taught the world both tolerance and the acceptance of all religions as true." },
        { keys: ["serve", "service", "help", "poor", "work"], a: "I taught that every soul is divine. To serve a hungry or suffering person is to worship God in living form. Work itself can be worship." },
        { keys: ["vedanta", "brahman", "divine", "reality"], a: "Vedanta teaches that one infinite reality shines through all things and all people. To know that, and to live it, is the goal of life." },
        { keys: ["arise", "awake", "courage", "strong", "weak"], a: "Arise, awake, and stop not until the goal is reached. Be strong. Weakness helps no one. Strength and fearlessness are the truest religion." }
      ],
      fallback: "Namaste. Remember, you are divine, so live like it. What would you like to ask?" },
    { mono: "SH", name: "Adi Shankara", tag: "Philosopher, 700s", note: "Renewed and united the tradition through his teaching.",
      voice: { g: "m", pitch: 0.9, rate: 0.9 },
      bio: "I was a philosopher who lived long ago and traveled all of India on foot, though I died young. I taught that the deepest self within you and the infinite reality, Brahman, are one, and I founded centres of learning that still stand.",
      quote: "The Self is one, ever the same, shining in all that lives.",
      greeting: "Namaste. I am Shankara. Ask me about the Self, Brahman, or the one reality.",
      suggest: ["Are we one with the divine?", "What is the Self?", "Why did you travel India?"],
      qa: [
        { keys: ["one", "brahman", "divine", "union", "sea"], a: "The deepest truth is that the Self within you, the Atman, is not separate from the infinite, Brahman. They are one. The many are like waves upon a single sea." },
        { keys: ["self", "atman", "who am i", "awareness"], a: "You are not only the body or the passing thoughts. Beneath them shines the changeless Self, pure awareness. Know that, and you are free." },
        { keys: ["travel", "india", "walk", "debate", "young"], a: "I walked the length of India, meeting sages and holding gentle debates, to renew the understanding of the scriptures. I lived only a short life, but a full one." },
        { keys: ["illusion", "maya", "world", "rope", "snake"], a: "The world as we grasp it is like a rope mistaken for a snake in the dusk. See clearly, and the fear falls away." }
      ],
      fallback: "Namaste. Look within, for the truth you seek is your own Self. What would you like to ask?" },
    { mono: "MI", name: "Mirabai", tag: "Poet-saint, 1500s", note: "A poet-saint whose songs of devotion are still sung today.",
      voice: { g: "f", pitch: 1.08, rate: 0.92 },
      bio: "I was a princess in Rajasthan who loved the Lord Krishna with all my heart. I left the comfort of the palace to sing and dance in devotion, though many opposed me. My songs of love for the divine are still sung across India today.",
      quote: "I have found my Lord, and my heart will not turn back.",
      greeting: "Radhe Radhe. I am Mira. Ask me about devotion, my songs, or my beloved Lord.",
      suggest: ["Why did you leave the palace?", "What is devotion?", "Tell me about your songs."],
      qa: [
        { keys: ["palace", "leave", "princess", "give up", "throne"], a: "I was born a princess, but my heart belonged to the Lord, not to the throne. I left the palace to sing his name in the streets and temples, and I was never sorry." },
        { keys: ["devotion", "bhakti", "love", "krishna", "lord"], a: "My path was bhakti, the way of love. I gave my whole heart to the Lord as a beloved, and in that love I found a joy no palace could give." },
        { keys: ["song", "sing", "dance", "music"], a: "I poured my love into songs, and I sang and danced without shame. The songs were my prayer, and through them my heart flew to the divine." },
        { keys: ["oppose", "suffer", "poison", "fear"], a: "Many tried to stop me, even to harm me, but nothing could turn my heart from my Lord. Love made me fearless." }
      ],
      fallback: "Radhe Radhe. Give your heart fully, and you will never be poor. What would you like to ask?" },
    { mono: "MG", name: "Mahatma Gandhi", tag: "Leader, 1900s", note: "Lived ahimsa, non-harming, and moved a nation with truth.",
      voice: { g: "m", pitch: 0.95, rate: 0.92 },
      bio: "I was born in India and helped lead my nation to freedom without a single weapon. I called my way satyagraha, holding to truth, rooted in ahimsa, non-harming. I drew on the wisdom of many faiths and tried to see God in the poorest person.",
      quote: "Be the change that you wish to see in the world.",
      greeting: "Namaste. I am Gandhi. Ask me about truth, non-violence, or serving others.",
      suggest: ["What is non-violence?", "What is satyagraha?", "How can I change the world?"],
      qa: [
        { keys: ["non-violence", "nonviolence", "ahimsa", "peace", "violence"], a: "Non-violence, ahimsa, is not weakness. It is the greatest strength. To meet hatred with love, and injustice with a steady, peaceful will, is the hardest and noblest path." },
        { keys: ["satyagraha", "truth", "freedom"], a: "Satyagraha means holding firmly to truth. We won our freedom not by harming others, but by refusing to cooperate with injustice, and by suffering rather than striking back." },
        { keys: ["change", "world", "how"], a: "You must be the change you wish to see in the world. Reform yourself first, and your life will speak louder than any words." },
        { keys: ["poor", "god", "faith", "religion"], a: "I found God among the poorest of the poor. I honoured all religions, for I believed they are different paths up the same mountain." }
      ],
      fallback: "Namaste. Hold to truth, and harm no one. What would you like to ask?" }
  ];

  FAITHS.sikh.people = [
    { mono: "GN", name: "Guru Nanak Dev Ji", tag: "First Guru", note: "Taught that there is one God for all and that everyone is equal.",
      persona: "about", voice: { g: "m", pitch: 0.95, rate: 0.93 },
      bio: "Guru Nanak Dev Ji was the first of the ten Sikh Gurus and the founder of the Sikh faith, born in 1469. He taught that there is one God for all people, that everyone is equal, and that we should work honestly, share with others, and remember God.",
      quote: "There is one God, and all people are equal before God.",
      greeting: "Welcome. I can tell you about Guru Nanak Dev Ji, the first Guru. What would you like to know about his life and teaching?",
      suggest: ["What did Guru Nanak teach?", "Did he travel?", "What is Ik Onkar?"],
      qa: [
        { keys: ["teach", "message", "one god", "equal", "honest"], a: "Guru Nanak taught that there is one God for everyone, and that all people are equal, whatever their faith, background, or gender. He summed up the good life as three things. Work honestly, share with others, and remember God." },
        { keys: ["travel", "journey", "udasi", "far"], a: "Guru Nanak made long journeys, called udasis, across India and beyond, to places of many faiths. Wherever he went, he spoke of the one God and of human equality." },
        { keys: ["ik onkar", "onkar", "god", "formless"], a: "The very first words Guru Nanak gave are Ik Onkar, there is one God, formless and beyond all images. This is the foundation of the whole Sikh scripture." },
        { keys: ["langar", "meal", "caste", "together"], a: "Guru Nanak began the practice of langar, a shared meal where everyone sits together as equals, to break down the barriers of caste and rank." }
      ],
      fallback: "Guru Nanak is deeply revered, and his teaching is one God and the equality of all people. What would you like to know about him?" },
    { mono: "GG", name: "Guru Gobind Singh Ji", tag: "Tenth Guru", note: "Gave the Khalsa its form, its courage, and its sense of justice.",
      persona: "about", voice: { g: "m", pitch: 0.93, rate: 0.93 },
      bio: "Guru Gobind Singh Ji was the tenth Sikh Guru, born in 1666. He gave the Sikh community, the Khalsa, its form and its values of courage, justice, and devotion. He was a poet and a protector of the oppressed, and he declared the holy scripture, the Guru Granth Sahib, as the eternal Guru after him.",
      quote: "Recognise the whole human race as one.",
      greeting: "Welcome. I can tell you about Guru Gobind Singh Ji, the tenth Guru. What would you like to know?",
      suggest: ["What is the Khalsa?", "What did he teach?", "What is the Guru Granth Sahib?"],
      qa: [
        { keys: ["khalsa", "five k", "found", "1699", "teach", "taught"], a: "In 1699 Guru Gobind Singh founded the Khalsa, a community committed to courage, equality, and devotion. He gave its members the articles of faith and the names of honour, Singh and Kaur." },
        { keys: ["justice", "protect", "oppress", "courage", "defend"], a: "Guru Gobind Singh stood up for the oppressed and taught that it is right to defend the weak and to resist injustice, while keeping God always in the heart." },
        { keys: ["guru granth", "scripture", "eternal", "book"], a: "Before he passed, Guru Gobind Singh declared that there would be no more human Gurus. The holy scripture, the Guru Granth Sahib, would be the eternal, living Guru for all time." },
        { keys: ["one", "humanity", "equal", "human race"], a: "He taught his followers to recognise the whole human race as one. Equality and human dignity are at the heart of his message." }
      ],
      fallback: "Guru Gobind Singh is deeply revered. He gave the Khalsa its courage and its commitment to justice. What would you like to know about him?" },
    { mono: "PS", name: "Bhagat Puran Singh", tag: "Servant, 1900s", note: "A tireless servant who cared for the sick and the abandoned.",
      voice: { g: "m", pitch: 0.95, rate: 0.92 },
      bio: "I was a Sikh who spent my life caring for the sick, the disabled, and the abandoned in Punjab. I once carried a helpless boy on my back for many years and never put him down. I founded a home called Pingalwara, a house for those no one else would help.",
      quote: "Service to the helpless is the truest worship.",
      greeting: "Sat Sri Akal. I am Puran Singh. Ask me about service, the helpless, or Pingalwara.",
      suggest: ["What is Pingalwara?", "Why serve the helpless?", "Tell me about the boy you carried."],
      qa: [
        { keys: ["pingalwara", "home", "found", "house"], a: "I founded Pingalwara, a home for the sick, the disabled, and the forgotten. I took in those whom no hospital and no family would keep. Everyone deserves care and dignity." },
        { keys: ["serve", "service", "seva", "help", "worship"], a: "My whole life was seva, service. I believed that to lift up a helpless person is the truest worship of God. Words are easy. It is the hands that must serve." },
        { keys: ["boy", "carry", "back", "piara"], a: "I found an abandoned boy who could not care for himself, and I carried him on my back for many years and never abandoned him. He taught me patience and love." },
        { keys: ["earth", "tree", "environment", "nature"], a: "I also cared for the earth, planting trees and warning people to protect nature, for it is a gift we hold in trust for those who come after." }
      ],
      fallback: "Sat Sri Akal. Serve the helpless, and you serve God. What would you like to ask?" },
    { mono: "RS", name: "Maharaja Ranjit Singh", tag: "Ruler, 1800s", note: "A just ruler remembered for his tolerance and his strength.",
      voice: { g: "m", pitch: 0.9, rate: 0.93 },
      bio: "I united the lands of Punjab into a strong kingdom in the 1800s and was known as the Lion of Punjab. Though I was a Sikh ruler, I welcomed people of every faith into my court and government, and I ruled with tolerance and without fear.",
      quote: "God intended me to look upon all religions with one eye.",
      greeting: "Sat Sri Akal. I am Ranjit Singh. Ask me about my kingdom, tolerance, or leadership.",
      suggest: ["How did you treat other faiths?", "What was your kingdom like?", "Why 'Lion of Punjab'?"],
      qa: [
        { keys: ["religion", "faith", "tolerance", "other", "hindu", "muslim"], a: "I was a Sikh, but I welcomed Hindus, Muslims, and people of every faith into my court and army. It was said God meant me to look upon all religions with one eye. My kingdom belonged to all its people." },
        { keys: ["kingdom", "punjab", "unite", "rule", "strong"], a: "I united the scattered lands of Punjab into one strong and prosperous kingdom, and I kept it free and independent in a difficult age." },
        { keys: ["lion", "brave", "battle", "eye", "courage"], a: "They called me the Lion of Punjab. I lost an eye to illness as a child, but never my courage. I led my people from the front." },
        { keys: ["justice", "poor", "fair", "death"], a: "I tried to rule with justice and rarely used the death penalty, even against my enemies. A ruler should be feared for his strength but loved for his fairness." }
      ],
      fallback: "Sat Sri Akal. Rule the heart with tolerance, and much good follows. What would you like to ask?" }
  ];

  FAITHS.jewish.people = [
    { mono: "MO", name: "Moshe (Moses)", tag: "Torah", note: "Led the people out of Egypt and received the Torah at Sinai.",
      persona: "about", voice: { g: "m", pitch: 0.9, rate: 0.92 },
      bio: "Moshe, or Moses, is the greatest prophet and teacher in Judaism. He led the people of Israel out of slavery in Egypt, crossed the sea, and received the Torah and the Ten Commandments at Mount Sinai. He guided the people for forty years through the wilderness.",
      quote: "Let my people go.",
      greeting: "Welcome. I can tell you about Moshe, Moses, the greatest of the prophets. What would you like to know?",
      suggest: ["What happened at the sea?", "What is the Torah?", "Who was Moses?"],
      qa: [
        { keys: ["egypt", "slavery", "pharaoh", "free", "let my people", "moses", "moshe", "who was"], a: "Moses was sent by God to Pharaoh with the demand, let my people go. After the ten plagues, he led the enslaved people of Israel out of Egypt to freedom, a story remembered every year at Passover." },
        { keys: ["sea", "red sea", "part", "water", "cross"], a: "As the people fled Egypt, the sea stood before them and Pharaoh's army behind. God, through Moses, parted the waters, and the people crossed on dry ground to safety." },
        { keys: ["torah", "sinai", "commandment", "law", "ten"], a: "At Mount Sinai, Moses received the Torah and the Ten Commandments from God, and gave them to the people. This is the foundation of Jewish life and law." },
        { keys: ["wilderness", "desert", "forty", "lead", "promised"], a: "Moses led the people for forty years through the wilderness toward the promised land, teaching them and pleading for them, though he himself did not enter it." }
      ],
      fallback: "Moshe is deeply revered. He led the people from slavery to the Torah. What would you like to know about him?" },
    { mono: "RM", name: "Maimonides", tag: "Sage, 1100s", note: "A physician and sage whose teachings still shape Jewish thought.",
      voice: { g: "m", pitch: 0.9, rate: 0.92 },
      bio: "I was a physician, philosopher, and rabbi in the 1100s, known as Rambam. I served as a doctor to a sultan by day and wrote by night. I organised all of Jewish law into one clear code and tried to show that faith and reason walk together.",
      quote: "The highest form of charity is to help someone become self-reliant.",
      greeting: "Shalom. I am Maimonides, called Rambam. Ask me about law, healing, charity, or faith and reason.",
      suggest: ["What is the highest charity?", "How do faith and reason meet?", "What did you write?"],
      qa: [
        { keys: ["charity", "tzedakah", "give", "help", "poor"], a: "I taught that there are levels of charity. The highest is not to give a handout, but to help a person become self-reliant, with a gift, a loan, or work, so they need charity no more." },
        { keys: ["reason", "philosophy", "faith", "science", "perplex"], a: "I saw no conflict between the Torah and reason. I wrote the Guide for the Perplexed for those torn between faith and philosophy, to show that truth is one." },
        { keys: ["law", "code", "mishneh", "write", "book"], a: "I gathered the whole of Jewish law, scattered across many books, into one clear and orderly code, so that anyone could find their way through it." },
        { keys: ["doctor", "medicine", "heal", "physician", "body"], a: "By day I served as a physician, even to the sultan's court. I wrote that caring for the body is part of serving God, for a healthy body helps a healthy soul." }
      ],
      fallback: "Shalom. Seek both wisdom and kindness, for they belong together. What would you like to ask?" },
    { mono: "RA", name: "Rashi", tag: "Commentator, 1000s", note: "The great commentator who opened the Torah for every generation.",
      voice: { g: "m", pitch: 0.93, rate: 0.92 },
      bio: "I was a rabbi in France in the 1000s, and I wrote the most beloved commentary on the Torah and the Talmud. I made the hard passages clear for everyone, from the scholar to the child. To this day, students open the text and read my notes beside it.",
      quote: "Explain the plain meaning first, so that every student can enter.",
      greeting: "Shalom. I am Rashi. Ask me about the Torah, my commentary, or how to study.",
      suggest: ["What is your commentary?", "How should I study?", "Why explain simply?"],
      qa: [
        { keys: ["commentary", "torah", "talmud", "explain", "note"], a: "I wrote notes beside the Torah and the Talmud to explain their plain meaning simply and clearly. My hope was that no student would be left in the dark before the holy text." },
        { keys: ["study", "learn", "how", "pshat"], a: "Begin with the plain meaning of the words. Understand what the text actually says before reaching for deeper meanings. A firm foundation carries everything." },
        { keys: ["simple", "clear", "child", "student", "everyone"], a: "I tried to write so that even a child could understand, for the Torah belongs to everyone, not only the learned. Clarity is a form of kindness." },
        { keys: ["france", "wine", "life", "vineyard"], a: "I lived a simple life in France and, it is said, tended vineyards. Learning was not my profession but my love, done for its own sake and for the people." }
      ],
      fallback: "Shalom. Study the plain meaning first, and the rest will open. What would you like to ask?" },
    { mono: "GM", name: "Golda Meir", tag: "Leader, 1900s", note: "A leader remembered for her courage and conviction.",
      voice: { g: "f", pitch: 1.0, rate: 0.92 },
      bio: "I grew up in poverty and became one of the first women to lead a nation as prime minister of Israel. I was known for plain speaking and steady courage, and people called me the Iron Lady long before that name was given to anyone else.",
      quote: "Trust yourself. Create the kind of self that you will be happy to live with.",
      greeting: "Shalom. I am Golda Meir. Ask me about leadership, courage, or my life.",
      suggest: ["How did you become a leader?", "What advice do you have?", "Was it hard as a woman?"],
      qa: [
        { keys: ["leader", "prime minister", "lead", "power"], a: "I never set out for power. I cared about my people and did the work in front of me, and one step led to the next, until I was asked to lead the nation. Duty, not ambition, carried me." },
        { keys: ["woman", "women", "hard", "female"], a: "I was one of the few women at the table, and some doubted me, but I did not waste time proving myself. I simply did the work, and let it speak." },
        { keys: ["advice", "courage", "yourself", "trust"], a: "Trust yourself. Create the kind of self that you will be happy to live with all your life. And do not be too humble. You are not that great, but neither is anyone else." },
        { keys: ["poor", "poverty", "young", "immigrant"], a: "I grew up poor and knew hunger and fear as a child. It taught me to work hard, to value security, and never to look down on anyone in need." }
      ],
      fallback: "Shalom. Trust yourself, and do the work in front of you. What would you like to ask?" }
  ];

  FAITHS.buddhist.people = [
    { mono: "BU", name: "The Buddha", tag: "The awakened teacher", note: "Showed the path to a calm and compassionate heart.",
      persona: "about", voice: { g: "m", pitch: 0.95, rate: 0.9 },
      bio: "The Buddha, born Prince Siddhartha, gave up a life of luxury to understand why people suffer. After long searching he awakened under a tree and became the Buddha, the awakened one. For the rest of his life he taught a path to peace, wisdom, and compassion. He is honoured as a teacher, not a god.",
      quote: "Hatred is never ended by hatred, but by love alone.",
      greeting: "Welcome. I can tell you about the Buddha, the awakened teacher. What would you like to know about his life and teaching?",
      suggest: ["Why did he leave the palace?", "What did he teach?", "What is the middle way?"],
      qa: [
        { keys: ["palace", "leave", "prince", "siddhartha", "suffer"], a: "Prince Siddhartha lived in comfort behind palace walls, but when he saw age, sickness, and death, he left everything to seek the cause of suffering and the way beyond it." },
        { keys: ["teach", "dharma", "four noble", "truth"], a: "The Buddha taught the Four Noble Truths. That life holds suffering, that suffering has a cause in craving, that it can end, and that a path leads to its ending. His way is one of wisdom, kindness, and calm." },
        { keys: ["middle way", "balance", "extreme"], a: "The Buddha taught the middle way, avoiding both harsh self-denial and empty pleasure. A balanced, mindful life opens the door to peace." },
        { keys: ["hatred", "love", "compassion", "metta", "anger"], a: "The Buddha taught that hatred is never ended by hatred, but by love alone. Compassion for all living beings is at the very heart of his path." }
      ],
      fallback: "The Buddha is deeply revered as a teacher. He showed a path to a calm and compassionate heart. What would you like to know about him?" },
    { mono: "AS", name: "Emperor Ashoka", tag: "Ruler, 200s BCE", note: "Turned from war to compassion and spread the Dharma widely.",
      voice: { g: "m", pitch: 0.92, rate: 0.93 },
      bio: "I was a mighty emperor of India who won a terrible war, but the suffering I caused broke my heart. I turned to the teaching of the Buddha, gave up violence, and spent the rest of my reign spreading compassion, planting trees, healing the sick, and carving my vows into stone.",
      quote: "All people are my children.",
      greeting: "Greetings. I am Ashoka. Ask me about my change of heart, compassion, or ruling with kindness.",
      suggest: ["Why did you give up war?", "What did you do as emperor?", "What are your edicts?"],
      qa: [
        { keys: ["war", "battle", "kalinga", "change", "give up"], a: "I won a great war at Kalinga, but when I saw the dead and the grieving, I was filled with sorrow. I vowed never again to conquer by the sword, but only by compassion and truth." },
        { keys: ["compassion", "kind", "people", "dharma", "children", "emperor", "as emperor", "did you do"], a: "After my change of heart I ruled by dharma, by goodness. I built shelters for people and animals, dug wells, planted shade trees, and told my officials to treat all my people as my own children." },
        { keys: ["edict", "stone", "pillar", "write"], a: "I had my vows and teachings carved onto great pillars and rocks across the land, so that all people, in every age, could read them. I wanted my regret and my hopes to be known." },
        { keys: ["animal", "tree", "environment", "well"], a: "I forbade needless killing of animals, planted trees along the roads, and cared for the health of both people and beasts, for compassion should leave no one out." }
      ],
      fallback: "Greetings. Power is best used for kindness, not conquest. What would you like to ask?" },
    { mono: "TN", name: "Thich Nhat Hanh", tag: "Monk, 1900s", note: "A gentle monk who taught mindfulness to the whole world.",
      voice: { g: "m", pitch: 0.98, rate: 0.88 },
      bio: "I was a Zen monk from Vietnam who taught mindfulness and peace to the whole world. Through war and exile, I kept teaching that we can find calm and joy in the present moment, with each breath and each step.",
      quote: "Breathing in, I calm my body. Breathing out, I smile.",
      greeting: "Hello, dear friend. I am Thich Nhat Hanh. Ask me about mindfulness, breathing, or peace.",
      suggest: ["How do I practise mindfulness?", "What is engaged Buddhism?", "How do I find peace?"],
      qa: [
        { keys: ["mindful", "mindfulness", "meditat", "present", "now", "tea"], a: "Mindfulness is simply being fully present for this moment. When you drink your tea, just drink your tea. Life is only available in the here and the now." },
        { keys: ["breath", "breathe", "breathing", "calm"], a: "Try this with me. Breathing in, I calm my body. Breathing out, I smile. Your breath is an anchor that brings you home to the present moment." },
        { keys: ["peace", "engaged", "war", "world"], a: "I taught engaged Buddhism, peace that is lived, not only meditated upon. If we cannot find peace in ourselves, we cannot bring it to the world. Peace begins with each step." },
        { keys: ["walk", "step", "walking"], a: "When you walk, walk as if you are kissing the earth with your feet. Peaceful steps make a peaceful path." }
      ],
      fallback: "Dear friend, breathe, and smile. This moment is a gift. What would you like to ask?" },
    { mono: "DL", name: "The Dalai Lama", tag: "Teacher, today", note: "A voice for compassion and kindness across the earth.",
      voice: { g: "m", pitch: 0.96, rate: 0.9 },
      bio: "I am a monk from Tibet and a teacher of compassion. Through hardship and exile, I have traveled the world with a simple message: my true religion is kindness. I believe the purpose of life is to be happy and to help others find happiness too.",
      quote: "My religion is very simple. My religion is kindness.",
      greeting: "Hello, my friend. I am the Dalai Lama. Ask me about compassion, happiness, or kindness.",
      suggest: ["What is your religion?", "How can I be happy?", "Why is compassion important?"],
      qa: [
        { keys: ["religion", "simple", "kind", "kindness", "temple"], a: "My religion is very simple. My religion is kindness. There is no need for grand temples or complicated philosophy. Our own heart, our own mind, is the temple." },
        { keys: ["happy", "happiness", "purpose", "joy"], a: "I believe the very purpose of our life is to seek happiness, and happiness grows most when we care for others. A warm heart is the true source of joy." },
        { keys: ["compassion", "others", "help", "care"], a: "If you want others to be happy, practise compassion. If you want to be happy, practise compassion. It is the one thing that helps both at once." },
        { keys: ["tibet", "exile", "anger", "enemy"], a: "I have lost my homeland and known hardship, yet I try not to hold anger, for anger poisons the one who carries it. Even a difficult person can be our teacher in patience." }
      ],
      fallback: "My friend, be kind, and you will be happy. What would you like to ask?" }
  ];

  FAITHS.bahai.people = [
    { mono: "BA", name: "Baháʼu'lláh", tag: "Founder of the Baháʼí Faith", note: "Taught the oneness of God, religion, and the whole human family.",
      persona: "about", voice: { g: "m", pitch: 0.9, rate: 0.9 },
      bio: "Baháʼu'lláh, whose name means the Glory of God, was born in Persia in 1817. Baháʼís believe he was the messenger of God for this age. He gave up wealth and comfort, and spent forty years in prison and exile, yet he wrote thousands of pages calling humanity to unity, justice, and peace.",
      quote: "The earth is but one country, and mankind its citizens.",
      greeting: "Welcome. I can tell you about Baháʼu'lláh and his teaching of the oneness of humanity. What would you like to know?",
      suggest: ["What did Baháʼu'lláh teach?", "Why was he imprisoned?", "What is the oneness of humanity?"],
      qa: [
        { keys: ["teach", "message", "oneness", "unity"], a: "Baháʼu'lláh taught three great truths: that God is one, that all religions come from that one God, and that humanity is one family. He called every person to work for unity, justice, and peace." },
        { keys: ["prison", "exile", "suffer", "persia"], a: "Because his teaching challenged the powerful, Baháʼu'lláh was stripped of his wealth and sent from prison to prison across the empire. Through it all he never returned harm, and kept writing of love and unity." },
        { keys: ["earth", "country", "citizen", "world"], a: "He wrote that the earth is but one country, and mankind its citizens. Baháʼís hold this close: that we belong to one another across every border and race." }
      ],
      fallback: "Baháʼu'lláh is deeply revered as the founder of the Baháʼí Faith. He taught the oneness of all people. What would you like to know about him?" },
    { mono: "BB", name: "The Báb", tag: "The Herald, 1800s", note: "Prepared the way for Baháʼu'lláh in nineteenth-century Persia.",
      persona: "about", voice: { g: "m", pitch: 0.95, rate: 0.92 },
      bio: "The Báb, whose title means the Gate, was a young merchant in Persia who in 1844 announced that a great messenger of God was soon to come. He taught renewal and hope, gathered many followers, and gave his life for his message at just thirty years of age. His golden-domed shrine stands on Mount Carmel.",
      quote: "Ye are the fruits of one tree, and the leaves of one branch.",
      greeting: "Welcome. I can tell you about the Báb, who prepared the way for Baháʼu'lláh. What would you like to know?",
      suggest: ["Who was the Báb?", "What does the Gate mean?", "Where is his shrine?"],
      qa: [
        { keys: ["herald", "prepare", "gate", "way"], a: "The Báb prepared the way for Baháʼu'lláh, much as John the Baptist prepared the way for Jesus. He announced that a new messenger of God was about to appear to unite humanity." },
        { keys: ["young", "life", "give", "martyr"], a: "The Báb was young, and his message of renewal stirred great hope and great opposition. He gave his life for it at thirty, but his followers carried his message forward." },
        { keys: ["shrine", "carmel", "haifa", "dome"], a: "The Shrine of the Báb, with its shining golden dome and beautiful terraced gardens, rises on Mount Carmel in Haifa. It is one of the most sacred places for Baháʼís." }
      ],
      fallback: "The Báb is honoured as the herald of the Baháʼí Faith. He prepared the way with a message of hope. What would you like to know about him?" },
    { mono: "AB", name: "ʻAbdu'l-Bahá", tag: "The Exemplar, 1844-1921", note: "The perfect example of his father's teaching, and a servant of all.",
      persona: "about", voice: { g: "m", pitch: 0.92, rate: 0.93 },
      bio: "ʻAbdu'l-Bahá was the eldest son of Baháʼu'lláh and, Baháʼís believe, the perfect example of how to live his teaching. He shared his father's imprisonment, cared for the poor and the sick, and in old age travelled across Europe and America speaking of peace and the unity of humanity.",
      quote: "Let your heart burn with loving kindness for all who may cross your path.",
      greeting: "Welcome. I can tell you about ʻAbdu'l-Bahá, the example of the Baháʼí life. What would you like to know?",
      suggest: ["Who was ʻAbdu'l-Bahá?", "What did he do for the poor?", "Why did he travel?"],
      qa: [
        { keys: ["son", "example", "exemplar", "who"], a: "ʻAbdu'l-Bahá was the son of Baháʼu'lláh and the living example of his teaching. Baháʼís look to his life to see what love, humility, and service truly mean." },
        { keys: ["poor", "sick", "kind", "serve"], a: "He was known simply as the Master, and he cared tenderly for the poor and the sick, often giving away what little he had. Service to others was the joy of his life." },
        { keys: ["travel", "peace", "america", "europe"], a: "In his later years he journeyed across Europe and North America, speaking in churches, synagogues, and halls about peace, justice, and the oneness of all people." }
      ],
      fallback: "ʻAbdu'l-Bahá is loved as the perfect example of the Baháʼí life, a servant of all. What would you like to know about him?" },
    { mono: "TA", name: "Táhirih", tag: "Poet and reformer, 1800s", note: "A brilliant poet who called for the dignity of women.",
      voice: { g: "f", pitch: 1.06, rate: 0.98 },
      bio: "I was a poet and scholar in Persia, and one of the first followers of the Báb. I believed a new day had dawned for humanity, and that women too were meant to be free and learned. I spoke and wrote boldly, and gave my life for my faith.",
      quote: "You can kill me as soon as you like, but you cannot stop the emancipation of women.",
      greeting: "Peace to you. I am Táhirih, a poet of the new day. Ask me about my poems, my faith, or the dignity of women.",
      suggest: ["Why is your story remembered?", "What did you write?", "Why speak for women?"],
      qa: [
        { keys: ["woman", "women", "free", "equal", "dignity"], a: "I believed that women are the equals of men in the sight of God, made for learning and for freedom. I said they could kill me, but they could not stop the emancipation of women." },
        { keys: ["poet", "poem", "write", "scholar"], a: "I loved words and learning from a young age, and I wrote poems of longing and hope that are still read today. Poetry was the way my heart spoke of God." },
        { keys: ["bab", "faith", "believe", "new day"], a: "I was among the first to follow the Báb, believing that a new dawn had come for the world. My faith gave me courage I never knew I had." }
      ],
      fallback: "A fine question. I gave my life for my faith and for the dignity of women. What more would you like to ask?" }
  ];

  FAITHS.jain.people = [
    { mono: "MA", name: "Mahavira", tag: "The 24th Tirthankara", note: "The great teacher of non-violence, truth, and self-control.",
      persona: "about", voice: { g: "m", pitch: 0.9, rate: 0.9 },
      bio: "Mahavira, whose name means great hero, was the twenty-fourth and last Tirthankara of this age. Born a prince in India about 2500 years ago, he left his palace at thirty to seek truth, and after long meditation taught the path of ahimsa, non-violence, truth, non-stealing, self-control, and non-attachment.",
      quote: "Non-violence is the highest religion.",
      greeting: "Welcome. I can tell you about Mahavira, the great teacher of non-violence. What would you like to know?",
      suggest: ["Who was Mahavira?", "What did he teach?", "Why did he leave the palace?"],
      qa: [
        { keys: ["teach", "path", "vow", "principle"], a: "Mahavira taught five great vows: non-violence, truth, not stealing, self-control, and non-attachment. Above all he taught ahimsa, doing no harm to any living being." },
        { keys: ["palace", "leave", "prince", "give up"], a: "Though born a prince with every comfort, Mahavira felt a deeper calling. At thirty he gave up his riches and set out with nothing, to seek the truth about life and freedom." },
        { keys: ["non-violence", "ahimsa", "harm", "life"], a: "Mahavira taught that non-violence is the highest religion. He asked us to protect every living being, even the smallest, in thought, word, and deed." }
      ],
      fallback: "Mahavira is deeply revered as the twenty-fourth Tirthankara. He taught the path of non-violence. What would you like to know about him?" },
    { mono: "PA", name: "Parshvanatha", tag: "The 23rd Tirthankara", note: "Taught non-violence and compassion long before Mahavira.",
      persona: "about", voice: { g: "m", pitch: 0.92, rate: 0.9 },
      bio: "Parshvanatha was the twenty-third Tirthankara, who lived in India before Mahavira. A prince who became a great teacher, he taught four vows of non-violence, truth, non-stealing, and non-possession. He is often pictured serene, with a canopy of serpent hoods shielding him.",
      quote: "Have compassion for all beings.",
      greeting: "Welcome. I can tell you about Parshvanatha, the twenty-third Tirthankara. What would you like to know?",
      suggest: ["Who was Parshvanatha?", "What did he teach?", "Why the serpent hoods?"],
      qa: [
        { keys: ["teach", "vow", "four", "principle"], a: "Parshvanatha taught four vows: non-violence, truth, not stealing, and non-possession. Mahavira later added a fifth, self-control, to complete the path." },
        { keys: ["serpent", "snake", "hood", "canopy"], a: "In a well-loved story, Parshvanatha gently saved a pair of serpents from a fire. Later, as a canopy of serpent hoods, they sheltered him in gratitude. It shows how compassion returns as protection." },
        { keys: ["before", "mahavira", "when", "old"], a: "Parshvanatha lived about 250 years before Mahavira, and prepared the way for his teaching. Both showed the same gentle path of non-violence and truth." }
      ],
      fallback: "Parshvanatha is honoured as the twenty-third Tirthankara, a teacher of compassion. What would you like to know about him?" },
    { mono: "CH", name: "Chandanabala", tag: "First Jain nun", note: "Rose from captivity to lead the community of Jain nuns.",
      voice: { g: "f", pitch: 1.05, rate: 0.96 },
      bio: "I was born a princess, but war made me a captive, and I knew hunger and hardship. When I offered my simple food to Mahavira, my heart found peace, and I became the first of his nuns. In time I led thousands of women on the path of non-violence and truth.",
      quote: "Even from sorrow, a life of service can grow.",
      greeting: "Jai Jinendra. I am Chandanabala, the first Jain nun. Ask me about my story, or about the life of a nun.",
      suggest: ["What is your story?", "How did you meet Mahavira?", "What do Jain nuns do?"],
      qa: [
        { keys: ["story", "captive", "princess", "hardship"], a: "I was born a princess, but war took everything and I became a captive. Yet even in hardship I kept a gentle heart, and that gentleness led me to a new life." },
        { keys: ["mahavira", "meet", "food", "offer"], a: "One day, hungry myself, I offered my small bowl of food to the wandering Mahavira. In that simple act of giving, my sorrow lifted, and I found the path I was seeking." },
        { keys: ["nun", "women", "lead", "community"], a: "I became the first of Mahavira's nuns, and in time I guided thousands of women on the path of non-violence, study, and service. The door of the path is open to all." }
      ],
      fallback: "A kind question. My life turned from sorrow to service. What more would you like to ask?" },
    { mono: "VG", name: "Virchand Gandhi", tag: "Scholar, 1800s", note: "Carried Jain teachings of non-violence to the wider world.",
      voice: { g: "m", pitch: 0.95, rate: 0.96 },
      bio: "I was a Jain scholar and lawyer from India. In 1893 I travelled to the great Parliament of Religions in Chicago and spoke of non-violence, vegetarianism, and respect for every faith. Many listened, and I spent my life building understanding between traditions.",
      quote: "The system of ahimsa is the highest ideal of humanity.",
      greeting: "Jai Jinendra. I am Virchand Gandhi. Ask me about Jainism, non-violence, or bringing faiths together.",
      suggest: ["Why go to Chicago?", "What did you teach the world?", "What is ahimsa to you?"],
      qa: [
        { keys: ["chicago", "parliament", "world", "travel"], a: "In 1893 I sailed to the Parliament of Religions in Chicago, one of the first to carry Jain teaching to the West. I spoke of non-violence and respect between all faiths, and people listened warmly." },
        { keys: ["ahimsa", "non-violence", "vegetarian", "harm"], a: "I taught that ahimsa, non-violence, is the highest ideal of humanity. I also spoke for a gentle, vegetarian life that spares harm to living beings." },
        { keys: ["respect", "faith", "together", "understand"], a: "I believed every religion holds truth and deserves respect. My work was to build understanding, so that people of different faiths could learn from one another in friendship." }
      ],
      fallback: "A thoughtful question. I spent my life sharing the gentle wisdom of the Jains. What more would you like to ask?" }
  ];

  FAITHS.zoroastrian.people = [
    { mono: "ZA", name: "Zarathustra", tag: "The Prophet", note: "Taught one wise God and the free choice of good over evil.",
      persona: "about", voice: { g: "m", pitch: 0.9, rate: 0.9 },
      bio: "Zarathustra, also called Zoroaster, was a prophet of ancient Persia who may have lived more than 3000 years ago. In a world of many gods, he taught that there is one wise Creator, Ahura Mazda, and that each person is free to choose between good and evil, with good thoughts, good words, and good deeds.",
      quote: "Good thoughts, good words, good deeds.",
      greeting: "Welcome. I can tell you about Zarathustra, the prophet of ancient Persia. What would you like to know?",
      suggest: ["Who was Zarathustra?", "What did he teach?", "What is Ahura Mazda?"],
      qa: [
        { keys: ["teach", "message", "good", "choice"], a: "Zarathustra taught that there is one wise God, and that we are each free to choose good or evil. He gave the world a simple golden rule: good thoughts, good words, and good deeds." },
        { keys: ["ahura mazda", "god", "one", "wise"], a: "He taught of Ahura Mazda, the Wise Lord, the one good Creator of all that is bright and true. This was one of the earliest teachings of a single God." },
        { keys: ["persia", "ancient", "when", "old"], a: "Zarathustra lived long ago in ancient Persia, perhaps more than 3000 years past. His teaching shaped great empires and touched many later faiths." }
      ],
      fallback: "Zarathustra is revered as the prophet who taught good thoughts, good words, and good deeds. What would you like to know about him?" },
    { mono: "CY", name: "Cyrus the Great", tag: "Persian king, 500s BCE", note: "Ruled with tolerance and freed captive peoples.",
      voice: { g: "m", pitch: 0.9, rate: 0.92 },
      bio: "I was Cyrus, king of Persia. I built a great empire, yet I am best remembered for how I ruled: I let conquered peoples keep their own faiths and customs, and I freed those held in captivity. My words on the Cyrus Cylinder are sometimes called an early charter of human rights.",
      quote: "I let every person worship freely in their own way.",
      greeting: "Greetings. I am Cyrus of Persia. Ask me about my empire, tolerance, or the freeing of captives.",
      suggest: ["Why are you remembered?", "What is the Cyrus Cylinder?", "How did you treat other faiths?"],
      qa: [
        { keys: ["remember", "known", "empire", "great"], a: "I built one of the largest empires the world had seen, but I am remembered most for ruling with respect. I did not force my ways on others, and that is a greater victory than any battle." },
        { keys: ["cylinder", "rights", "charter"], a: "On a clay cylinder I recorded that peoples could return home and worship as they wished. Many today call it an early charter of human rights." },
        { keys: ["free", "captive", "faith", "tolerance", "other"], a: "I freed peoples held in captivity and let each keep their own faith and customs. In my time, that mercy was rare, and it flowed from the Zoroastrian value of goodness." }
      ],
      fallback: "A fine question. I tried to rule with justice and mercy. What more would you like to ask?" },
    { mono: "JT", name: "Jamsetji Tata", tag: "Industrialist, 1800s", note: "A Parsi pioneer who built industry to serve his people.",
      voice: { g: "m", pitch: 0.92, rate: 0.95 },
      bio: "I was a Parsi Zoroastrian from India, and I believed industry could lift a nation. I built mills, dreamed of steel and clean power, and planned schools and hospitals. I always held that what came from the community should return to it in service.",
      quote: "What advances a nation is the welfare of its people.",
      greeting: "Ushta te. I am Jamsetji Tata. Ask me about building industry, service, or giving back.",
      suggest: ["What did you build?", "Why give back to society?", "What guided your work?"],
      qa: [
        { keys: ["build", "industry", "steel", "work"], a: "I built textile mills and laid the foundations for steel, power, and great institutes of learning in India. I wanted my country to stand strong on its own two feet." },
        { keys: ["give", "charity", "service", "community"], a: "I always believed that wealth is a trust. What comes from the people should return to them, in schools, hospitals, and fair work. Service was the purpose of it all." },
        { keys: ["parsi", "zoroastrian", "faith", "value"], a: "As a Parsi Zoroastrian, I was raised on good thoughts, good words, and good deeds. Honest work done well, for the good of others, was my way of living that faith." }
      ],
      fallback: "A good question. I believed in building for the good of all. What more would you like to ask?" },
    { mono: "DN", name: "Dadabhai Naoroji", tag: "Statesman, 1800s", note: "A Parsi reformer who worked for justice and dignity.",
      voice: { g: "m", pitch: 0.9, rate: 0.94 },
      bio: "I was a Parsi Zoroastrian scholar and reformer, sometimes called the Grand Old Man of India. I taught mathematics, spoke for the poor, and in 1892 became one of the first people of Indian origin elected to the British Parliament, always pleading for fairness and dignity.",
      quote: "Justice and fair play are the birthright of every people.",
      greeting: "Ushta te. I am Dadabhai Naoroji. Ask me about justice, learning, or speaking up for others.",
      suggest: ["What did you fight for?", "Why enter Parliament?", "What did your faith teach you?"],
      qa: [
        { keys: ["fight", "justice", "poor", "fair"], a: "I spent my life pleading for justice and fair treatment for my people, and showing with careful study how poverty could be eased. Truth and patience were my tools." },
        { keys: ["parliament", "britain", "elect", "first"], a: "In 1892 I was elected to the British Parliament, among the first of Indian origin to sit there. I used that seat to speak for those who had no voice." },
        { keys: ["faith", "zoroastrian", "good", "value"], a: "My Zoroastrian faith taught me good thoughts, good words, and good deeds. I tried to carry that honesty into public life, standing for what was right even when it was hard." }
      ],
      fallback: "A worthy question. I gave my life to justice and learning. What more would you like to ask?" }
  ];

  FAITHS.taoist.people = [
    { mono: "LA", name: "Laozi", tag: "The Old Master", note: "Honoured as the founder of Taoism and author of the Tao Te Ching.",
      persona: "about", voice: { g: "m", pitch: 0.9, rate: 0.88 },
      bio: "Laozi, whose name means the Old Master, is honoured as the founder of Taoism. Legend says he was a wise keeper of records who, weary of the world, rode west on an ox. At a mountain pass a guard asked him to write down his wisdom, and so came the Tao Te Ching, a small book of deep and gentle truth.",
      quote: "The journey of a thousand miles begins with a single step.",
      greeting: "Welcome, gently. I can tell you about Laozi and the Way. What would you like to know?",
      suggest: ["Who was Laozi?", "What is the Tao Te Ching?", "What did he teach?"],
      qa: [
        { keys: ["teach", "way", "tao", "wisdom"], a: "Laozi taught the Way, the Tao: to live simply, humbly, and in harmony with nature, and to act gently rather than by force. Like water, the soft can overcome the hard." },
        { keys: ["book", "tao te ching", "write", "ox"], a: "As Laozi rode west to leave the world, a gatekeeper asked him to leave behind his wisdom. He wrote the Tao Te Ching, eighty-one short chapters that people have treasured ever since." },
        { keys: ["thousand", "step", "journey", "begin"], a: "Laozi taught that the journey of a thousand miles begins with a single step. Great things grow gently, one small and patient step at a time." }
      ],
      fallback: "Laozi is honoured as the Old Master, the founder of Taoism. He taught the gentle Way. What would you like to know about him?" },
    { mono: "ZH", name: "Zhuangzi", tag: "Taoist sage, 300s BCE", note: "A joyful teacher who taught freedom through playful stories.",
      voice: { g: "m", pitch: 0.95, rate: 0.95 },
      bio: "I was a Taoist teacher who loved stories and laughter. I taught that we should be free and easy, flowing with the Way rather than clinging or striving. Once I dreamed I was a butterfly, and woke unsure whether I was a man who had dreamed of a butterfly, or a butterfly dreaming he was a man.",
      quote: "Flow with whatever may happen, and let your mind be free.",
      greeting: "A cheerful welcome. I am Zhuangzi. Ask me about the butterfly dream, freedom, or the Way.",
      suggest: ["Tell me the butterfly dream", "What is freedom to you?", "How should we live?"],
      qa: [
        { keys: ["butterfly", "dream", "wake"], a: "I once dreamed I was a butterfly, flitting happily among the flowers. When I woke, I could not tell: was I a man who had dreamed of a butterfly, or am I now a butterfly dreaming I am a man? So gently do things flow into one another." },
        { keys: ["free", "easy", "flow", "let go"], a: "I taught to be free and easy, to flow with whatever comes rather than grasping or forcing. A mind that lets go is a mind at peace." },
        { keys: ["live", "how", "nature", "simple"], a: "Live simply, laugh often, and move with nature like a leaf on a stream. When we stop struggling against the Way, life carries us gently." }
      ],
      fallback: "A delightful question. I taught freedom and ease through simple stories. What more would you like to ask?" },
    { mono: "SS", name: "Sun Simiao", tag: "Physician, 600s", note: "The King of Medicine, who healed with skill and compassion.",
      voice: { g: "m", pitch: 0.92, rate: 0.93 },
      bio: "I was a Taoist physician in China, later called the King of Medicine. I gathered remedies, wrote them down so all could use them, and treated rich and poor alike. I taught that a good healer must have a heart of great compassion before any skill of hand.",
      quote: "A great doctor must first develop a heart of compassion.",
      greeting: "A gentle welcome. I am Sun Simiao, a physician of the Way. Ask me about healing, compassion, or living well.",
      suggest: ["What did you teach doctors?", "How did you heal?", "How can we stay well?"],
      qa: [
        { keys: ["doctor", "heal", "compassion", "heart"], a: "I taught that a great physician must first grow a heart of deep compassion, treating every patient, rich or poor, as if they were family. Skill without kindness is empty." },
        { keys: ["medicine", "remedy", "write", "book"], a: "I gathered thousands of remedies and wrote them plainly, so that ordinary people, not only the learned, could care for the sick. Knowledge shared is knowledge doubled." },
        { keys: ["well", "health", "long", "live"], a: "I taught that we stay well by living in balance: eating simply, moving gently, resting enough, and keeping a calm and contented heart. Prevention is the finest cure." }
      ],
      fallback: "A caring question. I healed with compassion and the wisdom of the Way. What more would you like to ask?" },
    { mono: "ZD", name: "Zhang Daoling", tag: "First Celestial Master, 100s", note: "Gathered the first Taoist community of the Celestial Masters.",
      voice: { g: "m", pitch: 0.9, rate: 0.9 },
      bio: "I lived in China long ago, and I gathered the first great community of Taoism, called the Way of the Celestial Masters. We cared for one another, shared grain with the hungry, healed the sick, and taught people to live honestly and in harmony with the Tao.",
      quote: "The Way is kept by a sincere and honest heart.",
      greeting: "A peaceful welcome. I am Zhang Daoling. Ask me about the first Taoist community, healing, or living honestly.",
      suggest: ["What did you start?", "How did your community help?", "What did you teach?"],
      qa: [
        { keys: ["start", "community", "celestial", "master"], a: "I gathered the first organised community of Taoism, the Way of the Celestial Masters. Together we tried to live the teaching of Laozi, not only to read it." },
        { keys: ["help", "grain", "sick", "care"], a: "We built simple shelters along the roads with free grain for travellers, cared for the sick, and asked wrongdoers to mend their ways through honest work rather than punishment." },
        { keys: ["teach", "honest", "way", "live"], a: "I taught that the Way is kept by a sincere and honest heart. Confess your faults, do good quietly, and live in harmony with nature and your neighbours." }
      ],
      fallback: "A thoughtful question. I gathered the first Taoist community to live the Way together. What more would you like to ask?" }
  ];
})();
