/* =========================================================
   Saylavy - "A Day of Kindness" mini game, level data

   One data-driven top-down level per faith. A child walks
   around a community setting and helps ordinary neighbours
   with wholesome tasks, learning a real value each time.

   Sensitivity: the helpers are ordinary community members,
   never God, a prophet, or a Sikh Guru. Teachings are quoted
   as values, never put in a sacred figure's mouth and never
   depicted. Every community reviews the words before it is used.

   Coordinates are tile cells on a grid. Character sprites are
   [col,row] into assets/game/chars.png (16px tiles, 1px gap).
   Prop tiles are indices into assets/game/tiles.png (12 wide).
   ========================================================= */
(function () {
  "use strict";

  window.SAYLAVY_GAME = {

    muslim: {
      title: "A Day of Kindness",
      tagline: "Help your neighbours get ready to break the fast",
      quest: "Prepare the iftar",
      accent: "#1f9d57",
      sign: "Help build a better future",
      grid: { cols: 18, rows: 12 },
      plaza: { x: 5, y: 4, w: 8, h: 5 },      // sand courtyard for the shared meal
      buildings: [
        { x: 1, y: 1, roof: "grey" },          // the bakery
        { x: 14, y: 1, roof: "red" }           // a neighbour's home
      ],
      props: [
        { k: "tree", x: 0, y: 9 }, { k: "tree", x: 17, y: 9 },
        { k: "bush", x: 4, y: 9 }, { k: "bush", x: 13, y: 9 },
        { k: "bush", x: 0, y: 4 }, { k: "chest", x: 16, y: 4 }
      ],
      lanterns: [ { from: [1, 1], to: [14, 1] } ],  // string of iftar lights (drawn)
      player: { sprite: [0, 5], x: 8, y: 10 },
      stations: [
        {
          id: "bread", x: 2, y: 4, prop: "oven", task: "knead",
          label: "Bake the bread",
          helper: { sprite: [1, 6], x: 3, y: 4, name: "Baker Kareem",
                    line: "Assalamu alaikum! Come, help me bake the bread for tonight." },
          teach: "In Islam, feeding a hungry neighbour is a beautiful act of charity."
        },
        {
          id: "milk", x: 15, y: 5, prop: "barrel", task: "pour",
          label: "Pour the milk and dates",
          helper: { sprite: [0, 10], x: 15, y: 6, name: "Grandma Amina",
                    line: "Will you help me pour the milk and set out the dates?" },
          teach: "Even a small kindness counts. Sharing what we have brings blessing."
        },
        {
          id: "share", x: 9, y: 6, prop: "mat", task: "serve",
          label: "Share the meal with everyone",
          helper: { sprite: [1, 11], x: 9, y: 4, name: "Uncle Yusuf",
                    line: "The sun is almost down. Let us serve everyone, together." },
          teach: "In Ramadan we break the fast side by side, because all are equal at the table.",
          needs: ["bread", "milk"]              // unlocks after the first two
        }
      ],
      guests: [                                 // seated neighbours around the mat
        { sprite: [1, 7], x: 7, y: 5 }, { sprite: [0, 8], x: 11, y: 5 },
        { sprite: [1, 8], x: 7, y: 8 }, { sprite: [1, 10], x: 11, y: 8 }
      ],
      finish: {
        title: "Everyone eats together",
        text: "You helped prepare the iftar. When the sun sets, the whole community breaks the fast as one family - neighbours, strangers and friends, side by side.",
        teach: "Shukran - thank you. The best of people are those who bring good to others."
      }
    },

    sikh: {
      title: "A Day in the Langar",
      tagline: "Help cook and serve the free community meal",
      quest: "Serve the langar",
      accent: "#4a57c0",
      sign: "Help build a better future",
      grid: { cols: 18, rows: 12 },
      plaza: { x: 5, y: 4, w: 8, h: 5 },
      buildings: [
        { x: 1, y: 1, roof: "grey" },
        { x: 14, y: 1, roof: "red" }
      ],
      props: [
        { k: "tree", x: 0, y: 9 }, { k: "tree", x: 17, y: 9 },
        { k: "bush", x: 4, y: 9 }, { k: "bush", x: 13, y: 9 },
        { k: "bush", x: 0, y: 4 }, { k: "chest", x: 16, y: 4 }
      ],
      lanterns: [ { from: [1, 1], to: [14, 1] } ],
      player: { sprite: [0, 5], x: 8, y: 10 },
      stations: [
        {
          id: "roti", x: 2, y: 4, prop: "oven", task: "knead",
          label: "Roll the roti",
          helper: { sprite: [1, 6], x: 3, y: 4, name: "Bhai Harjeet",
                    line: "Sat Sri Akal! Come, roll the roti with me for everyone." },
          teach: "In the langar everyone helps cook. Serving others, called seva, is at the heart of Sikhi."
        },
        {
          id: "dal", x: 15, y: 5, prop: "barrel", task: "pour",
          label: "Ladle the dal",
          helper: { sprite: [0, 10], x: 15, y: 6, name: "Auntie Preet",
                    line: "Will you help me ladle the dal into the bowls for our guests?" },
          teach: "The free kitchen feeds anyone who comes, of any faith or none. All are welcome."
        },
        {
          id: "share", x: 9, y: 6, prop: "mat", task: "serve",
          label: "Serve everyone in the row",
          helper: { sprite: [1, 11], x: 9, y: 4, name: "Grandfather Sardar",
                    line: "Everyone sits together now. Let us serve each person in the row." },
          teach: "Everyone sits on the floor in one long row, called pangat, because all people are equal.",
          needs: ["roti", "dal"]
        }
      ],
      guests: [
        { sprite: [1, 7], x: 7, y: 5 }, { sprite: [0, 8], x: 11, y: 5 },
        { sprite: [1, 8], x: 7, y: 8 }, { sprite: [1, 10], x: 11, y: 8 }
      ],
      finish: {
        title: "Everyone eats as equals",
        text: "You served in the langar. Rich and poor, strangers and neighbours, all sit and eat together in one row - no one above, no one below.",
        teach: "Sharing a meal as equals is one of the greatest teachings the Gurus gave us."
      }
    },

    /* Faith-neutral showcase for the main page - values every faith shares */
    village: {
      title: "A Day of Kindness",
      tagline: "Help your neighbours get ready for a shared meal",
      quest: "Prepare the feast",
      accent: "#d9a441",
      sign: "Help build a better future",
      grid: { cols: 18, rows: 12 },
      plaza: { x: 5, y: 4, w: 8, h: 5 },
      buildings: [
        { x: 1, y: 1, roof: "grey" },
        { x: 14, y: 1, roof: "red" }
      ],
      props: [
        { k: "tree", x: 0, y: 9 }, { k: "tree", x: 17, y: 9 },
        { k: "bush", x: 4, y: 9 }, { k: "bush", x: 13, y: 9 },
        { k: "bush", x: 0, y: 4 }, { k: "chest", x: 16, y: 4 }
      ],
      lanterns: [ { from: [1, 1], to: [14, 1] } ],
      player: { sprite: [0, 5], x: 8, y: 10 },
      stations: [
        {
          id: "bread", x: 2, y: 4, prop: "oven", task: "knead",
          label: "Bake the bread",
          helper: { sprite: [1, 6], x: 3, y: 4, name: "Mira the baker",
                    line: "Hello, friend! Come and help me bake fresh bread for everyone." },
          teach: "In every faith, feeding a hungry neighbour is one of the kindest things a person can do."
        },
        {
          id: "water", x: 15, y: 5, prop: "barrel", task: "pour",
          label: "Fetch the water",
          helper: { sprite: [0, 10], x: 15, y: 6, name: "Grandma Rosa",
                    line: "Will you help me pour the water and set the cups for our guests?" },
          teach: "A cool cup of water, freely given, is never a small thing. Share what you have."
        },
        {
          id: "share", x: 9, y: 6, prop: "mat", task: "serve",
          label: "Share the meal with everyone",
          helper: { sprite: [1, 11], x: 9, y: 4, name: "Grandpa Sam",
                    line: "The table is nearly ready. Let us serve everyone, together." },
          teach: "When we sit and share a meal, everyone is welcome and everyone is equal.",
          needs: ["bread", "water"]
        }
      ],
      guests: [
        { sprite: [1, 7], x: 7, y: 5 }, { sprite: [0, 8], x: 11, y: 5 },
        { sprite: [1, 8], x: 7, y: 8 }, { sprite: [1, 10], x: 11, y: 8 }
      ],
      finish: {
        title: "Everyone eats together",
        text: "You helped prepare the feast. Neighbours, strangers and friends all sit down at one table, side by side.",
        teach: "Thank you. When people share food, strangers become friends - a truth every faith holds dear."
      }
    }

  };
})();
