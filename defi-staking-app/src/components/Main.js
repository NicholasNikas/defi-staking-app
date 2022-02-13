import React, { Component } from 'react'
import tether from '../tether.png'
import Airdrop from './Airdrop.js'

class Main extends Component {
  render() {
    const {
      tetherBalance,
      rwdBalance,
      stakingBalance,
      stakeTokens,
      unstakeTokens,
      decentralBank,
    } = this.props
    return (
      <div id='content' className='mt-3'>
        <table className='table text-muted text-center'>
          <thead>
            <tr style={{ color: 'white' }}>
              <th scope='col'>Staking Balance</th>
              <th scope='col'>Reward Balance</th>
            </tr>
          </thead>
          <tbody style={{ color: 'white' }}>
            <tr>
              <td>{window.web3.utils.fromWei(stakingBalance, 'Ether')} USDT</td>
              <td>{window.web3.utils.fromWei(rwdBalance, 'Ether')} RWD</td>
            </tr>
          </tbody>
        </table>
        <div className='card mb-2' style={{ opacity: '.9' }}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const amount = window.web3.utils.toWei(
                this.input.value.toString(),
                'Ether'
              )
              stakeTokens(amount)
            }}
            className='mb-3'
          >
            <div style={{ borderSpacing: '0 1em' }}>
              <label className='float-left' style={{ marginLeft: '15px' }}>
                <b>Stake Tokens</b>
              </label>
              <span className='float-right' style={{ marginRight: '8px' }}>
                Balance: {window.web3.utils.fromWei(tetherBalance)}
              </span>
              <div className='input-group mb-4'>
                <input
                  ref={(input) => {
                    this.input = input
                  }}
                  type='text'
                  placeholder='0'
                  required
                />
                <div className='input-group-open'>
                  <div className='input-group-text'>
                    <img src={tether} alt='tether' height='32' />
                    &nbsp;&nbsp;&nbsp;USDT
                  </div>
                </div>
              </div>
              <button
                type='submit'
                className='btn btn-primary btn-lg btn-block'
              >
                DEPOSIT
              </button>
            </div>
          </form>
          <button
            className='btn btn-primary btn-lg btn-block'
            type='submit'
            onClick={(event) => {
              event.preventDefault()
              unstakeTokens()
            }}
          >
            WITHDRAW
          </button>
          <div className='card-body text-center' style={{ color: 'blue' }}>
            AIRDROP
            <Airdrop
              stakingBalance={stakingBalance}
              decentralBank={decentralBank}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Main
