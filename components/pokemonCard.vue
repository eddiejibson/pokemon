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
import trash from "vue-ionicons/dist/md-trash.vue";
export default {
  components: {
    addCircle,
    arrow,
    trash
  },
  props: {
    name: String,
    index: Number,
    favourite: {
      //Should send query param to advanced card where from so instead of "back to browse", you can go back to favourite list instead
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      thumbIndex: "001"
    };
  },
  methods: {
    travel(destination) {
      if (this.favourite) {
        destination += "?from=favourites";
      }
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
