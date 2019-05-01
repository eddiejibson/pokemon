<template>
  <div class="container">
    <div class="row header">
      <img src="icons/192.png" />
      <h1 class="center-text">Favourite Pokémon</h1>
    </div>

    <div class="inner-container stretch">
      <div
        class="row"
        style="margin-top: 10px;margin-left:5px;margin-right:5px;"
      >
        <div class="card" style="width:100%;" v-if="!pokemons">
          <p class="center-text">
            You don't have any favourite Pokémon yet... Maybe it's time
            <nuxt-link to="/" style="color:#c0392b;text-decoration:none;"
              >you browsed</nuxt-link
            >
            and found some?
          </p>
        </div>
      </div>
      <!-- only show if pokemons have been retrieved -->
      <div class="flex-wrap" v-if="pokemons">
        <pokemonCard
          v-for="(pokemon, index) in pokemons"
          :key="index"
          :index="parseInt(index)"
          :name="pokemon.name"
          favourite
        />
      </div>
    </div>
  </div>
</template>

<script>
import pokemonCard from "~/components/pokemonCard.vue";
import arrow from "vue-ionicons/dist/md-arrow-back.vue";
export default {
  components: {
    pokemonCard,
    arrow
  },
  //Not async as it will not be subject to SSR.
  data() {
    return {
      pokemons: false
    };
  },
  mounted() {
    let favourites = this.$getFavourites(); //Get favourites from localStorage
    if (favourites && favourites[0]) {
      favourites = favourites[0];
      if (Object.keys(favourites).length <= 0) {
        this.pokemons = false;
      } else {
        this.pokemons = favourites;
      }
    } else {
      this.pokemons = false;
    }
  }
};
</script>

<style>
</style>
