import React, { Component } from 'react'
import Caver from 'caver-js'
import Input from 'components/Input'
import Button from 'components/Button'
import FeeDelegation from 'components/FeeDelegation'
import Message from 'components/Message'
import BytecodeExample from 'components/BytecodeExample'

import './SmartContractExecution.scss'

class SmartContractExecutionFD extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      data: '',
      value: 0,
      gas: '3000000',
      ratio: '',
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

  signTransaction = async () => {
    const caver = new Caver(window.klaytn)
    const { from, data, gas, ratio, value } = this.state
    const { feeRatio } = this.props

    const renderFeeRatio = feeRatio ? { feeRatio: ratio } : {}

    const txData = {
      type: feeRatio ? 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY_WITH_RATIO' : 'FEE_DELEGATED_SMART_CONTRACT_DEPLOY',
      from,
      data,
      gas,
      value: caver.utils.toPeb(value.toString(), 'KLAY'),
      ...renderFeeRatio,
    }

    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction(txData)

    this.setState({
      senderAddress: from,
      senderRawTransaction
    })
  }

  render() {
    const { from, data, gas, ratio, value, senderRawTransaction } = this.state
    return (
      <div className="SmartContractDeploy">
        <BytecodeExample />
        <div className="SmartContractDeployFD__sender">
          <Input
            name="from"
            label="From (Sender Address)"
            value={from}
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
          {this.props.feeRatio  && (
            <Input
              name="ratio"
              label="Fee Ratio"
              value={ratio}
              onChange={this.handleChange}
              placeholder="Fee Ratio (%)"
            />
          )}
          <Button
            title="Sign Transaction"
            onClick={this.signTransaction}
          />
          {senderRawTransaction && (
            <Message
              type="rawTransaction"
              message={JSON.stringify(senderRawTransaction)}
            />
          )}
        </div>
        <FeeDelegation
          senderRawTransaction={senderRawTransaction}
          feePayerAddress={from}
        />
      </div>
    )
  }
}

export default SmartContractExecutionFD
