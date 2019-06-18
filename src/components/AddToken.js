import React, { Component } from 'react'

import Input from 'components/Input'
import Button from 'components/Button'

import './AddToken.scss'

class AddToken extends Component {
  state = {
    tokenAddress: '',
    tokenSymbol: '',
    tokenDecimals: '',
    tokenImage: '',
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleAddToken = () => {
    const { tokenAddress, tokenSymbol, tokenDecimals, tokenImage } = this.state
    ethereum.sendAsync({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
      id: Math.round(Math.random() * 100000),
    }, (err, result) => console.log(err, result))
  }

  addExampleToken = () => {
    console.log('add Example?')
    this.setState({
      tokenAddress: '0x617b3f8050a0bd94b6b1da02b4384ee5b4df13f4',
      tokenSymbol: 'MARK',
      tokenDecimals: 18,
      tokenImage: 'https://pbs.twimg.com/profile_images/802481220340908032/M_vde_oi_400x400.jpg',
    }, () => this.handleAddToken())
  }

  render() {
    const { tokenAddress, tokenSymbol, tokenDecimals, tokenImage } = this.state
    return (
      <div className="AddToken">
        <section className="AddToken__section">
          <h2>Sample Token</h2>
          <div className="AddToken__sample">
            <img
              className="AddToken__sampleImage"
              alt="MetaMarks"
              src="https://pbs.twimg.com/profile_images/802481220340908032/M_vde_oi_400x400.jpg"
            />
            <div className="AddToken__sampleContent">
              <p className="AddToken__sampleName">MetaMarks (MARK)</p>
              <p className="AddToken__sampleAddress">0x617b3f8050a0bd94b6b1da02b4384ee5b4df13f4</p>
              <p className="AddToken__sampleDecimals">Decimals: 18</p>
              <Button
                title="Add to metamask"
                onClick={this.addExampleToken}
              />
            </div>
          </div>
        </section>
        <section className="AddToken__section">
          <h2>Custom Token</h2>
          <Input
            name="tokenAddress"
            label="Token Address"
            value={tokenAddress}
            onChange={this.handleChange}
            placeholder="Token Address"
          />
          <Input
            name="tokenSymbol"
            label="Token Symbol"
            value={tokenSymbol}
            onChange={this.handleChange}
            placeholder="Token Symbol"
          />
          <Input
            name="tokenDecimals"
            label="Token Decimals"
            value={tokenDecimals}
            onChange={this.handleChange}
            placeholder="Token Decimals"
          />
          <Input
            name="tokenImage"
            label="Token Image (url)"
            value={tokenImage}
            onChange={this.handleChange}
            placeholder="Type url of Image"
          />
          <Button
            title="Add to metamask"
            onClick={this.handleAddToken}
          />
        </section>
      </div>
    )
  }
}

export default AddToken
