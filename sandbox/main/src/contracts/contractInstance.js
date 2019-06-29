import web3 from './web3';
const address = "0xbc4b492fbf7fe38df290d851594166f2424ae89b";
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_img",
				"type": "string"
			},
			{
				"name": "_userName",
				"type": "string"
			},
			{
				"name": "_shutterSpeedValue",
				"type": "string"
			},
			{
				"name": "_fNumber",
				"type": "string"
			},
			{
				"name": "_iso",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "NewPost",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCounter",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getHash",
		"outputs": [
			{
				"name": "img",
				"type": "string"
			},
			{
				"name": "userName",
				"type": "string"
			},
			{
				"name": "shutterSpeedValue",
				"type": "string"
			},
			{
				"name": "fNumber",
				"type": "string"
			},
			{
				"name": "iso",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
export default new web3.eth.Contract(abi, address);