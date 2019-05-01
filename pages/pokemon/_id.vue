<template>
  <div class="container">
    <div class="row header">
      <img src="~/static/icons/192.png" />
      <h1 class="center-text">{{ pokemon.name }}</h1>
    </div>
    <div class="inner-container">
      <div class="row above-card" @click="travel('/')">
        <arrow w="13" h="13" rootClass="back-icon" />
        <p>Back to browse</p>
      </div>

      <div class="row">
        <div class="card">
          <div
            class="row row-no-center row-small"
            style="margin-left:0px!important;"
          >
            <img
              class="pokemon"
              :src="
                'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' +
                  thumbIndex +
                  '.png'
              "
            />
            <div class="info-container">
              <p>
                <span class="bold">Weight:</span>
                {{ pokemon.weight / 10 + "kg" || "Unknown" }}
              </p>
              <p class="top">
                <span class="bold">Height:</span>
                {{ pokemon.height / 10 + "m" || "Unknown" }}
              </p>
              <p class="top">
                <span class="bold">Abilities:</span>
                {{ pokemon.abilities }}
              </p>
              <div class="row top">
                <p class="bold">
                  Types:
                </p>
                <span
                  class="label"
                  :class="[type.type.name]"
                  v-for="(type, index) in pokemon.types"
                  :key="index"
                >
                  {{ type.type.name }}
                </span>
              </div>
              <div
                class="row top space-between"
                v-for="(stat, index) in pokemon.stats"
                :key="index"
              >
                <p class="bold temp-padding">
                  {{ stat.stat.name.replace("-", " ") }}:
                </p>
                <div class="full-bar">
                  <div class="bar" :style="{ width: stat.base_stat + '%' }">
                    <span>{{ stat.base_stat }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pokemon-options row space-between row-small">
            <span class="row option"
              ><shuffle w="14" h="14" rootClass="option-icon" />
              <p>Compare with another Pokemon</p></span
            >
            <span
              class="row reverse option bottom"
              id="addToFavourite"
              @click="favourite"
            >
              <heart w="14" h="14" rootClass="option-icon" />
              <p>Add to your favourites</p>
            </span>
            <span
              class="row reverse option bottom"
              style="display:none;"
              id="addedToFavouriteSuccess"
            >
              <tick w="14" h="14" rootClass="option-icon" />
              <p>Added to your favourites</p>
            </span>
            <span
              class="row reverse option bottom"
              style="display:none;"
              @click="removeFavourite"
              id="addedToFavourite"
            >
              <!-- This time I didn't want to just keep repeating showing and hiding an element, so it will dynamically change the text and show/hide the trash icon -->
              <trash
                w="14"
                h="14"
                rootClass="option-icon"
                v-if="removalStatus.clicks == 0"
              />
              <p>{{ removalStatus.text }}</p>
            </span>
          </div>
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
export default {
  components: {
    arrow,
    shuffle,
    heart,
    tick,
    trash
  },
  methods: {
    travel(destination) {
      this.$router.push(destination);
    },
    //Is method because I'm calling both if the user clicks to add or if it has already been added
    showAddedToFavourite(showSuccess = true) {
      //Again, I'm aware I could use v-if, just wanted to show  I can manipulate the DOM in vanilla javascript and without the use of a framework.
      document.getElementById("addToFavourite").style.display = "none";
      if (showSuccess) {
        document.getElementById("addedToFavouriteSuccess").style.display =
          "flex";
        setTimeout(() => {
          document.getElementById("addedToFavouriteSuccess").style.display =
            "none";
          document.getElementById("addedToFavourite").style.display = "flex";
        }, 2000);
      } else {
        document.getElementById("addedToFavourite").style.display = "flex";
      }
    },
    favourite() {
      this.$saveFavourite(this.pokemon);
      this.showAddedToFavourite();
    },
    removeFavourite() {
      if (this.removalStatus.clicks == 0) {
        this.removalStatus.text = "Are you sure?";
        this.removalStatus.clicks = 1;
        setTimeout(() => {
          this.removalStatus.text = "Remove from your favourites";
          this.removalStatus.clicks = 0;
        }, 2500); //Don't want to show this forever (could have been clicked by accident)
      } else if (this.removalStatus.clicks == 1) {
        //User has confirmed they want to remove a Pokemon
        this.$removeFavourite(this.pokemon);
        this.removalStatus.text = "Removed.";
        setTimeout(() => {
          document.getElementById("addedToFavourite").style.display = "none";
          document.getElementById("addToFavourite").style.display = "flex";
        }, 1500);
      }
    }
  },
  //I have the params key passed here, too. This way I can extract the ID from the URL.
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
        error: true,
        removalStatus: null
      };
    } else {
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
        removalStatus: { text: "Remove from your favourites", clicks: 0 } //1 is asked to remove, 2 is has confirmed removal so do it.
      };
    }
  },
  mounted() {
    if (this.pokemon && !this.error) {
      //Make sure the pokemon has loaded
      let favourites = this.$getFavourites(); //Get favourites from localStorage
      if (favourites) {
        favourites = favourites[0];
        if (favourites[this.pokemon.id]) {
          //If ID exists, the user has saved it to their favourites. Reflect this in the UI. Do not show the success "added to your favourites" - so pass in false.
          this.showAddedToFavourite(false);
        }
      }
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
