import React, { Component } from 'react'
import caver from 'klaytn/caver'
import Input from 'components/Input'
import Button from 'components/Button'
import Message from 'components/Message'
import './ValueTransfer.scss'

class ValueTransferFD extends Component {
  state = {
    from: '',
    senderPrivateKey: '',
    to: '',
    value: '',
    feePayerAddress: '0x80Fa56B456E2dF8A2D069Ead6F7C975e2685c87a',
    feePayerPrivateKey: '0x7a9e8024d21e60f17bc095ac7e5d35384c2c9bc1eb07f407f43652736327037e',
    txHash: null,
    receipt: null,
    error: null,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleValueTransferFD = async () => {
    const { from, senderPrivateKey, to, value, feePayerAddress, feePayerPrivateKey } = this.state

    const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_VALUE_TRANSFER',
      from,
      to,
      gas: '300000',
      value: caver.utils.toPeb(value, 'KLAY'),
    }, senderPrivateKey)

    caver.klay.accounts.wallet.add(feePayerPrivateKey, feePayerAddress)

    caver.klay.sendTransaction({
      senderRawTransaction,
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
    const { from, senderPrivateKey, to, value, feePayerAddress, feePayerPrivateKey, txHash, receipt, error } = this.state
    return (
      <div className="ValueTransfer">
        <h2>Value Transfer (Fee Delegation)</h2>
        <p>
          Klaytn 기반에서 작동하는 기능으로, 현재 메타마스크에 로그인된 Account와는 관계없습니다.<br />
          KlaytnWallet에서 계정을 새로 생성한 후 테스트 해주세요.
        </p>
        <Input
          name="from"
          label="From"
          value={from}
          onChange={this.handleChange}
          placeholder="From Address"
        />
        <Input
          name="senderPrivateKey"
          label="Sender PrivateKey (임시 Input. 추후 Kaikas내에 내장될 것으로 예상)"
          value={senderPrivateKey}
          onChange={this.handleChange}
          placeholder="Sender PrivateKey"
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
        <h3>Fee Payer</h3>
        <Input
          name="feePayerAddress"
          label="Fee Payer Address (임시 Input. 추후 Kaikas내에 내장될 것으로 예상)"
          value={feePayerAddress}
          onChange={this.handleChange}
          placeholder="Fee Payer Address"
          readOnly
        />
        <Input
          name="feePayerPrivateKey"
          label="Fee Payer PrivateKey (임시 Input. 추후 Kaikas내에 내장될 것으로 예상)"
          value={feePayerPrivateKey}
          onChange={this.handleChange}
          placeholder="Fee Payer PrivateKey"
          readOnly
        />
        <Button
          title="Value Transfer (Fee Delegation)"
          onClick={this.handleValueTransferFD}
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

export default ValueTransferFD
