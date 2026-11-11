'use strict';
// Original atlases and expansion portraits use immutable roster IDs.
const paperPortraitSheets=[{"path":"art/paper-00.jpg","width":1536,"height":1024},{"path":"art/paper-01.jpg","width":1536,"height":1024},{"path":"art/paper-02.jpg","width":1536,"height":1024},{"path":"art/paper-03.jpg","width":1536,"height":1024},{"path":"art/paper-04.jpg","width":1536,"height":1024},{"path":"art/paper-05.jpg","width":1536,"height":1024}];
const expansionPortraits=["art/liam-neesen-v2.jpg","art/the-tooth-v2.jpg","art/tessa-blanchard-v2.jpg","art/rulebook-dog-v2.jpg"];
function wrestlerArt(r){
 if(r.id===38)return '<span class="guest-art" aria-hidden="true">DE</span>';
 const index=Number.isInteger(r.id)&&r.id>=0&&r.id<38?r.id:3;
 const sheet=index>=34?{path:expansionPortraits[index-34],width:512,height:512}:paperPortraitSheets[Math.floor(index/6)],cell=index>=34?0:index%6;
 const size=index>=34?sheet.width:sheet.width/3,x=(cell%3)*size,y=Math.floor(cell/3)*(sheet.height/2);
 // Crop the atlas only at display time. The generated source images remain intact.
 const image=`<svg overflow="hidden" x="0" y="0" width="160" height="180" viewBox="${x} ${y} ${size} ${index>=34?sheet.height:sheet.height/2}" preserveAspectRatio="xMidYMid slice"><image href="${sheet.path}" x="0" y="0" width="${sheet.width}" height="${sheet.height}"/></svg>`;
 const belt=r.champ?'<path d="M22 163L138 165 136 179H24Z" fill="#af7f2c"/><path d="M55 157L105 159 103 180H54Z" fill="#e8c56e"/><path d="M61 162L99 163 97 176H60Z" fill="#f3dda1"/><text x="80" y="172" text-anchor="middle" fill="#102a40" font-family="Arial,sans-serif" font-size="9" font-weight="900">WWA</text>':'';
 return `<svg viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-art-style="cut-paper-human" data-wrestler-id="${index}"><rect width="160" height="180" fill="#f2e9d5"/>${image}${belt}</svg>`;
}
