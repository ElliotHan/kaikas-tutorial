import React, { Component } from 'react'
import caver from 'klaytn/caver'

import Input from 'components/Input'
import Button from 'components/Button'
import TxResult from 'components/TxResult'

import './SmartContractExecution.scss'

class SmartContractExecutionFD extends Component {
  state = {
    from: '',
    senderPrivateKey: '',
    to: '',
    amount: '',
    contractAddress: '',
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

  handleSmartContractExecution = async () => {
    const { from, senderPrivateKey, to, amount, contractAddress, feePayerAddress, feePayerPrivateKey } = this.state

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

    const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from,
      to: contractAddress,
      gas: '300000',
      data,
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
    const { from, senderPrivateKey, to, amount, contractAddress, feePayerAddress, feePayerPrivateKey, txHash, receipt, error } = this.state
    return (
      <div className="SmartContractExecution">
        <h2>Token Transfer (Fee Delegation)</h2>
        <p className="SmartContractExecution__guide">
          Klaytn 기반에서 작동하는 기능으로, 현재 메타마스크에 로그인된 Account와는 관계없습니다.<br />
          KlaytnWallet에서 계정을 새로 생성한 후 테스트 해주세요.
        </p>
        <Input
          name="from"
          label="From (Sender Address)"
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
          placeholder="Address you want to send Token"
        />
        <Input
          name="amount"
          label="Amount"
          value={amount}
          onChange={this.handleChange}
          placeholder="Amount of Eth you want to send"
        />
        <Input
          name="contractAddress"
          label="Contract Address (Token Address)"
          value={contractAddress}
          onChange={this.handleChange}
          placeholder="The address of the deployed smart contract"
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
          title="Token Transfer (Fee Delegation)"
          onClick={this.handleSmartContractExecution}
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

export default SmartContractExecutionFD
