<template>
  <div class="container">
    <div class="row header">
      <img src="icons/192.png" />
      <h1 class="center-text">My Favourites</h1>
    </div>

    <div class="inner-container stretch">
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
export default {
  components: {
    pokemonCard
  },
  //Not async as it will not be subject to SSR.
  data() {
    return {
      pokemons: false
    };
  },
  mounted() {
    let favourites = this.$getFavourites(); //Get favourites from localStorage
    if (favourites) {
      favourites = favourites[0];
      this.pokemons = favourites;
    }
  }
};
</script>

<style>
</style>
