import React, { PureComponent } from 'react'
import Caver from 'caver-js'
import { isNull } from 'lodash';
import Input from 'components/Input';
import Button from 'components/Button';
import TxResult from 'components/TxResult';
import './FeeDelegation.scss'

class FeeDelegation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      feePayerAddress: props.feePayerAddress,
      feePayerPrivateKey: '0x7a9e8024d21e60f17bc095ac7e5d35384c2c9bc1eb07f407f43652736327037e',
      txHash: null,
      receipt: null,
      error: null,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.feePayerAddress !== prevState.feePayerAddress) {
      return { feePayerAddress: nextProps.feePayerAddress }
    }
    return null
  }

  // handleChange = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   })
  // }

  sendTransaction = () => {
    const { feePayerAddress, feePayerPrivateKey } = this.state
    const caver = new Caver(window.klaytn)
    console.log('senderRawTransaction', this.props.senderRawTransaction)
    caver.klay.sendTransaction({
      senderRawTransaction: this.props.senderRawTransaction,
      feePayer: feePayerAddress,
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
    const { feePayerAddress, txHash, receipt, error } = this.state
    return (
      <div className="FeeDelegation">
        <h3 className="FeeDelegation__title">Fee Payer</h3>
        <Input
          name="feePayerAddress"
          label="Fee Payer Address"
          value={feePayerAddress}
          // onChange={this.handleChange}
          placeholder="Fee Payer Address"
          readOnly
        />
        {/* <Input
          name="feePayerPrivateKey"
          label="Fee Payer PrivateKey"
          value={feePayerPrivateKey}
          onChange={this.handleChange}
          placeholder="Fee Payer PrivateKey"
        /> */}
        <Button
          title="Send Transaction"
          onClick={this.sendTransaction}
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

export default FeeDelegation