import React from 'react'

import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './root'
import _ from 'lodash';

render(<AppContainer>
			<Root></Root>
		</AppContainer>,
		document.getElementById('root'));


if(module.hot){
	module.hot.accept('./root',()=>{
		const NewRoot = require('./root').default;
		render(
			<AppContainer>
				<NewRoot/>
			</AppContainer>,
			document.getElementById('root')
		);
	});
}

// add the image to my existing div
/*function component(){
	var myIcon = new Image();
	myIcon.src=Icon;
	var element = document.getElementById('webpacktest');
	element.appendChild(myIcon);
	return element;
}

document.body.appendChild(component())*/
	


 function component() {
   var element = document.createElement('div');
   var button = document.createElement('button');
   var br = document.createElement('br');

   button.innerHTML = 'Click me and look at the console!';
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.appendChild(br);
   element.appendChild(button);
   // 直接这样导入要报错，需要安装stage-0这个preset包。
   	button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
     var print = module.default;

     print();
   });

    return element;
  }

  document.body.appendChild(component());
