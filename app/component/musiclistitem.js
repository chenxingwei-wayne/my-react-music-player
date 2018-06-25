import React from 'react';
import './musiclistitem.less'
import Pubsub from 'pubsub-js'
class MusicListItem extends React.Component{
	playMusic(musicItem){
		Pubsub.publish('PLAY_MUSIC',musicItem);
	}
	deleteMusic(musicItem){
		// 禁止事件的冒泡，不然也会出发播放事件
		e.stopPropagation();
		Pubsub.publish('DELETE_MUSIC', musicItem);
	}
 	render(){
 		let musicItem = this.props.musicItem;
 		return(
 			<li onClick={this.playMusic.bind(this,musicItem)} className={`components-musiclistitem row ${this.props.focus?'focus':''}`}>	
 				<p><strong>{musicItem.title}</strong>-{musicItem.artist}</p>
 				<p onClick={this.deleteMusic.bind(this,musicItem)} className="-col-auto delete"></p>	
 			</li>
 		);
 	}
}

export default MusicListItem;