//blockchain.js
require('dotenv').config();
const { ethers } = require('ethers');

const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = require('./contractABI.json'); // export ABI from Remix

const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function addRecord(hash) {
    const tx = await contract.addRecord(hash);
    await tx.wait();
    console.log("Record added:", tx.hash);
    return tx.hash;
}

async function getRecord(id) {
    return await contract.getRecord(id);
}

module.exports = { addRecord, getRecord };
