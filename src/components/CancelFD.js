import React, { Component } from 'react'
import Caver from 'caver-js'
import Input from 'components/Input'
import Button from 'components/Button'
import FeeDelegation from 'components/FeeDelegation'
import Message from 'components/Message'

class CancelFD extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      nonce: null,
      ratio: '',
      senderAddress: '',
      senderRawTransaction: null,
      // txHash: null,
      // receipt: null,
      // error: null,
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

  handelSignTransaction = async() => {
    const caver = new Caver(klaytn)
    const { from, nonce, ratio } = this.state
    const { feeRatio } = this.props

    const renderFeeRatio = feeRatio ? { feeRatio: ratio } : {}

    const txData = {
      type: feeRatio? 'FEE_DELEGATED_CANCEL_WITH_RATIO' : 'FEE_DELEGATED_CANCEL',
      from,
      nonce,
      gas: '300000',
      ...renderFeeRatio,
    }

    const { rawTransaction: senderRawTransaction} = await caver.klay.signTransaction(txData)

    this.setState({
      senderAddress: from,
      senderRawTransaction
    })
  }

  render() {
    const { from, nonce, ratio, senderRawTransaction } = this.state
    return (
      <div className="ValueTransfer">
        <h3>Sender</h3>
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
          placeholder="From Address"
          readOnly
        />
        <Input
          name="nonce"
          label="Nonce"
          value={nonce}
          onChange={this.handleChange}
          placeholder="Nonce to cancel transaction"
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
          onClick={this.handelSignTransaction}
        />
        {senderRawTransaction && (
          <Message
            type="rawTransaction"
            message={JSON.stringify(senderRawTransaction)}
          />
        )}
        <FeeDelegation
          senderRawTransaction={senderRawTransaction}
          feePayerAddress={from}
        />
      </div>
    )
  }
}

export default CancelFD
