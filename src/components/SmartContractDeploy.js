import React, { Component } from 'react'
import Web3 from 'web3'

import Input from 'components/Input'
import Button from 'components/Button'
import Message from 'components/Message'

import './SmartContractDeploy.scss'

class SmartContractDeploy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      data: '',
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

  handleSmartContractDeploy = () => {
    const web3 = new Web3(ethereum)
    const { from, data } = this.state

    web3.eth.sendTransaction({
      from,
      data,
    }).on('transactionHash', (transactionHash) => {
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

  render() {
    const { from, data, txHash, receipt, error } = this.state
    return (
      <div className="SmartContractDeploy">
        <h2>Smart Contract Deploy</h2>
        <p className="SmartContractDeploy__guide">
          To get bytecode of contract, Use <a href="http://ide.klaytn.com/">Klaytn IDE</a> compile function
        </p>
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
          placeholder="From Address"
          readOnly
        />
        <Input
          name="data"
          label="Data (bytecode)"
          value={data}
          onChange={this.handleChange}
          placeholder="A bytecode of smart contract to be deployed."
        />
        <Button
          title="Deploy Contract"
          onClick={this.handleSmartContractDeploy}
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

export default SmartContractDeploy
