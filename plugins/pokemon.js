//Very simple wrapper to handle API requests (and other tasks that are required globally) that I wrote myself
import vue from "vue"; //So I can export the functions into the vue vm 
import axios from "axios";
const api = "https://pokeapi.co/api/v2"; //Now when the only thing that needs to be passed into the processGet function is the endpoint and not the whole URL. It also means it can easily be changed later.

export const processGet = async (endpoint) => {
  let url = `${api}${endpoint}`;
  let res = await axios.get(url).catch((err) => {
    //Some error handling the request, reject the promise
    console.error("An unexpected error occured in processing the reqeuest to endpoint", endpoint, (err.error || err));
    return Promise.reject(err);
  });
  return res;
}

export const getThumbIndex = (index) => {
  let indexLength = (Math.log(parseInt(index)) * Math.LOG10E + 1) | 0; //Thumb is in the format of 000 - if we pass in just a 1 for example, going to break. So I need to calculate how many zeros to put before (if any)
  if (indexLength != 0) {
    indexLength = 3 - indexLength;
    let thumb = String(index);
    for (let i = 0; i < indexLength; i++) {
      thumb = "0" + thumb;
    }
    return thumb;
  } else {
    return String(index);
  }
}

export const getFavourites = () => {
  let favourites = localStorage.getItem("favourites");
  if (!favourites) {
    return false;
  } else {
    return JSON.parse(favourites);
  }
}

export const saveFavourite = ({
  id,
  name
}) => {
  let index = String(id); //key won't be ints now and thus wont be sorted as such
  let favourites = getFavourites() || [];
  if (favourites.length <= 0) {
    let obj = {};
    obj[index] = {
      name: name
    }
    favourites.push(obj);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  } else if (!favourites[0][index]) {
    favourites[0][index] = {
      name: name
    };
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }
}

export const removeFavourite = ({
  id
}) => {
  let index = String(id);
  let favourites = getFavourites() || [];
  if (favourites.length > 0) {
    if (favourites[0][index]) {
      delete favourites[0][index];
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }
}

vue.use((vm) => {
  vm.prototype.$processGet = processGet;
  vm.prototype.$getThumbIndex = getThumbIndex;
  vm.prototype.$getFavourites = getFavourites;
  vm.prototype.$saveFavourite = saveFavourite;
  vm.prototype.$removeFavourite = removeFavourite;
});

export default ({
  app
}) => {
  app.$processGet = processGet;
  app.$getThumbIndex = getThumbIndex;
} //Needs to be injected into app for server side rendering - can't just go into the vm
