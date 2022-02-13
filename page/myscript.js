
let ws = new WebSocket('wss://'+location.hostname)
let canvas=document.getElementById('canvas')
let ctx=canvas.getContext('2d')

let mario
let coin=new Image()
coin.src=coin_img
let money=0
let is_down=false
let coins=[]

function init(){
    ws.onopen = () => {
        console.log('open connection')
    }
    ws.onmessage=(e)=>{
        
        money=e.data
    }
    ws.onclose = () => {
        console.log('close connection')
    }
    mario=new imgobj(300,100)
    mario.addstyle(mario_img,{x:0,y:0},[])
    mario.scale.x=0.8
    mario.scale.y=0.8
    window.addEventListener('mousedown',down)
    /*window.addEventListener('touchstart',down)*/
    window.addEventListener('keydown',down)
    window.addEventListener('keyup',(e)=>{
        is_down=false
    })
    /*window.addEventListener('touchend',(e)=>{
        is_down=false
    })*/
    window.addEventListener('mouseup',(e)=>{
        is_down=false
    })
}
function update(){
    for(let i of coins){
        i.position.y-=2
        i.through-=0.03
        if(i.through<=0){
            coins.splice(coins.indexOf(i),1)
        }
    }

}
function down(){
    if(is_down===false){
        is_down=true
        ws.send('')
        let nc=new imgobj(385,70)
        nc.scale.x=0.03
        nc.scale.y=0.03
        nc.addstyle(coin_img,{x:0,y:0},[])
        coins.push(nc)
        /*let audio = new Audio("coin_sound.mp3");
        audio.play();*/
    }
}

function draw(){
    ctx.fillStyle='rgb(150,150,255)'
    ctx.fillRect(0,0,1000,700)
    mario.draw(ctx)
    ctx.fillStyle='white'
    ctx.drawImage(coin,10,10,30,30)
    for(let i of coins){
        i.draw(ctx)
    }
    ctx.font='30px Arial'
    ctx.fillText(money,40,35)

    requestAnimationFrame(draw)
}



class imgobj{
	constructor(px,py){
		this.position={x:px,y:py}
		this.rotation=0
		this.scale={x:1,y:1}
		this.through=1
		this.visible=true
		this.style=0
		this.styles=[]
		this.group=[]
	}
	draw(ctx_=ctx){
		if(this.visible){
			ctx_.save()
			ctx_.translate(this.position.x,this.position.y)
			ctx_.rotate(this.rotation)
			ctx_.scale(this.scale.x,this.scale.y)
			ctx_.globalAlpha=this.through
			ctx_.drawImage(this.styles[this.style].img,-this.styles[this.style].middle.x,-this.styles[this.style].middle.y)
			ctx_.globalAlpha=1.0
			ctx_.restore()
			
		}
	}
	ispointinpath(x,y,ctx_=ctx){
		ctx_.save()
		ctx_.translate(this.position.x,this.position.y)
		ctx_.rotate(this.rotation)
		ctx_.scale(this.scale.x,this.scale.y)
		ctx_.beginPath()
		for(let i=0;i<this.styles[this.style].path.length;i++){
			if(i===0){
				ctx_.moveTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
			}else{
				ctx_.lineTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
			}
		}
		ctx_.closePath()
		ctx_.restore()
		return ctx_.isPointInPath(x,y)
		
	}
	addstyle(src,middle,path){
		let img=new Image()
		img.src=src 
		this.styles.push({method:'img',img:img,middle:middle,path:path})
	}
}

init()
draw()
setInterval(update, 20);
