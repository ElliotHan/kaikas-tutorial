import React, { Component } from 'react'
import Caver from 'caver-js'

import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'
import BytecodeExample from 'components/BytecodeExample'

import './SmartContractDeploy.scss'

class SmartContractDeploy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      data: '',
      value: 0,
      gas: '3000000',
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
    const caver = new Caver(klaytn)
    const { from, data, gas, value } = this.state
    
    caver.klay.sendTransaction({
      type: 'SMART_CONTRACT_DEPLOY',
      from,
      data,
      gas,
      value: caver.utils.toPeb(value.toString(), 'KLAY'),
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

  render() {
    const { from, data, gas, value, txHash, receipt, error } = this.state
    return (
      <div className="SmartContractDeploy">
        <BytecodeExample />
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
        <Input
          name="value"
          label="Value"
          value={value}
          onChange={this.handleChange}
          placeholder="Value (KLAY)"
        />
        <Input
          name="gas"
          label="Gas"
          value={gas}
          onChange={this.handleChange}
          placeholder="Gas you willing to pay for contract deploy"
        />
        <Button
          title="Deploy Contract"
          onClick={this.handleSmartContractDeploy}
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

export default SmartContractDeploy
