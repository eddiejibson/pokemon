<template>
  <div class="card column">
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
  props: ["name", "index"],
  data() {
    return {
      thumbIndex: "001"
    };
  },
  mounted() {
    let indexLength = (Math.log(parseInt(this.index)) * Math.LOG10E + 1) | 0; //Thumb is in the format of 000 - if we pass in just a 1 for example, going to break. So I need to calculate how many zeros to put before (if any)
    if (indexLength != 0) {
      indexLength = 3 - indexLength;
      let thumb = String(this.index);
      console.log("INDEX LENGTH IS", indexLength, " FOR INDEX", this.index);
      for (let i = 0; i < indexLength; i++) {
        thumb = "0" + thumb;
      }
      console.log(thumb);
      this.thumbIndex = thumb;
    }
  }
};
</script>

<style>
</style>
