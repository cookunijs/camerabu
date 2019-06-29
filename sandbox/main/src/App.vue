<template>
  <div id="app">
    <div style="display: flex; flex-direction: column;">
      <!-- Upload Interface -->
      <div id="upload">
        <div v-if="this.$root.$data.loading === false">
          <img src="../assets/image/logo.svg" alt="ロゴ" class="title-logo">

          <!-- Form for file choose, caption text and submission -->
          <form class="margin-sm" @submit.stop.prevent="handleSubmit">
            <div class="border-style">
              <b-form-file plain @change="captureFile"/>
            </div>
            <div class="form-metadata">
              <input type="text" v-model="userName" class="input-form" placeholder="ニックネーム">
              <input type="text" v-model="fNumber" class="input-form" placeholder="F値">
              <input
                type="text"
                v-model="shutterSpeedValue"
                class="input-form"
                placeholder="シャッタースピード"
              >
              <input type="text" v-model="iso" class="input-form" placeholder="ISO値">
            </div>
            <b-button class="margin-xs" variant="secondary" @click="handleOk">投稿</b-button>
          </form>
        </div>
        <div v-if="this.$root.$data.loading === true" style="margin-top: 10%; margin-bottom: 5%">
          <img class="upload-load" src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif">
        </div>
      </div>

      <!-- Posts Interface -->
      <ul class="home-list">
        <section class="photo-contents">
          <li v-for="item in this.$root.$data.currentPosts" :key="item.key" :item="item">
            <!-- Card UI for post's image & caption text -->
            <b-card border-variant="secondary" :img-src="item.src">
              <p>
                <span class="photo-card__meta-text">F</span>
                <span class="photo-card__meta-text--value">{{ item.fNumber }}</span>
                <span class="photo-card__meta-text">ShutterSpeed</span>
                <span class="photo-card__meta-text--value">{{ item.shutterSpeedValue }}</span>
                <span class="photo-card__meta-text">ISO</span>
                <span class="photo-card__meta-text--value">{{ item.iso }}</span>
                <br>
                <span class="username">@{{ item.userName }}</span>
              </p>
            </b-card>
          </li>
        </section>
      </ul>
    </div>
  </div>
</template>

<script>
import ipfs from "./contracts/ipfs";
import contract from "./contracts/contractInstance";
import web3js from "./contracts/web3";

export default {
  name: "App",
  // data variables
  data() {
    return {
      buffer: "",
      userName: "",
      shutterSpeedValue: "",
      fNumber: "",
      iso: ""
    };
  },
  methods: {
    /* used to catch chosen image &
     * convert it to ArrayBuffer.
     */
    captureFile(file) {
      const reader = new FileReader();
      if (typeof file !== "undefined") {
        reader.readAsArrayBuffer(file.target.files[0]);
        reader.onloadend = async () => {
          this.buffer = await this.convertToBuffer(reader.result);
        };
      } else this.buffer = "";
    },
    /**
     * converts ArrayBuffer to
     * Buffer for IPFS upload.
     */
    async convertToBuffer(reader) {
      return Buffer.from(reader);
    },
    /**
     * submits buffered image & text to IPFS
     * and retrieves the hashes, then store
     * it in the Contract via sendHash().
     */
    async onSubmit() {
      this.$root.loading = true;
      let imgHash;
      let userNameHash;
      let shutterSpeedValueHash;
      let fNumberHash;
      let isoHash;
      ipfs
        .add(this.buffer)
        .then(hashedImg => {
          imgHash = hashedImg[0].hash;
          console.log("imgHash: " + imgHash);
          return this.convertToBuffer(this.userName);
        })
        .then(bufferDesc =>
          ipfs.add(bufferDesc).then(hashedName => {
            userNameHash = hashedName[0].hash;
            return this.convertToBuffer(this.shutterSpeedValue);
          })
        )
        .then(bufferDesc =>
          ipfs.add(bufferDesc).then(hashedshutterSpeedValue => {
            shutterSpeedValueHash = hashedshutterSpeedValue[0].hash;
            return this.convertToBuffer(this.fNumber);
          })
        )
        .then(bufferDesc =>
          ipfs.add(bufferDesc).then(hashedfNumber => {
            fNumberHash = hashedfNumber[0].hash;
            return this.convertToBuffer(this.iso);
          })
        )
        .then(bufferDesc =>
          ipfs.add(bufferDesc).then(hashedIso => {
            isoHash = hashedIso[0].hash;
          })
        )
        .then(async () => {
          const query = this.$root.contract.methods.sendHash(
            imgHash,
            userNameHash,
            shutterSpeedValueHash,
            fNumberHash,
            isoHash
          );
          //Sender Address
          var process_env_address =
            "0xbF49a6fF10E9C4Cf5fd9942F6a5C7fB40FCc0Fa0";
          //Sender Privatekey
          var process_env_privkey =
            "0xCF3F5DB122AF0326A9D2308898F6CA70325448EB62CB800A51B8981F9266DBB4";

          const contractAddress = "0xbc4b492fbf7fe38df290d851594166f2424ae89b";
          const encodedABI = query.encodeABI();
          console.log(encodedABI);
          const signedTx = await web3js.eth.accounts.signTransaction(
            {
              data: encodedABI,
              from: process_env_address,
              gas: 600000,
              gasPrice: 10000000000,
              to: contractAddress
            },
            process_env_privkey,
            false
          );
          console.log(signedTx);
          await web3js.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .then(function(val) {
              console.log(val);
              console.log("Done!");
            });
          console.log("Operation Finished! Refetching...");
          this.$root.getPosts();
        });
    },
    /**
     * validates if image & captions
     * are filled before submission.
     */
    handleOk() {
      if (!this.buffer || !this.userName) {
        alert("Please fill in the information.");
      } else {
        this.onSubmit();
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  color: #2c3e50;
  margin-top: 3%;
}
.home-load {
  width: 50px;
  height: 50px;
}
.title-logo {
  width: 240px;
}

.card img {
  object-fit: cover;
  width: 240px;
  height: 240px;
}
.card {
  text-align: left;
  margin: 20px;
  border: none;
  /* width: 240px; */
}
.card-body {
  padding: 8px;
}
.home-list {
  padding: 0;
  list-style: none;
}
.home-card-text {
  text-align: justify;
  margin-top: 10px;
}

#upload {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  width: 720px;
}
.form-metadata {
  /* display: flex; */
}

input[type="file"] {
  border-radius: 4px;
  margin: 0 auto;
  /* max-width: 673px; */
  width: 673px;
}
.form-control-file {
  background: #eee;
}
.input-form {
  margin-right: 4px;
  height: 28px;
  padding: 8px;
  background: #f5f8f9;
  border: #f5f8f9 1px solid;
  border-radius: 4px;
}

.input-form::placeholder {
  color: #a6a6a6;
}

.input-form:focus {
  border: #6edda6 1px solid;
  outline: none;
}

.upload-load {
  width: 50px;
  height: 50px;
}
.margin-xs {
  margin-top: 3%;
}
.margin-sm {
  margin-top: 7%;
}
.border-style {
  margin: 0 0 16px;
}
.btn-secondary {
  background: #6edda6;
  border: none;
  font-weight: bold;
}
.btn-secondary:hover {
  background: #7df0b6;
  color: #fff;
  border: none;
}
.photo-card__meta-text {
  color: #666;
}
.photo-card__meta-text--value {
  color: #222;
  font-weight: bold;
}
.username {
  color: #666;
}

@media screen and (max-width: 648px) {
  .title-logo {
    margin-top: 24px;
    width: 144px;
  }
  #upload {
    width: 300px;
    margin-bottom: 24px;
  }

  input[type="file"] {
    border-radius: 4px;
    margin: 0 auto;
    /* max-width: 673px; */
    width: 300px;
  }
  .input-form {
    margin: 0 4px 4px 0;
    height: 28px;
    padding: 8px;
  }

  .photo-contents li:nth-of-type(2n + 1) {
    margin-right: 8px;
  }

  .card {
    margin: 0;
    width: 160px;
  }

  .card img {
    width: 160px;
    height: 160px;
  }
}
</style>