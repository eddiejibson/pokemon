<template>
  <div class="container">
    <div class="row header" :class="{ 'header-two': two }">
      <img src="~/static/icons/192.png" />
      <h1 class="center-text">
        {{
          pokemonTwo.name
            ? `${pokemon.name} v ${pokemonTwo.name}`
            : pokemon.name || "Error"
        }}
      </h1>
    </div>
    <div class="inner-container">
      <div class="row above-card" @click="travel(from.to || '/')">
        <arrow w="13" h="13" rootClass="back-icon" />
        <p>Back to {{ from.text || "browse" }}</p>
      </div>

      <div class="row" :class="{ 'comparison-row': pokemonTwo.name }">
        <div class="card" v-if="error" style="width:100%!important;">
          <!-- Is center for mobile -->
          <p style="width:100%;text-align:center">
            Something went wrong retrieving a Pokémon - are you sure the ID is
            correct?
          </p>
        </div>
        <div class="row comparison-cards" v-if="!error && pokemon">
          <advancedPokemonCard
            :pokemon="pokemon"
            :thumbIndex="pokemon.thumbIndex"
            :two="two"
          />
          <advancedPokemonCard
            v-if="pokemonTwo"
            :pokemon="pokemonTwo"
            :thumbIndex="pokemonTwo.thumbIndex"
            :two="two"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import arrow from "vue-ionicons/dist/md-arrow-back.vue";
import shuffle from "vue-ionicons/dist/md-shuffle.vue";
import heart from "vue-ionicons/dist/md-heart.vue";
import tick from "vue-ionicons/dist/md-checkmark.vue";
import trash from "vue-ionicons/dist/md-trash.vue";
import advancedPokemonCard from "~/components/advancedPokemonCard.vue";
export default {
  components: {
    arrow,
    shuffle,
    heart,
    tick,
    trash,
    advancedPokemonCard
  },
  methods: {
    travel(destination) {
      this.$router.push(destination);
    }
  },
  //I have the params key passed here, too. This way I can extract the ID from the URL.
  async asyncData({ params, app, query }) {
    let error = {
      pokemon: {},
      pokemonTwo: {},
      thumbIndex: null,
      from: {},
      error: true
    };
    if (!params || !params.id || params.id.length <= 0) {
      //Do not process endpoint request if their is lack of an ID.
      return error;
    }
    let res = await app.$processGet(`/pokemon/${params.id}`).catch(err => {
      //Would show error message, but I don't think anything of use to a user is returned, so I won't. The boolean will just serve to determine if a general purpose error message should be returned or not.
      return error;
    });
    let res2 = false;
    if (query && query.comparison) {
      res2 = await app
        .$processGet(`/pokemon/${query.comparison.toLowerCase()}`)
        .catch(err => {
          res2 = false; //don't show error if there was an error getting the comparison pokemon
        });
    }
    if (res && res.data) {
      let obj = {};
      obj[0] = res.data;
      if (res2 && res2.data) {
        obj[1] = res2.data;
      }
      let from = {
        to: "/",
        text: "browse"
      };
      if (query && query.from == "favourites") {
        from = {
          to: "/favourites",
          text: "favourites"
        };
      }
      for (let i = 0; i < Object.keys(obj).length; i++) {
        let pokemon = obj[i];
        pokemon.name =
          pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); //Normally rely on just CSS for making sure the first character is in caps, but need this for the title
        let abilities = [];
        for (let i = 0; i < pokemon.abilities.length; i++) {
          let el = pokemon.abilities[i].ability.name;
          abilities.push(el.charAt(0).toUpperCase() + el.slice(1));
        }
        abilities = abilities.join(", ");
        pokemon.abilities = abilities;
        pokemon.thumbIndex = app.$getThumbIndex(pokemon.id);
        obj[i] = pokemon;
      }

      let response = {
        pokemon: obj[0],
        pokemonTwo: {},
        error: false,
        from: from,
        two: false
      };

      if (obj[1]) {
        response.pokemonTwo = obj[1];
        response.two = true;
      }

      return response;
    } else {
      return res;
    }
  },
  head() {
    return {
      title: `${
        this.pokemonTwo.name
          ? `${this.pokemon.name} v ${this.pokemonTwo.name}`
          : this.pokemon.name || "Error" || "Error"
      } • PokéAPI UI`
    };
  }
};
</script>

<style scoped>
.inner-container {
  width: auto !important;
}

.above-card {
  font-size: 13px;
  margin: 0px 0px 3px 0px;
  color: #bdc3c7;
  fill: #bdc3c7;
  margin-left: 10px;
}

.comparison-row {
  align-items: normal !important;
}
@media only screen and (max-width: 1380px) {
  .comparison-cards {
    flex-direction: column !important;
  }
}

@media only screen and (max-width: 500px) {
  .header-two img {
    display: none;
  }
}
</style>
