import React from 'react'
import MusicListItem from '../component/musiclistitem'
class MusicList extends React.Component{
	render(){
		let listEle = null;
		listEle = this.props.musicList.map((item)=>{
			return(
				<MusicListItem focus={item === this.props.currentMusicItem} key={item.id} musicItem={item}>
					{item.title}
				</MusicListItem>
			); 
		});
		return(
				<ul>
					{listEle}
				</ul>
			);
	}
}

export default MusicList;