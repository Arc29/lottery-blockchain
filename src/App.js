import React, { Component } from 'react';
import './styles/App.css';
import Web3 from 'web3'
import web3 from './web3'
import lottery from './lottery'


class App extends Component{
state={
  manager:'',
  players:[],
  balance:'',
  value:'',
  lastWinner:''
}
updateParams = async() =>{
  const players=await lottery.methods.getPlayers().call();
  const balance=await web3.eth.getBalance(lottery.options.address)
  const lastWinner=await lottery.methods.lastWinner().call();
  this.setState({players,balance,lastWinner})
}

async componentDidMount(){
  const manager=await lottery.methods.manager().call();
  
  this.setState({manager});
  this.updateParams();
}

onSubmit = async(event) =>{
  event.preventDefault()

  const accounts=await web3.eth.getAccounts();

  this.setState({message:'Waiting for transaction to process...'})
  await lottery.methods.enter().send({
    from:accounts[0],
    value:web3.utils.toWei(this.state.value,'ether')
  })
  this.setState({message:'Transaction completed successfully!'})
  this.updateParams();
}

onClick = async(event) =>{

  const accounts=await web3.eth.getAccounts();

  this.setState({message:'Waiting for transaction to process...'})
  await lottery.methods.pickWinner().send({
    from:accounts[0]
  })
  this.setState({message:'A winner has been selected!'})
  this.updateParams();
}

  render(){
  window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            
        } catch (error) {
            console.log("Permission denied!")
            
        }
    }
    
});
return (
    
  <div className="App">
  <h2>Lottery Contract</h2>
  <p>This contract is managed by {this.state.manager}. 
     <br/>Currently {this.state.players.length} players have entered and prize pool is {web3.utils.fromWei(this.state.balance,'ether')} ether.
     <br/>The last winner was {this.state.lastWinner}
  </p>
  <hr/>
  <h4>Try your luck!</h4>
  <form onSubmit={this.onSubmit}>
  <label>Amount to enter:</label>
  <input
  value={this.state.value}
  onChange={event=>{this.setState({value:event.target.value})}}
  />
  <button>Enter</button>
  </form>
  <hr/>
  <h4>Ready to pick a winner?</h4>
  <button onClick={this.onClick}>Pick a winner</button>
  <hr/>
  <br/>{this.state.message}
  </div>
); 
}
}

export default App;
