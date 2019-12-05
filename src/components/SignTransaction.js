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
      value: '',
      data: '',
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
    const { from, to, data, gas, value } = this.state
    const { rawTransaction } = await caver.klay.signTransaction({
      from,
      to,
      data: data,
      gas,
      value,
    })
    this.setState({ rawTransaction })
  }

  render() {
    const {
      from,
      to,
      data,
      value,
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
            name="value"
            label="Value"
            value={value}
            onChange={this.handleChange}
            placeholder="Value (KLAY)"
          />
          <Input
            name="data"
            label="Data"
            value={data}
            onChange={this.handleChange}
            placeholder="Data"
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
