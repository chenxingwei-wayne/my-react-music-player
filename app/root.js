import React from 'react'
import { Router, IndexRoute, Link, Route, browserHistory, hashHistory} from 'react-router';
//import { BrowserRouter ,Route ,Switch } from 'react-router-dom';
import Header from './component/header'
import Player from './page/player'
import MusicList from './page/musiclist'
import { MUSIC_LIST } from './config/musiclist'
import { PLAYTYPE_LIST } from './config/playTypeList'
import Pubsub from 'pubsub-js'



 class App extends React.Component{
	constructor(props)
	{
		super(props);
		this.state = {
				musicList: MUSIC_LIST,
             currentMusicItem: MUSIC_LIST[0],
             playType: '',
             playTypeList: PLAYTYPE_LIST
         }
	}
	playMusic(musicItem){
		$("#player").jPlayer('setMedia',{
			mp3: musicItem.file
		}).jPlayer('play');
		this.setState({
			currentMusicItem: musicItem
		});
	}
	playNext(type="next"){
		let index= this.findMusicIndex(this.state.currentMusicItem);
		let newIndex=null;
		let musicListLength = this.state.musicList.length;
		if(type==="next"){
			newIndex=(index+1)%musicListLength;

		}else{
			newIndex=(index-1+musicListLength)%musicListLength;
		}
		this.playMusic(this.state.musicList[newIndex]);
	}
	findTypeIndex(playType){
		return this.state.playTypeList.indexOf(playType)
	}
	// 实现控制音乐播放，模式的功能。
	reCycle(playType){
		console.log("playType",playType)
		this.setState({
			playType: playType
		})

	}
	findMusicIndex(musicItem){
		return this.state.musicList.indexOf(musicItem);
	}
	componentDidMount(){
		$('#player').jPlayer({
			/*ready:function(){
				
				$(this).jPlayer('setMedia',{
					mp3: 'http://oj4t8z2d5.bkt.clouddn.com/%E9%AD%94%E9%AC%BC%E4%B8%AD%E7%9A%84%E5%A4%A9%E4%BD%BF.mp3'
				}).jPlayer('play');
			},*/
			supplied: 'mp3',
			wmode: 'window'
		});
		this.playMusic(this.state.currentMusicItem );
		$("#player").bind($.jPlayer.event.ended, e=>{
			/*this.playNext();*/
			var playType = this.state.playType
			if(playType==="NORMAL"){
				this.playNext()
			}else if(playType==="SINGLE"){
				this.playMusic(this.state.currentMusicItem)
			}else {
				var random = Math.floor(Math.random()*(3+1)+0);
				this.playMusic(this.state.musicList[random]);
			}
		})
		Pubsub.subscribe('DELETE_MUSIC',(msg, musicItem)=>{
			this.setState({
				musicList: this.state.musicList.filter(item=>{
					return item !==musicItem;
				})
			});
		});

		Pubsub.subscribe('PLAY_MUSIC',(msg, musicItem)=>{
			this.playMusic(musicItem);
		});
		Pubsub.subscribe('PLAY_PREV',(msg, musicItem)=>{
			this.playNext('prev');
		});
		Pubsub.subscribe('PLAY_NEXT',(msg, musicItem)=>{
			this.playNext();
		});
		Pubsub.subscribe('RECYCLE',(msg,playType)=>{
			
			console.log("监听到的：",playType)
			this.reCycle(playType);

		});
	}
	componentWillUnMount(){
		Pubsub.unsubscribe('DELETE_MUSIC');
		Pubsub.unsubscribe('PLAY_MUSIC');
		$("#player").unbind($.jPlayer.event.ended);
		Pubsub.unsubscribe('PLAY_PREV');
		Pubsub.unsubscribe('PLAY_NEXT');
	}
	render(){
		return(
			<div>
				<Header></Header>
				{React.cloneElement(this.props.children,this.state)}
				
			</div>
		);
	}
}

class Root extends React.Component{

	render(){
		return(
			<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Player}></IndexRoute>
				<Route path="/list" component={MusicList}></Route>
			</Route>
			</Router>
		);
	}

	
}
export default Root;