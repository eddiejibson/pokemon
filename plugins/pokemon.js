//Simple wrapper for the API and various other functions that are required globally.
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

vue.use((vm) => {
  vm.prototype.$processGet = processGet;
});

export default ({
  app
}) => {
  app.$processGet = processGet;
} //Needs to be injected into app for server side rendering - can't just go into the vm
