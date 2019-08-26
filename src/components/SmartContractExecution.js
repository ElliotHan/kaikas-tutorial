import React, { Component } from 'react'
import Caver from 'caver-js'

import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'

import './SmartContractExecution.scss'

class SmartContractExecution extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      to: '',
      amount: '',
      contractAddress: '',
      gas: '',
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
    const { from, contractAddress, to, amount, gas } = this.state
    const caver = new Caver(klaytn)
    const data = caver.klay.abi.encodeFunctionCall({
      name: 'transfer',
      type: 'function',
      inputs: [{
        type: 'address',
        name: 'recipient',
      }, {
        type: 'uint256',
        name: 'amount',
      }],
    }, [to, caver.utils.toPeb(amount, 'KLAY')])

    caver.klay.sendTransaction({
      from,
      to: contractAddress,
      data,
      gas,
    })
      .on('transactionHash', (transactionHash) => {
        console.log('txHash', transactionHash)
        this.setState({ txHash: transactionHash })
      })
      .on('receipt', (receipt) => {
        console.log('receipt', receipt)
        this.setState({ receipt: JSON.stringify(receipt) })
      })
      .on('error', (error) => {
        console.log('error', error)
        this.setState({ error: error.message })
      })
  }

  /* callContractFunction = () => {
    const { method } = this.state
    const getData = myContract[method].getData();
    web3.eth.call({ to: Contractaddress, data: getData }, (err, result) => {
      console.log(err, result)
    })
  } */

  render() {
    const { from, to, amount, contractAddress, gas, txHash, receipt, error } = this.state
    return (
      <div className="SmartContractExecution">
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
        <Input
          name="gas"
          label="Gas"
          value={gas}
          onChange={this.handleChange}
          placeholder="Gas"
        />
        <Button
          title="Contract Execute"
          onClick={this.handleSmartContractExecution}
        />
        <TxResult
          txHash={txHash}
          receipt={receipt}
          error={error}
        />
      </div>
    )
  }
}

export default SmartContractExecution
