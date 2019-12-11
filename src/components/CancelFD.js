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
    const { from, nonce } = this.state

      const txData = {
        type: 'FEE_DELEGATED_CANCEL',
        from,
        nonce,
        gas: '300000',
      }
  
      const { rawTransaction: senderRawTransaction} = await caver.klay.signTransaction(txData)
  
      this.setState({
        senderAddress: from,
        senderRawTransaction
      })
  }

  render() {
    const { from, nonce, senderRawTransaction } = this.state
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
