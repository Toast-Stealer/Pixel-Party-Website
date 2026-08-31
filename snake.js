const c=document.querySelector('#game'),x=c.getContext('2d');
const scoreEl=document.querySelector('#score'),bestEl=document.querySelector('#best'),overlay=document.querySelector('#overlay');
const N=20,S=c.width/N;
function awardPoints(game,points,value){let p;try{p=JSON.parse(localStorage.getItem('pixel-party-profile')||'{}')}catch{p={}}p.points=(p.points||0)+Math.max(5,Math.floor(points));p.scores={...(p.scores||{}),[game]:Math.max(p.scores?.[game]||0,value)};localStorage.setItem('pixel-party-profile',JSON.stringify(p))}
let snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}],food={x:14,y:6},dir={x:1,y:0},nextDir={x:1,y:0},score=0,timer,running=false,paused=false;
let best=+localStorage.getItem('pp-snake-best')||0;
bestEl.textContent=String(best).padStart(3,'0');
function spawn(){do{food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}}while(snake.some(p=>p.x===food.x&&p.y===food.y))}
function reset(){snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir=nextDir={x:1,y:0};score=0;scoreEl.textContent='000';spawn();running=true;paused=false;overlay.classList.add('hidden');clearTimeout(timer);tick()}
function tick(){if(!running||paused)return;dir=nextDir;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.y<0||h.x>=N||h.y>=N||snake.some(p=>p.x===h.x&&p.y===h.y))return over();snake.unshift(h);if(h.x===food.x&&h.y===food.y){score+=10;scoreEl.textContent=String(score).padStart(3,'0');spawn()}else snake.pop();draw();timer=setTimeout(tick,Math.max(60,130-score*.7))}
function draw(){x.fillStyle='#090b0e';x.fillRect(0,0,c.width,c.height);x.strokeStyle='#ffffff0b';x.lineWidth=1;for(let i=0;i<=N;i++){x.beginPath();x.moveTo(i*S,0);x.lineTo(i*S,c.height);x.stroke();x.beginPath();x.moveTo(0,i*S);x.lineTo(c.width,i*S);x.stroke()}x.fillStyle='#ff5c49';x.beginPath();x.arc(food.x*S+S/2,food.y*S+S/2,S*.31,0,Math.PI*2);x.fill();snake.forEach((p,i)=>{x.fillStyle=i?'#9fe82d':'#c8ff37';x.fillRect(p.x*S+2,p.y*S+2,S-4,S-4)});const h=snake[0];x.fillStyle='#111';x.beginPath();x.arc(h.x*S+10,h.y*S+10,2.2,0,7);x.arc(h.x*S+20,h.y*S+10,2.2,0,7);x.fill()}
function over(){running=false;best=Math.max(best,score);localStorage.setItem('pp-snake-best',best);awardPoints('snake',score/2,score);bestEl.textContent=String(best).padStart(3,'0');overlay.innerHTML=`<h2>GAME OVER</h2><p>You scored ${score} · +${Math.max(5,score/2)} points</p><button class="game-btn" id="again">PLAY AGAIN</button>`;overlay.classList.remove('hidden');document.querySelector('#again').onclick=reset}
function setDir(dx,dy){if(dx!==-dir.x||dy!==-dir.y)nextDir={x:dx,y:dy}}
document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','w'].includes(k))setDir(0,-1);if(['arrowdown','s'].includes(k))setDir(0,1);if(['arrowleft','a'].includes(k))setDir(-1,0);if(['arrowright','d'].includes(k))setDir(1,0);if(k==='p'&&running){paused=!paused;if(!paused)tick()}if(k.startsWith('arrow'))e.preventDefault()});
document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>({up:()=>setDir(0,-1),down:()=>setDir(0,1),left:()=>setDir(-1,0),right:()=>setDir(1,0)})[b.dataset.dir]());
document.querySelector('#start').onclick=reset;document.querySelector('#restart').onclick=reset;draw();
