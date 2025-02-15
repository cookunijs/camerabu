//imports the Web3 API
import Web3 from './web3.min.js';
// var contract = new web3js.eth.Contract(contractABI, contractAddress);

/**
 * creates & exports new instance for
 * Web3 using provided service by Metamask.
 */
let currentWeb3 = new Web3("https://ropsten.infura.io");
// let currentWeb3;
// if (window.ethereum) {
//     let instance = new Web3(window.ethereum);
//     try {
//         // Request account access if needed
//         window.ethereum.enable();
//         // Acccounts now exposed
//         currentWeb3 = instance;
//     } catch (error) {
//         // User denied account access...
//         alert('Please allow access for the app to work');
//     }
// } else if (window.web3) {
//     currentWeb3 = new Web3(web3.currentProvider);
//     // Acccounts always exposed
//     resolve(currentWeb3);
// } else {
//     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
// }

export default currentWeb3;