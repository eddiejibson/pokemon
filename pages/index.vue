<template>
  <div class="container">
    <div class="row header">
      <img src="icons/192.png" />
      <h1 class="center-text">PokéAPI UI</h1>
    </div>

    <div class="inner-container">
      <div class="search row">
        <searchIcon rootClass="icon" h="20" w="20" />
        <input type="text" placeholder="Search by a Pokemon's name or ID" />
      </div>
      <div class="flex-wrap">
        <pokemonCard />
        <pokemonCard />
        <pokemonCard />
      </div>
    </div>
  </div>
</template>

<script>
import searchIcon from "vue-ionicons/dist/md-search.vue";
import pokemonCard from "~/components/pokemonCard.vue";
export default {
  components: {
    searchIcon,
    pokemonCard
  }
};
</script>

<style>
</style>
