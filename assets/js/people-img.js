/* Portrait mapping - auto-generated from Wikipedia lead images.
   The Sikh Gurus intentionally have no image (monograms only). */
(function () {
  if (typeof FAITHS === "undefined") return;
  var IMG = {
  "Martin Luther": "assets/img/people/martin-luther.jpg",
  "John Wesley": "assets/img/people/john-wesley.jpg",
  "C. S. Lewis": "assets/img/people/cs-lewis.jpg",
  "Billy Graham": "assets/img/people/billy-graham.jpg",
  "St. Francis of Assisi": "assets/img/people/francis-of-assisi.jpg",
  "St. Augustine": "assets/img/people/augustine.jpg",
  "Mother Teresa": "assets/img/people/mother-teresa.jpg",
  "Pope John Paul II": "assets/img/people/john-paul-ii.jpg",
  "St. John Chrysostom": "assets/img/people/john-chrysostom.jpg",
  "St. Basil the Great": "assets/img/people/basil-the-great.jpg",
  "St. Seraphim of Sarov": "assets/img/people/seraphim-of-sarov.jpg",
  "St. Nicholas": "assets/img/people/saint-nicholas.jpg",
  "Jalaluddin Rumi": "assets/img/people/rumi.jpg",
  "Ibn Sina": "assets/img/people/ibn-sina.jpg",
  "Al-Khwarizmi": "assets/img/people/al-khwarizmi.jpg",
  "Salahuddin": "assets/img/people/salahuddin.jpg",
  "Swami Vivekananda": "assets/img/people/vivekananda.jpg",
  "Adi Shankara": "assets/img/people/adi-shankara.jpg",
  "Mirabai": "assets/img/people/mirabai.jpg",
  "Mahatma Gandhi": "assets/img/people/gandhi.jpg",
  "Bhagat Puran Singh": "assets/img/people/puran-singh.jpg",
  "Maharaja Ranjit Singh": "assets/img/people/ranjit-singh.jpg",
  "Moshe (Moses)": "assets/img/people/moses.jpg",
  "Maimonides": "assets/img/people/maimonides.jpg",
  "Rashi": "assets/img/people/rashi.jpg",
  "Golda Meir": "assets/img/people/golda-meir.jpg",
  "The Buddha": "assets/img/people/buddha.jpg",
  "Emperor Ashoka": "assets/img/people/ashoka.jpg",
  "Thich Nhat Hanh": "assets/img/people/thich-nhat-hanh.jpg",
  "The Dalai Lama": "assets/img/people/dalai-lama.jpg"
};
  Object.keys(FAITHS).forEach(function (k) {
    (FAITHS[k].people || []).forEach(function (p) { if (IMG[p.name]) p.img = IMG[p.name]; });
  });
})();
