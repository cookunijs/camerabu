import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'babel-polyfill';
import
{
  Nav, Image, Card, Layout, Button, Modal, FormFile,
}
  from 'bootstrap-vue/es/components';
import App from './App.vue';
import web3 from './contracts/web3';
import contract from './contracts/contractInstance';


/**
 * injects bootstrap libraries
 * in Vue instance.
 */
Vue.use(BootstrapVue);
Vue.use(Nav);
Vue.use(Image);
Vue.use(Card);
Vue.use(FormFile);
Vue.use(Layout);
Vue.use(Button);
Vue.use(Modal);

// Vue instance
new Vue({
  el: '#app',
  data: {
    currentPosts: [],
    currentAccount: '',
    loading: false,
    contract
  },
  /**
   * calls functions for getting
   * account & current posts.
   */
  async created() {
    await this.updateAccount();
    await this.getPosts();
  },
  transformToRequire: {
    img: 'src',
    image: 'xlink:href',
  },
  methods: {
    /**
     * gets current account on web3 and
     * store it on currentAccount variable.
     */
    async updateAccount() {
      this.currentAccount = "0xbF49a6fF10E9C4Cf5fd9942F6a5C7fB40FCc0Fa0";
    },
    /**
     * using the Smart Contract instance:
     * getCounter() - gets the length of total posts
     * getHash() - gets the image & text hashes using an index
     *
     * index is from the iteration of the retrieved total
     * post count. every loop gets the hashes and fetches
     * text & image using the IPFS gateway URL.
     */
    async getPosts() {
      this.loading = false;
      const posts = [];
      const counter = await contract.methods.getCounter().call({
        from: this.currentAccount,
      });

      if (counter !== null) {
        const hashes = [];
        const userNames = [];
        const shutterSpeedValues = [];
        const fNumbers = [];
        const isos = [];

        for (let i = counter; i >= 1; i -= 1) {
          hashes.push(contract.methods.getHash(i).call({
            from: this.currentAccount,
          }));
        }

        const postHashes = await Promise.all(hashes);

        for (let i = 0; i < postHashes.length; i += 1) {
          userNames.push(fetch(`https://gateway.ipfs.io/ipfs/${postHashes[i].userName}`)
            .then(res => res.text()));
        }
        const postUserNames = await Promise.all(userNames);

        for (let i = 0; i < postHashes.length; i += 1) {
          shutterSpeedValues.push(fetch(`https://gateway.ipfs.io/ipfs/${postHashes[i].shutterSpeedValue}`)
            .then(res => res.text()));
        }
        const postshutterSpeedValues = await Promise.all(shutterSpeedValues);

        for (let i = 0; i < postHashes.length; i += 1) {
          fNumbers.push(fetch(`https://gateway.ipfs.io/ipfs/${postHashes[i].fNumber}`)
            .then(res => res.text()));
        }
        const postFNumbers = await Promise.all(fNumbers);

        for (let i = 0; i < postHashes.length; i += 1) {
          isos.push(fetch(`https://gateway.ipfs.io/ipfs/${postHashes[i].iso}`)
            .then(res => res.text()));
        }
        const postIsos = await Promise.all(isos);


        for (let i = 0; i < postHashes.length; i += 1) {
          posts.push({
            id: i,
            key: `key${i}`,
            userName: postUserNames[i],
            shutterSpeedValue: postshutterSpeedValues[i],
            fNumber: postFNumbers[i],
            iso: postIsos[i],
            src: `https://gateway.ipfs.io/ipfs/${postHashes[i].img}`,
          });
        }

        this.currentPosts = posts;
        this.loading = false;
      }
    },
  },
  render: h => h(App),
});