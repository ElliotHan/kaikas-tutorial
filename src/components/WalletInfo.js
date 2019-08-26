import React from 'react'
import { KLAY_FAUCET } from 'constants/url'

import './WalletInfo.scss'

const WalletInfo = ({ address, balance }) => {
  // TODO: Move logic for checking balance
  console.log('address', address,'balance', balance)
  return (
    <div className="WalletInfo">
      <h2 className="WalletInfo__title">Wallet Information</h2>
      <div className="WalletInfo__infoBox">
        <div className="WalletInfo__info">
          <span className="WalletInfo__label">Wallet Address</span>
          {address || 'Login with Kaikas :)'}
          {/* TODO: Copy button */}
        </div>
        <div className="WalletInfo__info">
          <span className="WalletInfo__label">Balance</span>
          <span className="WalletInfo__balance">{balance}</span>
          <span className="WalletInfo__unit">KLAY</span>
          <button>새로고침</button>
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
