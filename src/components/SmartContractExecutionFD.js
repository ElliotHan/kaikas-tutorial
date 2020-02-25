import React, { Component } from 'react'
import Caver from 'caver-js'
import Input from 'components/Input'
import Button from 'components/Button'
import FeeDelegation from 'components/FeeDelegation'
import Message from 'components/Message'

import './SmartContractExecution.scss'

class SmartContractExecutionFD extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractAddress: '',
      amount: '',
      from: props.from,
      to: '',
      ratio: '',
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

  signTransaction = async () => {
    const caver = new Caver(window.klaytn)
    const { from, to, amount, contractAddress, ratio } = this.state
    const { feeRatio } = this.props

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
    console.log('data', data)

    const renderFeeRatio = feeRatio ? { feeRatio: ratio } : {}

    const txData = {
      type: feeRatio ? 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION_WITH_RATIO' : 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from,
      to: contractAddress,
      gas: '3000000',
      data,
      ...renderFeeRatio,
    }
    console.log('txData', txData)

    const { rawTransaction: senderRawTransaction } = await caver.klay.signTransaction(txData)

    this.setState({
      senderAddress: from,
      senderRawTransaction
    })
  }

  render() {
    const {
      contractAddress,
      amount,
      from,
      to,
      ratio,
      senderRawTransaction,
    } = this.state
    return (
      <div className="SmartContractExecution">
        <p className="SmartContractExecution__guide">
          Ryan token: 0x453b77027874071b9f85742052006db4c97e9278
          <br />
          Apeach token: 0x1543cd6bf3097ba0b5a6d8c6f0c74ae7564bfcdb
        </p>
        <div className="SmartContractExecutionFD__sender">
          <Input
            name="from"
            label="From (Sender Address)"
            value={from}
            placeholder="From Address"
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
            name="contractAddress"
            label="Contract Address (Token Address)"
            value={contractAddress}
            onChange={this.handleChange}
            placeholder="The address of the deployed smart contract"
          />
          <Input
            name="amount"
            label="Amount"
            value={amount}
            onChange={this.handleChange}
            placeholder="Amount of Eth you want to send"
          />
          {this.props.feeRatio  && (
            <Input
              name="ratio"
              label="Fee Ratio"
              value={ratio}
              onChange={this.handleChange}
              placeholder="Ratio"
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
