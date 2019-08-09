import React, { Component } from 'react'
import Caver from 'caver-js'
import Web3 from 'web3'
import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'
import Message from 'components/Message'
import './ValueTransfer.scss'

class ValueTransferFD extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'default',
      from: props.from,
      to: '',
      value: '',
      rawTransaction: null,
      feePayerAddress: '0x80Fa56B456E2dF8A2D069Ead6F7C975e2685c87a',
      feePayerPrivateKey: '0x7a9e8024d21e60f17bc095ac7e5d35384c2c9bc1eb07f407f43652736327037e',
      txHash: null,
      receipt: null,
      error: null,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleValueTransferFD = async () => {
    const caver = new Caver(klaytn)
    const { from, to, value, feePayerAddress, feePayerPrivateKey } = this.state

    const signedTransaction = await caver.klay.signTransaction({
      type: 'FEE_DELEGATED_VALUE_TRANSFER_WITH_RATIO',
      from,
      to,
      gas: '300000',
      value: caver.utils.toPeb(value, 'KLAY'),
      feeRatio: 20,
    })
    const senderRawTransaction = signedTransaction.rawTransaction
    console.log('senderRawTransaction', senderRawTransaction)
    this.setState({ senderRawTransaction })
    console.log('signedTransaction', signedTransaction)
  }

  handelSendTransactionFromFeePayer = () => {
    const caver = new Caver(klaytn)
    const { feePayerAddress, feePayerPrivateKey, senderRawTransaction } = this.state

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

  handleSigning = () => {
    const web3 = new Web3(ethereum)
    window.web3 = web3
    var text = 'hello!'
    var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
    // var msg = '0x1' // hexEncode(text)
    console.log(msg)
    var from = web3.eth.accounts[0]
    console.log('from', from)
    if (!from) return connect()

    /*  web3.personal.sign not yet implemented!!!
    *  We're going to have to assemble the tx manually!
    *  This is what it would probably look like, though:
      web3.personal.sign(msg, from) function (err, result) {
        if (err) return console.error(err)
        console.log('PERSONAL SIGNED:' + result)
      })
    */

    console.log('CLICKED, SENDING PERSONAL SIGN REQ')
    var params = [msg, from]
    var method = 'personal_sign'

    web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, result) {
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)
      console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

      console.log('recovering...')
      const msgParams = { data: msg }
      msgParams.sig = result.result

      method = 'personal_ecRecover'
      var params = [msg, result.result]
      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function (err, result) {
        var recovered = result.result
        console.log('ec recover called back:')
        console.dir({ err, recovered })
        if (err) return console.error(err)
        if (result.error) return console.error(result.error)


        if (recovered === from ) {
          console.log('Successfully ecRecovered signer as ' + from)
        } else {
          console.log('Failed to verify signer when comparing ' + result + ' to ' + from)
        }

      })
    })
  }

  render() {
    const {
      from,
      to,
      value,
      senderRawTransaction,
      feePayerAddress,
      feePayerPrivateKey,
      txHash,
      receipt,
      error,
    } = this.state
    return (
      <div className="ValueTransfer">
        <h2>Value Transfer (Fee Delegation)</h2>
        <p></p>
        <div className="ValueTransfer__sender">
          <h3>Sender</h3>
          <Input
            name="from"
            label="From"
            value={from}
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
          <Button
            title="Request Signing to Kaikas"
            onClick={this.handleValueTransferFD}
          />
          {senderRawTransaction && (
            <Message
              type="rawTransaction"
              message={senderRawTransaction}
            />
          )}
        </div>
        <div className="ValueTransfer__feePayer">
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
            title="Send Transaction From FeePayer"
            onClick={this.handelSendTransactionFromFeePayer}
          />
          <TxResult
            txHash={txHash}
            receipt={receipt}
            error={error}
          />
        </div>
        
      </div>
    )
  }
}

export default ValueTransferFD
