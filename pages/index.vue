<template>
  <div class="container">
    <div class="row header">
      <img src="icons/192.png" />
      <h1 class="center-text">PokéAPI UI</h1>
    </div>

    <div class="inner-container stretch">
      <div
        class="row above-search"
        v-if="!comparison"
        @click="travel('/favourites')"
      >
        <heart w="13" h="13" rootClass="favourite-icon" />
        <p>My favourite Pokémon</p>
      </div>
      <div class="search row" v-if="!comparison">
        <searchIcon rootClass="icon" h="20" w="20" />
        <!--form easier for submit (enter) event-->
        <form @submit="searchSubmit">
          <input
            type="text"
            placeholder="Search by a Pokemon's name or ID"
            v-model="searchQuery"
            @input="searchBegin"
          />
        </form>
      </div>
      <h1 class="center-text" style="font-size:25px;" v-if="comparison">
        Choose Pokémon to compare to {{ comparison }}:
      </h1>
      <div
        class="row"
        style="margin-left: 5px;
        margin-right: 5px;margin-top:10px;"
        v-if="isSearching"
      >
        <div class="card" style="width:100%;">
          <Loading msg="Press enter to search" />
        </div>
      </div>
      <!-- error display -->
      <div
        class="row"
        style="margin-top: 10px;margin-left:5px;margin-right:5px;"
        v-if="error && !isSearching"
      >
        <div class="card" style="width:100%;">
          <p class="center-text">Error loading Pokémon</p>
        </div>
      </div>
      <!-- only show if pokemons have been retrieved -->
      <div class="flex-wrap" v-if="pokemons && !error && !isSearching">
        <pokemonCard
          v-for="(pokemon, index) in pokemons"
          :key="index"
          :index="index + 1"
          :name="pokemon.name"
          :comparison="comparison || null"
        />
      </div>
      <div
        class="row"
        id="showIfLoadingRequest"
        style="margin-left: 5px;
margin-right: 5px;margin-bottom:10px;display:none"
      >
        <div class="card" style="width:100%;">
          <Loading msg="Loading More Pokemons..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchIcon from "vue-ionicons/dist/md-search.vue";
import heart from "vue-ionicons/dist/md-heart-empty.vue";
import pokemonCard from "~/components/pokemonCard.vue";
import Loading from "~/components/Loading.vue";
export default {
  components: {
    searchIcon,
    pokemonCard,
    Loading,
    heart
  },
  methods: {
    async loadMoreResults() {
      if (this.error) {
        //If an existing error, I'm not going to process again
        return;
      }
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
    },
    travel(destination) {
      this.$router.push(destination);
    },
    searchBegin(e) {
      if (e.target.value.length > 0) {
        //Show it doesn't show when searching
        document.getElementById("showIfLoadingRequest").style.display = "none";
        this.isSearching = true;
      } else {
        this.isSearching = false;
      }
    },
    onScroll() {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !this.error
      ) {
        //I'm aware I can use v-if, I just wanted to demonstrate I can use vanilla javascript, too.
        document.getElementById("showIfLoadingRequest").style.display = "flex";
        this.loadMoreResults();
      }
    },
    searchSubmit(e) {
      e.preventDefault();
      this.travel(`/pokemon/${this.searchQuery}`);
    }
  },
  //This is asyncData (renders on the server - better for SEO.)
  async asyncData({ app, query }) {
    //App is param here so I can get the processGet function defined in the plugin
    //Default obj, regardless of request status
    let obj = {
      offset: 15, //How many pokemons have already been rendered (need this so on next request it gets the right ones)
      pokemons: false,
      error: true,
      comparison: false,
      isSearching: false,
      searchQuery: null
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
      if (query && query.comparison) {
        obj2.comparison = query.comparison;
      }
      return { ...obj, ...obj2 };
    }
  },
  mounted() {
    document.getElementById("showIfLoadingRequest").style.display = "none";
    window.addEventListener("scroll", this.onScroll);
    document.body.addEventListener("touchmove", this.onScroll);
  }
};
</script>

<style scoped>
.above-search {
  margin-left: 5px;
  font-size: 17px;
  fill: #bdc3c7;
  margin-bottom: 10px;
}

.above-search:hover {
  fill: #fff;
  color: #fff;
  cursor: pointer;
}
.favourite-icon {
  height: 17px;
  width: 17px;
}
.above-search p {
  margin: 0;
}
</style>
