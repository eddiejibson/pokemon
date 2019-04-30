<template>
  <div class="container">
    <div class="row header">
      <img src="~/static/icons/192.png" />
      <h1 class="center-text">{{ pokemon.name }}</h1>
    </div>
    <div class="inner-container">
      <div
        class="row"
        style="margin-left: 5px;
margin-right: 5px;"
      >
        <div class="card">
          <div class="row row-no-center">
            <img
              class="pokemon"
              :src="
                'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' +
                  thumbIndex +
                  '.png'
              "
            />
            <div class="thumb-padding-acc">
              <p>
                <span class="bold">Weight:</span>
                {{ pokemon.weight / 10 + "kg" || "Unknown" }}
              </p>
              <p class="top">
                <span class="bold">Height:</span>
                {{ pokemon.height / 10 + "m" || "Unknown" }}
              </p>
              <div class="row top">
                <p class="bold">
                  Types:
                </p>
                <span
                  class="label"
                  :class="[type.type.name]"
                  v-for="type in pokemon.types"
                  :key="type"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //I have params passed here, too. This way I can extract the ID from the URL.
  async asyncData({ params, app }) {
    let error;
    let res = await app
      .$processGet(`/pokemon/${parseInt(params.id)}`)
      .catch(err => {
        //Would show error message, but I don't think anything of use to a user is returned, so I won't. The boolean will just serve to determine if a general purpose error message should be returned or not.
        error = true;
      });
    if (!res.data || error) {
      return {
        pokemon: false,
        thumbIndex: null,
        error: true
      };
    } else {
      let pokemon = res.data;
      pokemon.name =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); //Normally rely on just CSS for making sure the first character is in caps, but need this for the title
      return {
        pokemon: pokemon,
        thumbIndex: app.$getThumbIndex(params.id),
        error: false
      };
    }
  },
  head() {
    return {
      title: `${this.pokemon.name} • PokéAPI UI`
    };
  }
};
</script>

<style scoped>
.card {
  width: 100% !important;
}
.pokemon {
  width: 250px !important;
}

.label {
  margin-left: 5px;
  margin-right: 5px;
}
.top {
  margin-top: 5px;
}

.row-no-center {
  align-items: normal !important;
}

.thumb-padding-acc {
  margin-top: 20px;
}
</style>
