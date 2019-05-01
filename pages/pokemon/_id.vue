<template>
  <div class="container">
    <div class="row header">
      <img src="~/static/icons/192.png" />
      <h1 class="center-text">{{ pokemon.name || "Error" }}</h1>
    </div>
    <div class="inner-container">
      <div class="row above-card" @click="travel(from.to)">
        <arrow w="13" h="13" rootClass="back-icon" />
        <p>Back to {{ from.text }}</p>
      </div>

      <div class="row">
        <div class="card" v-if="error">
          <!-- Is center for mobile -->
          <p style="width:100%;text-align:center">
            Something went wrong retrieving a Pokémon - are you sure the ID is
            correct?
          </p>
        </div>
        <advancedPokemonCard
          v-if="!error"
          :pokemon="pokemon"
          :thumbIndex="thumbIndex"
        />
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
    let error;
    let res = await app
      .$processGet(`/pokemon/${parseInt(params.id)}`)
      .catch(err => {
        //Would show error message, but I don't think anything of use to a user is returned, so I won't. The boolean will just serve to determine if a general purpose error message should be returned or not.
        return {
          pokemon: {},
          thumbIndex: null,
          from: null,
          error: true
        };
      });
    if (res && res.data) {
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
      let pokemon = res.data;
      pokemon.name =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); //Normally rely on just CSS for making sure the first character is in caps, but need this for the title
      let abilities = [];
      for (let i = 0; i < pokemon.abilities.length; i++) {
        let el = pokemon.abilities[i].ability.name;
        abilities.push(el.charAt(0).toUpperCase() + el.slice(1));
      }
      abilities = abilities.join(", ");
      pokemon.abilities = abilities;
      return {
        pokemon: pokemon,
        thumbIndex: app.$getThumbIndex(params.id),
        error: false,
        from: from
      };
    } else {
      return res;
    }
  },
  head() {
    return {
      title: `${this.pokemon.name || "Error"} • PokéAPI UI`
    };
  }
};
</script>

<style scoped>
.card {
  width: 100% !important;
}
.pokemon {
  width: 250px;
  height: 250px;
  margin-right: 20px;
}

.label {
  margin-left: 5px;
  margin-right: 5px;
}

.option-icon {
  height: 15px;
  width: 15px;
  margin-right: 3px;
}

.pokemon-options {
  margin-top: 15px;
  color: #bdc3c7;
  fill: #bdc3c7;
  font-size: 15px;
}

.option:hover {
  color: #fff;
  fill: #fff;
  cursor: pointer;
}

.top {
  margin-top: 6px;
}

.temp-padding {
  margin-right: 10px;
}

.inner-container {
  width: auto !important;
}

.card {
  width: 50%;
}

.back-icon {
  height: 13px;
  width: 13px;
  margin-right: 3px;
}

.bottom {
  margin-top: 0px;
}

@media only screen and (max-width: 670px) {
  .row-small {
    flex-direction: column !important;
    align-items: center !important;
  }

  .row .reverse {
    flex-direction: row !important;
  }

  .bottom {
    margin-top: 7px;
  }

  .row .reverse .option-icon {
    margin-left: 0px;
    margin-right: 3px !important;
  }

  .pokemon {
    margin: 0 !important;
    width: 200px;
    height: 200px;
  }

  .full-bar {
    margin: 0;
  }
}

@media only screen and (max-width: 390px) {
  .full-bar {
    width: 150px !important;
  }
}

.row .reverse .option-icon {
  margin-left: 3px;
  margin-right: 0px;
}
</style>
