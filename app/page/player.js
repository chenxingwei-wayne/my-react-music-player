import React from 'react'
import Progress from '../component/progress'
import './player.less'
import {Link} from 'react-router'
import Pubsub from 'pubsub-js'
import { PLAYTYPE_LIST } from '../config/playTypeList'
let duration = null;
class Player extends React.Component{
	constructor(props) {
		super(props);
         this.state = {
             progress: 0,
             volume: 0,
             isPlay: true,
             leftTime: '',
             playType:'NORMAL',
             playTypeList:PLAYTYPE_LIST
         };
         this.play = this.play.bind(this);
         this.reCycle=this.reCycle.bind(this);
     }

     formatTime(time){
     	let minutes=Math.floor(time/60);
     	let seconds = Math.floor(time%60);
     	seconds=seconds<10?`0${seconds}`:seconds;
     	return `${minutes}:${seconds}`;
     }
     componentDidMount(){
     	var _this = this;
		$('#player').bind($.jPlayer.event.timeupdate, (e)=>{
			duration=e.jPlayer.status.duration;
			//  每次调用setstate都会触发组件更新，调用render函数
			_this.setState({
				volume: e.jPlayer.options.volume*100,
				progress:e.jPlayer.status.currentPercentAbsolute,
				leftTime:this.formatTime(duration*(1-e.jPlayer.status.currentPercentAbsolute/100))
			});
		});
     }

     componentWillUnMount(){
		$('#player').unbind($.jPlayer.event.timeupdate);
	}
	progressChangeHandler(progress){
		console.log('from root widget',progress);
		$('#player').jPlayer('play',duration*progress);
	}

	changeVolumeHandler(progress){
		$('#player').jPlayer('volume', progress);
	}
	play(){
		console.log(this.state.isPlay)
		if(this.state.isPlay){
			$("#player").jPlayer("pause");
		}
		else{
			$("#player").jPlayer("play");
		}
		this.setState({
			isPlay: !this.state.isPlay
		});
		console.log(this.state.isPlay)
	}
	playPrev(){
		Pubsub.publish('PLAY_PREV');
	}
	playNext(){
		Pubsub.publish('PLAY_NEXT');
	}
	findPlayTypeIndex(playType){
		return this.state.playTypeList.indexOf(playType)
	}
	reCycle(){
		var playType = this.state.playType;
		var index = this.findPlayTypeIndex(playType)
		var newIndex = (index+1)%3
		playType= this.state.playTypeList[newIndex]
		this.setState({
			playType: playType
		})
		// 这里如果直接打印还是没有更新的playType
		console.log(this.state.playType)
		// 所以这里publish的时候用上面playType
		Pubsub.publish('RECYCLE',playType)
	}
	render(){
		return(
			/*<div className="player-page">
				<Progress barColor="#ff0028" progress={this.state.progress} onProgressChange={this.progressChangeHandler}></Progress>
			</div>*/
			<div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
                					<Progress progress={this.state.volume} onProgressChange={this.changeVolumeHandler} barColor="#aaa"> </Progress>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px', marginTop:10}}>
                			 <Progress progress={this.state.progress} onProgressChange={this.progressChangeHandler} ></Progress>

                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playPrev}></i>
	                			<i className={`icon ml20 ${this.state.isPlay?'pause':'play'}`} onClick={this.play}></i>
	                			<i className="icon next ml20" onClick={this.playNext}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.state.playType==='SINGLE'?'once':(this.state.playType==='NORMAL'?'cycle':'random')}`} onClick={this.reCycle}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                	</div>
                </div>
            </div>
			);
	}
}
export default Player;