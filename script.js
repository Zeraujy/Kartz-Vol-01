
const container=document.getElementById('book');

const flip=new St.PageFlip(container,{
 width:700,
 height:990,
 size:'stretch',
 autoSize:true,
 maxShadowOpacity:0.4,
 showCover:true,
 usePortrait:true,
 mobileScrollSupport:true,
 startZIndex:1
});

const pages=[];
for(let i=1;i<=999;i++){
 const n=String(i).padStart(3,'0');
 const page=document.createElement('div');
 page.className='page';
 const img=document.createElement('img');
 img.src=`pages/page_${n}.jpg`;
 img.onerror=()=>{};
 page.appendChild(img);
 pages.push(page);
}
flip.loadFromHTML(pages);

function resize(){
 container.style.width=Math.min(window.innerWidth*0.96,1400)+'px';
 container.style.height=Math.min(window.innerHeight*0.96,1000)+'px';
}
window.addEventListener('resize',resize);
resize();
