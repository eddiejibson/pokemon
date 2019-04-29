module.exports = {
  mode: 'universal',
  head: {
    title: "PokéAPI UI",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: "description",
        name: "description",
        content: "Simple UI utilizing some of the Pokeapi endpoints"
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  loading: {
    color: "#e74c3c"
  },
  css: [
    "@/assets/css/app.css"
  ],

  //The only plugin that will be imported is the pokeapi.js which is effectively a wrapper I wrote myself
  plugins: ["@/plugins/pokemon.js"],

  //The only module that will be imported is axios - I find this best for handling requests and slightly easier than using just plain XHR.
  modules: [],

}
