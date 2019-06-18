import React, { Component } from 'react'
import Web3 from 'web3'
import Input from 'components/Input'
import Button from 'components/Button'
import Message from 'components/Message'

import './SmartContractExecution.scss'

class SmartContractExecution extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      abi: '',
      contractAddress: '',
      to: '',
      amount: '',
      txHash: null,
      receipt: null,
      error: null,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.from !== prevState.from) {
      return { from: nextProps.from }
    }
    return null
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSmartContractExecution = () => {
    const { from, contractAddress, to, amount, abi } = this.state
    const web3 = new Web3(ethereum)
    // const myContract = new web3.eth.Contract(JSON.parse(abi), contractAddress)
    // window.myContract = myContract
    // myContract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).send({ from: this.props.from })
    //   .once('transactionHash', (transactionHash) => {
    //     console.log('txHash', transactionHash)
    //     this.setState({ txHash: transactionHash })
    //   })
    //   .once('receipt', (receipt) => {
    //     console.log('receipt', receipt)
    //     this.setState({ receipt: JSON.stringify(receipt) })
    //   })
    //   .once('error', (error) => {
    //     console.log('error', error)
    //     this.setState({ error: error.message })
    //   })
    const data = web3.eth.abi.encodeFunctionCall({
      name: 'transfer',
      type: 'function',
      inputs: [{
        type: 'address',
        name: 'recipient',
      }, {
        type: 'uint256',
        name: 'amount',
      }],
    }, [to, web3.utils.toWei(amount, 'ether')])

    web3.eth.sendTransaction({
      from,
      to: contractAddress,
      data,
    })
      .once('transactionHash', (transactionHash) => {
        console.log('txHash', transactionHash)
        this.setState({ txHash: transactionHash })
      })
      .once('receipt', (receipt) => {
        console.log('receipt', receipt)
        this.setState({ receipt: JSON.stringify(receipt) })
      })
      .once('error', (error) => {
        console.log('error', error)
        this.setState({ error: error.message })
      })
  }

  callContractFunction = () => {
    const { method } = this.state
    const getData = myContract[method].getData();
    web3.eth.call({ to: Contractaddress, data: getData }, (err, result) => {
      console.log(err, result)
    })
  }

  render() {
    const { from, abi, contractAddress, to, amount, txHash, receipt, error } = this.state
    return (
      <div className="SmartContractExecution">
        <h2>Token Transfer</h2>
        <p className="SmartContractExecution__guide">
          Will send a transaction to the smart contract and execute its method. Note that this can alter the smart contract state.
        </p>
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
          placeholder="Account you logged in metamask"
          readOnly
        />
        <Input
          name="to"
          label="To"
          value={to}
          onChange={this.handleChange}
          placeholder="Address you want to send Token"
        />
        <Input
          name="amount"
          label="Amount"
          value={amount}
          onChange={this.handleChange}
          placeholder="Amount of Eth you want to send"
        />
        <Input
          name="contractAddress"
          label="Contract Address (Token Address)"
          value={contractAddress}
          onChange={this.handleChange}
          placeholder="The address of the deployed smart contract"
        />
        <Button
          title="Contract Execute"
          onClick={this.handleSmartContractExecution}
        />
        <div className="SmartContractDeploy__txResult">
          <h3 className="SmartContractDeploy__txResultTitle">Transaction Result</h3>
          {error && (
            <Message
              message={error}
              type="error"
            />
          )}
          {txHash && (
            <Message
              message={txHash}
              type="txHash"
            />
          )}
          {receipt && (
            <Message
              message={receipt}
              type="receipt"
            />
          )}
        </div>
      </div>
    )
  }
}

export default SmartContractExecution
