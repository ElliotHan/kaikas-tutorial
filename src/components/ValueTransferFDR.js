import React, { Component } from 'react'
import Caver from 'caver-js'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'
import Message from 'components/Message'
import FeeDelegation from 'components/FeeDelegation'
import './ValueTransfer.scss'

class ValueTransferFDR extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      to: '',
      value: '',
      ratio: '',
      memo: '',
      senderAddress: '',
      senderRawTransaction: null,
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

  handleSignTransaction = async () => {
    const caver = new Caver(klaytn)
    const { from, to, value, ratio, memo, feePayerAddress, feePayerPrivateKey } = this.state

    const dataMemo = memo === '' ? {} : { data: memo }
    const txData = {
      type: this.props.isMemo ? 'FEE_DELEGATED_VALUE_TRANSFER_MEMO_WITH_RATIO' : 'FEE_DELEGATED_VALUE_TRANSFER_WITH_RATIO',
      from,
      to,
      feeRatio: ratio,
      gas: '300000',
      value: caver.utils.toPeb(value, 'KLAY'),
      ...dataMemo,
    }
    console.log('txData', txData)

    const { rawTransaction: senderRawTransaction} = await caver.klay.signTransaction(txData)

    this.setState({
      senderAddress: from,
      senderRawTransaction
    })
  }

  render() {
    const {
      from,
      to,
      value,
      ratio,
      memo,
      senderAddress,
      senderRawTransaction,
    } = this.state

    return (
      <div className="ValueTransfer">
        <div className="ValueTransferFD__sender">
          <h3>Sender</h3>
          <Input
            name="from"
            label="From"
            value={senderAddress || from}
            placeholder="From Address"
            readOnly
          />
          <Input
            name="to"
            label="To"
            value={to}
            onChange={this.handleChange}
            placeholder="To Address"
          />
          <Input
            name="value"
            label="Value"
            value={value}
            onChange={this.handleChange}
            placeholder="Value (KLAY)"
          />
          <Input
            name="ratio"
            label="Fee Ratio"
            value={ratio}
            onChange={this.handleChange}
            placeholder="Fee Ratio (%)"
          />
          {this.props.isMemo && (
            <Input
              name="memo"
              label="Memo"
              value={memo}
              onChange={this.handleChange}
              placeholder="Memo"
            />
          )}
          <Button
            title="Sign Transaction"
            onClick={this.handleSignTransaction}
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

export default ValueTransferFDR
