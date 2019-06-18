import React, { Component } from 'react'
import caver from 'klaytn/caver'
import Input from 'components/Input'
import Button from 'components/Button'
import Message from 'components/Message'
import './ValueTransfer.scss'

class CreateHRA extends Component {
  state = {
    from: '',
    senderPrivateKey: '',
    to: '',
    value: '',
    txHash: null,
    receipt: null,
    error: null,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  createHRA = () => {
    window.caver = caver
    const { from, senderPrivateKey, to, value } = this.state
    const publicKey = caver.klay.accounts.privateKeyToPublicKey(senderPrivateKey)

    // Mission.1
    const transaction = {
      type: 'ACCOUNT_CREATION',
      from,
      to: `${to}.klaytn`,
      humanReadable: true,
      publicKey,
      gas: '4040000000',
      value: 1000,
    }
    console.log('transaction', transaction)

    caver.klay.accounts.wallet.add(senderPrivateKey, from)

    caver.klay.sendTransaction(transaction)
      .once('transactionHash', (txHash) => {
        console.log('txHash', txHash)
        this.setState({ txHash })
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
    const { from, senderPrivateKey, to, value, txHash, receipt, error } = this.state
    return (
      <div className="ValueTransfer">
        <h2>HRA Create Account</h2>
        <p>Klaytn 기반에서 작동하는 기능으로, 현재 메타마스크에 로그인된 Account와는 관계없습니다.<br />
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
          label="Human Readable Account (HRA)"
          value={to}
          onChange={this.handleChange}
          placeholder="5 ~ 13 characters"
        />
        <Input
          name="value"
          label="Value"
          value={value}
          onChange={this.handleChange}
          placeholder="Value (KLAY)"
        />
        <Button
          title="Create HRA"
          onClick={this.createHRA}
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

export default CreateHRA


