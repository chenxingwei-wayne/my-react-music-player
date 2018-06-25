import React from 'react'
import './progress.less'

class Progress extends React.Component{
	changeProgress(e){
		let progressBar = this.refs.progressBar;
		let progress = (e.clientX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
		console.log(progress)
		this.props.onProgressChange && this.props.onProgressChange(progress);
	}

	constructor(props){
		super(props);
		this.changeProgress = this.changeProgress.bind(this);
	}
	render(){
		return (
			<div className="components-progress" ref="progressBar"  onClick={this.changeProgress}>
				<div className="progress" style={{width:`${this.props.progress}%`, background:this.props.barColor}} ></div>
			</div>
		);
	}
}
Progress.defaultProps={
    barColor:'#2f9842'
};
export default Progress;