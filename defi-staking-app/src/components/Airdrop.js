import React, { Component } from 'react'

class Airdrop extends Component {
  // Airdrop to have a timer that counts down
  // initialize the countdown after our customers have stakes a certiain amount ... 50
  // timer funcitonality, countdown, startTimer, state - for time to work

  constructor() {
    super()
    this.state = { time: {}, seconds: 20 }
    this.timer = 0
    // this.startTimer = this.startTimer.bind(this)
    this.countDown = this.countDown.bind(this)
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000)
    }
  }

  countDown() {
    // 1. countdown one second at a time
    let seconds = this.state.seconds - 1
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    })

    // 2. stop counting when we hit zero
    if (seconds == 0) {
      clearInterval(this.timer)
    }
  }

  secondsToTime(secs) {
    let hours, seconds, minutes
    hours = Math.floor(secs / 3600)

    let devisor_for_minutes = secs % 3600
    minutes = Math.floor(devisor_for_minutes / 60)

    let devisor_for_seconds = devisor_for_minutes % 60
    seconds = Math.ceil(devisor_for_seconds)

    return {
      h: hours,
      m: minutes,
      s: seconds,
    }
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds)
    this.setState({ time: timeLeftVar })
  }

  airdropReleaseTokens() {
    let stakingB = this.props.stakingBalance
    if (stakingB >= '5000000000000000000') {
      this.startTimer()
    }
  }

  render() {
    this.airdropReleaseTokens()
    return (
      <div style={{ color: 'black' }}>
        {this.state.time.h}:{this.state.time.m}:{this.state.time.s}
      </div>
    )
  }
}

export default Airdrop
