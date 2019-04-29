<template>
  <div class="card column" @click="travel(`/pokemon/` + index)">
    <!-- I used Pokemon's CDN for the images because the ones PokéAPI provided were pretty awful - they had a significant amount of padding -->
    <img
      class="pokemon-thumb"
      :src="
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' +
          thumbIndex +
          '.png'
      "
    />
    <h1>{{ name }}</h1>
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
  props: ["name", "index"],
  data() {
    return {
      thumbIndex: "001"
    };
  },
  methods: {
    travel(destination) {
      this.$router.push(destination);
    }
  },
  mounted() {
    this.thumbIndex = this.$getThumbIndex(this.index);
  }
};
</script>

<style scoped>
.card {
  cursor: pointer !important;
}
</style>
