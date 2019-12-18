import web3 from './web3';
import lotteryData from './deployInfo.json'
const {address,abi}=lotteryData;

export default new web3.eth.Contract(JSON.parse(abi),address);