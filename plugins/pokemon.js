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

vue.use((vm) => {
  vm.prototype.$processGet = processGet;
  vm.prototype.$getThumbIndex = getThumbIndex;
});

export default ({
  app
}) => {
  app.$processGet = processGet;
  app.$getThumbIndex = getThumbIndex;
} //Needs to be injected into app for server side rendering - can't just go into the vm
