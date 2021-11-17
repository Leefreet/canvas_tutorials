import "./style.less"
import background from '../assets/images/step1.webp';
import mp4 from '../assets/videos/video.mp4';

import React, {Component} from 'react';
import {Rnd} from "react-rnd";


class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      width: 320,
      height: 192,
      x: 0,
      y: 0
    };
    this.video = React.createRef()
    this.canvas = React.createRef()
    this.init = false;
  }

  componentDidMount() {
    this.video.current.addEventListener('play', this.play, false);
  }
  componentWillUnmount() {
    this.video.current.removeEventListener('play', this.play, false);
  }

  drag = (e, {x, y}) => {
    this.init = false
    const {current, current: {paused, ended}} = this.video;
    const ctx = this.canvas.current.getContext('2d');
    if (paused || ended) {
      let img = new Image();
      img.src = background;
      ctx.drawImage(img, 0, 0)
      const {width, height} = this.state;
      ctx.drawImage(current, x, y, width, height);
      ctx.fillStyle = '#f00';
      ctx.fillRect(x, height + y, width - 2, 2)
    }
    this.setState({x, y})
  }
  resize = (e, direction, ref, delta, {x, y}) => {
    this.init = false
    const {offsetWidth, offsetHeight} = ref;
    const {current, current: {paused, ended}} = this.video;
    const ctx = this.canvas.current.getContext('2d');
    if (paused || ended) {
      let img = new Image();
      img.src = background;
      ctx.drawImage(img, 0, 0)
      ctx.drawImage(current, x, y, offsetWidth, offsetHeight);
      ctx.fillStyle = '#f00';
      ctx.fillRect(x, offsetHeight + y, offsetWidth - 2, 2)
    }
    this.setState({width: offsetWidth, height: offsetHeight, x, y})
  }

  play = () => {
    const {current, current: {paused, ended}} = this.video;
    const ctx = this.canvas.current.getContext('2d');
    const {x, y, width, height} = this.state
    if (paused || ended) {
      return;
    }
    if (!this.init) {
      let img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0)
      }
      img.src = background;
      ctx.fillStyle = 'transparent';
      ctx.fillRect(x, height + y, width - 2, 2)
      this.init = true;
    } else {
      ctx.drawImage(current, x, y, width, height);
      ctx.fillStyle = '#f00';
      ctx.fillRect(x, height + y, width - 2, 2)
    }
    setTimeout(() => {
      this.play()
    }, 0)
  }

  onClick = () => {
    const {step} = this.state
    if (step === 0) {
      this.video.current.play();
      this.setState({step: 2});
      this.init = false
    } else if (step === 1) {
      this.video.current.play();
      this.setState({step: 2})
      this.init = false
    } else {
      this.video.current.pause();
      this.setState({step: 1})
      this.init = false
    }
  }

  render() {
    const {step, width, height, x, y} = this.state
    let hint = step === 0 && "开始" || step === 1 && "播放" || "暂停"

    return (
      <div style={{width: 360, height: '100%', display: "flex", flexDirection: "column", alignItems: "center"}}>
        <video ref={this.video} src={mp4} controls={true} id="myVideo" style={{display: "none"}} crossOrigin={"anonymous"} />
        <canvas ref={this.canvas} width={360} height={640} id="myCanvas" style={{border: '1px dotted #000000', marginBottom: 16}}/>
        <Rnd
          size={{width, height}}
          position={{x, y}}
          onDrag={this.drag}
          onResize={this.resize}
        >
          <div style={{position: "absolute", zIndex: 1000, border: this.init ? '1px dotted #000' : 'none', width, height}} />
        </Rnd>
        <button onClick={this.onClick} style={{color: '#fff', background: '#00ace7', border: '#00ace7', borderRadius: 4, cursor: "pointer", padding: '4px 16px'}} >{hint}</button>
      </div>
    );
  }
}

export default Example;