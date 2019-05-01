# PokéAPI UI

> Simple UI utilizing some of Pokéapi&#39;s endpoints

[Live version here](https://pokemon.jibson.me)

For this project, I used [NuxtJS](https://nuxtjs.org/) which is effectively VueJS with added features such as Server Side Rendering which is handy for SEO purposes. I made sure to also use vanilla Javascript in manipulating the DOM - to prove I'm not limited just to Vue. This may have looked strange in some places as it wasn't needed, but there was a reason behind it. The only other dependencies used were [Axios](https://github.com/axios/axios) which was used for retrieving data from the API endpoints provided (I'm aware I could have used vanilla XHR within JavaScript, but chose this simply for ease) and [Ionicons](https://ionicons.com/) which isn't a library as such and basically provides the SVG icons I used. **No CSS frameworks have been used at all**.

## Pages

`pages/index.vue` [/] - Allows user to browse Pokémon. Will intially fetch 15 Pokémon and render on the server (service side rendering). Then, upon a user's scroll to the bottom of the page, an additional 15 Pokémons will load (and so on). In the event a user clicks on a Pokémon card, they will be transported to a more advanced card (with the statistics and such).

`pages/pokemon/_id.vue` [/pokemon/id] (where _id is the index of the Pokémon being viewed) - This will display one card with the specified Pokémon's information (statistics and the like). As well as this, it also displays various options to favourite the current Pokémon or compare it with another. On favourite of a pokemon, they can also remove such here, too.

`pages/favourites` [/favourites] - This will display cards of the user's favourite Pokémon. On click (like the index page), it will also take the user to a more detailed version.

## Plugins

There is only one plugin that is being used:

`plugins/pokemon.js` - This was obviouisly self-written to handle API requests properly and perform other various interactions that may be required globally (e.g setting & getting data from localstorage e.t.c).


## Running yourself

```bash
# Install dependencies
npm install

# Run in developer mode
npm run dev

# Or, in production
npm run build
npm run start
```
