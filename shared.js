(function(){
  const defaults={points:0,icon:'bolt',theme:'lime',ownedIcons:['bolt'],ownedThemes:['lime'],scores:{}};
  const legacy={'⚡':'bolt','👾':'ghost','🐍':'snake','🦊':'fox','🚀':'rocket','👑':'crown'};
  const read=()=>{try{const p={...defaults,...JSON.parse(localStorage.getItem('pixel-party-profile')||'{}')};p.icon=legacy[p.icon]||p.icon;p.ownedIcons=(p.ownedIcons||['bolt']).map(i=>legacy[i]||i);if(!p.ownedIcons.includes('bolt'))p.ownedIcons.unshift('bolt');return p}catch{return {...defaults}}};
  const save=p=>localStorage.setItem('pixel-party-profile',JSON.stringify(p));
  const palettes={lime:{brand:'#b6f21f',brand2:'#55d6e8',bg:'#17191f',surface:'#242730',panel:'#2b2e37',header:'#0c0d10'},aqua:{brand:'#40d9e8',brand2:'#7cf1c8',bg:'#102126',surface:'#183139',panel:'#1d3b44',header:'#081619'},sunset:{brand:'#ff7857',brand2:'#ffc857',bg:'#241817',surface:'#352321',panel:'#422a27',header:'#150d0c'},berry:{brand:'#d878ff',brand2:'#ff78a8',bg:'#211724',surface:'#302037',panel:'#3a2742',header:'#130d15'},gold:{brand:'#ffd43b',brand2:'#ff9d3d',bg:'#211e15',surface:'#322d1e',panel:'#3d3623',header:'#131109'}};
  window.PixelParty={
    profile:read,
    save,
    award(game,points,score=points){const p=read();p.points+=Math.max(0,Math.floor(points));p.scores={...p.scores,[game]:Math.max(p.scores?.[game]||0,Math.floor(score))};save(p);this.refresh();return p},
    spend(cost){const p=read();if(p.points<cost)return false;p.points-=cost;save(p);this.refresh();return true},
    refresh(){const p=read(),theme=palettes[p.theme]||palettes.lime,root=document.documentElement;document.querySelectorAll('[data-points]').forEach(e=>e.textContent=p.points.toLocaleString());document.querySelectorAll('[data-player-icon]').forEach(e=>{e.innerHTML=`<img src="assets/icons/${p.icon}.svg" alt="Player icon">`});root.dataset.theme=p.theme;root.style.setProperty('--green',theme.brand);root.style.setProperty('--accent',theme.brand);root.style.setProperty('--brand-2',theme.brand2);root.style.setProperty('--portal',theme.bg);root.style.setProperty('--portal-2',theme.surface);root.style.setProperty('--panel',theme.panel);root.style.setProperty('--header-bg',theme.header)}
  };
  addEventListener('DOMContentLoaded',()=>PixelParty.refresh());
})();
