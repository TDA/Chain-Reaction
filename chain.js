(function(){
	//cache all items for reuse
	var getById=function(id){
		return document.getElementById(id)||document.querySelector('#'+id+'');
	}
	/*var dummy=document.createElement('div');
	if(dummy.dataset===undefined){
		alert('shimming');
	Element.prototype.dataset={};
	}*/
	
	var start=getById('start');
	var selectorBox=getById('selector-box');
	var gamebox=getById('gamebox');
	var remove=getById('remove');
	addEvent(start,'click',gamestart,false);
	//addEvent(remove,'click',remHand,false);
	
	function gamestart(){
	var players=document.getElementById('players').value;
	var currPlayer=1;
	var playerArray=[];
	var gridSize=document.getElementById('gridsize').value;
	var gridSize2=gridSize*gridSize;
	addClass(selectorBox,'hidden');	
	removeClass(gamebox,'hidden');
	var k=1;
	for(var i=1;i<=gridSize;i++){
		for(var j=1;j<=gridSize;j++){
			var smallDiv=document.createElement('div');
			addClass(smallDiv,'smallgrid');
			//addClass(smallDiv,'burp');
			//smallDiv.setAttribute('id','grid'+k)
			smallDiv.setAttribute('data-contains',0);
			smallDiv.setAttribute('data-limit',checkPos(k,gridSize));
			smallDiv.setAttribute('data-player',0);
			smallDiv.id=k;
			smallDiv.innerHTML='&nbsp;';
			addEvent(smallDiv,'click',addBall,false);
			gamebox.appendChild(smallDiv);
			k++;
			
			//setAttribute('data-',);
		}
	}
	gamebox.style.width=(gridSize*40)+2+"px";
	gamebox.style.height=(gridSize*40)+2+"px";
	gamebox.className="player1";
	
	function isEmpty(obj){
			if(obj.length===0)
			return 1;
			
		}
	//Get players and other details within scope	
	function addBall(event){
		var event=event||Window.event;
		//alert(currPlayer);
		var grid=event.target;
		//var dataset=event.target.dataset;
		var gridOwner=event.target.getAttribute('data-player');
		var gridId=event.target.id;
		var limit=event.target.getAttribute('data-limit');
		var finished=0;
		if(gridOwner!=0)
			if(gridOwner!=currPlayer)
				return;
		
		var existingBalls=event.target.getAttribute('data-contains');
		//
		if(existingBalls>=limit){
			//existingBalls=1;
			finished=propagate(grid,gridSize);
		}
		else{
		++existingBalls;
		event.target.setAttribute('data-contains',existingBalls);
		//alert(event.target.dataset.contains);
		event.target.setAttribute('data-player',currPlayer);
		}
		
		if(finished==1)
			if(isGameOver()){
			alert('Game Over . Player '+currPlayer+' wins');
			window.location='';
			return;
			}
			else{
			//alert('game goes on');
			}
		
		
		
		/*var nextPlayer=currPlayer+1;
		var elt=document.querySelectorAll('.smallgrid[data-player="'+(nextPlayer)+'"]');
		if(!isEmpty(elt))
		currPlayer++;
		else{
		}*/
		
		/*currPlayer++;
		while(playerArray[currPlayer]==='ko')
			currPlayer++;
		
		if(currPlayer>players)
		currPlayer=1;
		*/
		
		do{
			currPlayer++;
			if(currPlayer>players)
			currPlayer=1;
		}while(playerArray[currPlayer]==='ko');
			
			
		
		
		gamebox.className='player'+currPlayer;
		
	}

	
	function isGameOver(){
		//var player=currPlayer;
		/*for(var i=1;i<=gridSize2;i++){
			//alert(player);
			if(getById(i).dataset.player!==0)
				if(getById(i).dataset.player!==player)
				return 0;
		}*/
		var count=0;
		for(var i=1;i<=players;i++){
		var elt=document.querySelectorAll('.smallgrid[data-player="'+i+'"]');
		if(!isEmpty(elt)){
			count++;		
			playerArray[i]='alive';
		}
		else{
			playerArray[i]='ko';
		}
		
		}
		//alert('counted'+count);
		if(count>1)
		return 0;
		else if(count==1)
		return 1;
	}
	
	
	
	
	function checkPos(x,size){
		var size2=size*size;
		var size=parseInt(size);
		//If corners return 1
		//we check this after edges, to make the calc of the size'th cell to not get overwritten later.it is both an edge and a corner.
		
		switch(x){
			case 1:
			case size:
			case size2:
			case size2+1-size:
			return 1;
		}
		//If edges return 2, might be easier way.
		//first row? || last row? || left column? || right column?
		if( (x<size) || (x>(size2+1-size)&&x<size2) || (x%size==1) || (x%size==0) )
			return 2;
		
		//for all other cells , 3 is limit
		return 3;
		
	}
	
	function propagate(elt,size,callback){
		//var elt=getById(id);
		
		var id=parseInt(elt.id);
		//alert('inside box '+id);
		var limit=parseInt(elt.getAttribute('data-limit'));
		var size=parseInt(size);
		var size2=size*size;
		elt.setAttribute('data-contains',parseInt(elt.getAttribute('data-contains'))+1);
		elt.setAttribute('data-player',currPlayer);
		//reset the balls, as limit has been reached, check once to be sure
		if(elt.getAttribute('data-contains')>limit){
			//reset the grid box to allow it for use by another player
			elt.setAttribute('data-contains',0);
			elt.setAttribute('data-player',0);
			
			//propagate the balls onto adjacent cells..doesnt matter if friend or foe, propagate happens.
			switch(limit){
				//corner cell, only propagates to adjacent cells, but have to find which corner, so that we decide which cells to propagate to.
				case 1://alert('1');
					if(id==1){
					propagate(getById(id+1),size);
					propagate(getById(id+size),size);
					}
					else if(id==size){
					propagate(getById(id-1),size);
					propagate(getById(id+size),size);
					}
					else if(id==size*size){
					propagate(getById(id-1),size);
					propagate(getById(id-size),size);
					}
					else{
					propagate(getById(id+1),size);
					propagate(getById(id-size),size);
					}
				break;
				//edges, right or left or top or bottom?
				case 2: //alert('2');
				if(id<size){
					//top
					propagate(getById(id+1),size);
					propagate(getById(id-1),size);
					propagate(getById(id+size),size);
				}
				else if(id>(size2+1-size)&&id<size2){
					propagate(getById(id+1),size);
					propagate(getById(id-1),size);
					propagate(getById(id-size),size);
				}
				else if(id%size==1){
					propagate(getById(id+1),size);
					propagate(getById(id+size),size);
					propagate(getById(id-size),size);
				}
				else if(id%size==0){
					propagate(getById(id-1),size);
					propagate(getById(id+size),size);
					propagate(getById(id-size),size);
				}
				
				break;
				// all cells, easiest case, propagate to top, bottom, left AND right.so.
				case 3: 
				//alert('prop');
				propagate(getById(id-size),size);
				propagate(getById(id+size),size);
				propagate(getById(id-1),size);
				propagate(getById(id+1),size);
				break;
				//check :P	
				default:
				alert('cry');
			}
			
		}
			
		
		return 1;
		}
	}
	/*function remHand(){
		removeClass(document.getElementsByClassName('burp')[0],'burp');
	}*/
})();

function addEvent(elt,evt,listenerfunc,capture){
	if(elt.addEventListener){
		elt.addEventListener(evt,listenerfunc,capture);
	}
	else if(elt.attachEvent){
		elt.attachEvent('on'+evt,listenerfunc);
	}
}

function addClass(elt,newClass){
	if(elt.classList){
		elt.classList.add(newClass);
	}
	else{
		if(elt.className==="")
			elt.className=newClass;
		else if(elt.className.indexOf(newClass)==-1){
			elt.className=newClass;
		}
		else
			elt.className+=" "+newClass;
	}
}

function removeClass(elt,oldClass){
	if(elt.classList){
		elt.classList.remove(oldClass);
	}
	else{
		if(elt.className==="")
			return;
		if(elt.className.indexOf(oldClass)!==-1){
			elt.className.replace(oldClass,' ');
		}
	}
}


