<template>
  <div class="card column">
    <img
      class="pokemon-thumb"
      src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png"
    />
    <h1>{{ name }}</h1>
    <div class="row">
      <addCircle rootClass="icon" h="25" w="25" />
      <arrow rootClass="icon" h="25" w="25" />
    </div>
  </div>
</template>

<script>
import addCircle from "vue-ionicons/dist/md-add-circle-outline.vue";
import arrow from "vue-ionicons/dist/md-arrow-forward.vue";
export default {
  components: {
    addCircle,
    arrow
  },
  props: {
    name: String,
    index: Number
  }
};
</script>

<style>
</style>
