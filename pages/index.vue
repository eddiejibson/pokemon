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
      <!-- only show if pokemons have been retrieved -->
      <div class="flex-wrap" v-if="pokemons">
        <pokemonCard
          v-for="(pokemon, index) in pokemons"
          :key="index"
          :index="index + 1"
          :name="pokemon.name"
        />
      </div>
      <div
        class="row"
        id="showIfLoadingRequest"
        style="margin-left: 5px;
margin-right: 5px;margin-bottom:10px;display:none"
      >
        <div class="card" style="width:100%;">
          <Loading msg="Loading More..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchIcon from "vue-ionicons/dist/md-search.vue";
import pokemonCard from "~/components/pokemonCard.vue";
import Loading from "~/components/Loading.vue";
export default {
  components: {
    searchIcon,
    pokemonCard,
    Loading
  },
  methods: {
    async loadMoreResults() {
      let res = await this.$processGet(
        `/pokemon/?limit=15&offset=${this.offset}`
      ).catch(err => {
        this.error = true;
      });
      if (!res.data || !res.data.results) {
        this.error = true;
      } else {
        this.offset = this.offset + 15;
        this.pokemons = this.pokemons.concat(res.data.results);
      }
    }
  },
  //This is asyncData (renders on the server - better for SEO.)
  async asyncData({ app }) {
    //App is param here so I can get the processGet function defined in the plugin
    //Default obj, regardless of request status
    let obj = {
      offset: 15, //How many pokemons have already been rendered (need this so on next request it gets the right ones)
      loadingRequest: false,
      pokemons: false,
      error: true
    };
    let obj2;
    let error = false;
    let res = await app.$processGet("/pokemon/?limit=15").catch(err => {
      //Would show error message, but I don't think anything of use to a user is returned, so I won't. The boolean will just serve to determine if a general purpose error message should be returned or not.
      error = true;
    });
    if (error || !res.data || !res.data.results) {
      //If an error was found or for some reason the API query returned nothing
      return obj;
    } else {
      let obj2 = {
        pokemons: res.data.results, //i don't know what the plural is for pokemon so
        error: false
      };
      return { ...obj, ...obj2 };
    }
  },
  mounted() {
    document.getElementById("showIfLoadingRequest").style.display = "none";
    var self = this; //Apparently I can't allow this inside another function
    window.onscroll = function(ev) {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !this.error
      ) {
        //I'm aware I can use v-if, I just wanted to demonstrate I can use vanilla javascript, too.
        document.getElementById("showIfLoadingRequest").style.display = "flex";
        self.loadMoreResults();
      }
    };
  }
};
</script>

<style>
</style>
