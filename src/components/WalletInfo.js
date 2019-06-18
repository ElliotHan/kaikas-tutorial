import React from 'react'
import { KLAY_FAUCET } from 'constants/url'

import './WalletInfo.scss'

const WalletInfo = ({ address, balance }) => {
  return (
    <div className="WalletInfo">
      <h2 className="WalletInfo__title">Wallet Information</h2>
      <div className="WalletInfo__infoBox">
        <div className="WalletInfo__info">
          <span>Wallet Address</span>
          {address}
        </div>
        <div className="WalletInfo__info">
          <span>Balance</span>
          {balance} ETH
        </div>
      </div>
      <p className="WalletInfo__faucet">
        If you need small amount of Klay for testing.
        <a
          className="WalletInfo__link"
          href={KLAY_FAUCET}
          target="_blank"
          rel="noreferrer noopener"
        >
        Run Klay Faucet
        </a>
      </p>
    </div>
  )
}

export default WalletInfo
