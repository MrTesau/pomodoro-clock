class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: "Session",
      enabled: false,
      url: 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
    };

  }

  // Function to convert time in seconds
  // returns minutes: seconds
  convertTime = (count) => {
    let min = Math.floor(count / 60);
    let sec = count % 60;
    sec = sec < 10 ? "0" + sec : sec;
    return min + ":" + sec;
  }

  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      //changed for testing 25 * 60
      clockCount: 2,
      currentTimer: "Session",
      enabled: false
    });
    clearInterval(this.intervalID);
  };

  // SESSION + - might need to be floored when changed
  // or may need to add to setstate
  handleSessionIncrease = (e) => {
    if (e.target.value === "Break Length") {
      this.setState({
        breakCount: this.state.breakCount + 1
      });
    } else if (e.target.value == "Session Length") {
      this.setState({
        sessionCount: this.state.sessionCount + 1
      });
    }
  };

  //function for heandling decrease break length
  handleSessionDecrease = (e) => {
    if (e.target.value === "Break Length") {
      this.setState({
        breakCount:
          this.state.breakCount > 1
            ? this.state.breakCount - 1
            : this.state.breakCount
      });

    } else if (e.target.value == "Session Length") {
      let newTime = this.state.sessionCount - 1;
      let newSec = newTime * 60;
      // bandaid
      newSec = newSec < 60 ? 60 : newSec;
      this.setState({
        sessionCount: this.state.sessionCount > 1 ? newTime : this.state.sessionCount,
        clockCount: this.state.currentTimer === "Session" ? newSec : this.state.clockCount
      })
    }

  };

  // these functions must be states as es6 arrow functions
  // did not work with es5 declarations

  handlePlay = () => {
    this.setState({
      enabled: true
    })
    this.intervalID = setInterval(this.tick, 1000)

  }

  tick = () => {
    if (this.state.clockCount > 0) {
      this.setState({
        clockCount: this.state.clockCount - 1
      })
    } else {
      this.setState({
        clockCount: this.state.currentTimer === "Session" ? this.state.breakCount * 60 : this.state.sessionCount * 60,
        currentTimer: this.state.currentTimer === "Session" ? "Break" : "Session"
      })
      this.audio.play();
    }

  }


  stop = () => {
    clearInterval(this.intervalID);
    this.setState({
      enabled: false
    })
  }

  render() {
    // destructure state to obtain values
    const { breakCount, sessionCount, currentTimer, clockCount, enabled } = this.state;
    const audio = this.state.url;

    const clockProps = {
      convert: this.convertTime,
      reset: this.handleReset,
      enable: enabled,
      count: clockCount,
      title: currentTimer,
      handlePressPlay: this.handlePlay,
      handlePressPause: this.stop

    };

    const breakProps = {
      title: "Break Length",
      count: breakCount,
      handleDecrease: this.handleSessionDecrease,
      handleIncrease: this.handleSessionIncrease
    };

    const sessionProps = {
      title: "Session Length",
      count: sessionCount,
      handleDecrease: this.handleSessionDecrease,
      handleIncrease: this.handleSessionIncrease
    };


    return (
      <div>
        <h1 id="title"> Pomodoro Clock </h1>
        <div className="flex">
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>
        <div>
          <ClockDisplay {...clockProps} />
        </div>
        {/* is it necessary to embed audio is jsx..?*/}
        <audio
          ref={ref => this.audio = ref}
          src={audio}
        />
      </div>
    );
  }
}

// Dumb timer component
const SetTimer = (props) => (
  <div className="timerContainer">
    <h1>{props.title}</h1>
    <div className="flex actions-wrapper">
      <button onClick={props.handleDecrease} value={props.title}>
        <i className="fas fa-minus" />
      </button>
      <span>{props.count}</span>
      <button onClick={props.handleIncrease} value={props.title}>
        <i className="fas fa-plus" />
      </button>
    </div>
  </div>
);

class ClockDisplay extends React.Component {
  render() {
    const play = <button onClick={this.props.handlePressPlay}>
      <i className="fas fa-play" />
    </button>
    const pause = <button onClick={this.props.handlePressPause}>
      <i className="fas fa-pause" />
    </button>

    return (
      <div className="clockContainer">
        <h2>{this.props.title}</h2>
        <span className="displayTime">{this.props.convert(this.props.count)}</span>
        <br />
        { this.props.enable === false ? play : pause}
        <button onClick={this.props.reset}>
          <i className="fas fa-sync" />
        </button>
      </div>
    );

  }
}

export default App;
