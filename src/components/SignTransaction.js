import React, { Component } from 'react'
import Input from 'components/Input'
import Button from 'components/Button'
import Message from 'components/Message'

import './SignTransaction.scss'

class SignTransaction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from: props.from,
      to: '',
      memo: '',
      gas: '3000000',
      rawTransaction: null,
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
    const { from, to, memo, gas } = this.state
    const { rawTransaction } = await caver.klay.signTransaction({
      from,
      to,
      data: memo,
      gas,
    })
    this.setState({ rawTransaction })
  }

  render() {
    const {
      from,
      to,
      memo,
      gas,
      rawTransaction,
    } = this.state

    return (
      <div className="SignTransaction">
        <div className="SignTransaction__sender">
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
            name="memo"
            label="Memo"
            value={memo}
            onChange={this.handleChange}
            placeholder="Memo"
          />
          <Input
            name="gas"
            label="Gas"
            value={gas}
            onChange={this.handleChange}
            placeholder="Gas"
          />
          <Button
            className="SignTransaction__button"
            title="Sign Transaction"
            onClick={this.signTransaction}
          />
          {rawTransaction && (
            <Message
              type="rawTransaction"
              message={JSON.stringify(rawTransaction)}
            />
          )}
        </div>
      </div>
    )
  }
}

export default SignTransaction
