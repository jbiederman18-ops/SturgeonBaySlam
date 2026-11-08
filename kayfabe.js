'use strict';
// Each voice answers a shared topic. Openers, rebuttals and follow-ups belong to one scene.
const ringVoices=[
 {subject:"your Greco Wrestling",open:"Greco Wrestling requires an opponent; you appear to meet that modest qualification.",reply:t=>`${capTopic(t)}? Show me where that belongs in Greco Wrestling.`,close:t=>`Bring ${t}; Greece shall witness what a proper grip can answer.`,crowd:"Watch the hands, citizens; Greco Wrestling is about to advance."},
 {subject:'your second hold',open:"Two holds exist. I know both. You are about to learn one extremely well.",reply:t=>`${capTopic(t)} will not get you out of Hold Number One.`,close:t=>`Keep talking about ${t}. That is another minute I can keep this hold on.`,crowd:"Hold Two is the other one. There is no next one."},
 {subject:'your playbook',open:'I only need one play. Put me in front of you and find out.',reply:t=>`${capTopic(t)} looks impressive from the sidelines. Try stopping me on the field.`,close:t=>`I heard all about ${t} before I got here. I showed up anyway.`,crowd:'I am right here! Now give me somebody to run through!'},
 {subject:'your one-man act',open:'One ring. One opponent. One Man. That is enough.',reply:t=>`There is a lot of noise about ${t}. I am still just one man you have to beat.`,close:t=>`Bring ${t}. Leave the excuses outside.`,crowd:'One is all it takes. Keep counting.'},
 {subject:'your towel',open:'Keep waving those towels. I will give this whole room something to cry into.',reply:t=>`${capTopic(t)}? I have a towel ready for the tears when it lets you down.`,close:t=>`That is a lot of fuss over ${t}. Try keeping hold of it when I hit you.`,crowd:'Wave harder. I want to see those arms tired before the booing starts.'},
 {subject:'your wrestling bylaws',open:'This ring has rules. Unfortunately for you, I have read all of them.',reply:t=>`I found the clause covering ${t}. It does not promise a victory.`,close:t=>`Then I formally object to ${t}. Let us settle the objection in the ring.`,crowd:'Gladly. Every single page. I hope nobody has a train to catch.'},
 {subject:'your thesis',open:'Your offense is anecdotal. Mine has been peer-reviewed.',reply:t=>`${capTopic(t)} is a hypothesis. I intend to test it very thoroughly.`,close:t=>`Keep ${t} still. I need a control group for this experiment.`,crowd:'The defense is open! Volunteers should approach the ring one at a time.'},
 {subject:'your close-up',open:'The camera is here for me. Try not to block the shot when you fall.',reply:t=>`${capTopic(t)} can wait. The camera has already found the star.`,close:t=>`Nobody bought a ticket for ${t}. They came to see how I end this.`,crowd:'Then keep your eyes open. This is the close-up they will replay.'},
 {subject:'your cold front',open:'The temperature is dropping. You are standing right in the path of it.',reply:t=>`${capTopic(t)} sounds like hot air. Let us see how long it lasts in the cold.`,close:t=>`Hold on to ${t}. Things get slippery when I start moving.`,crowd:'Take a good look. That is the last warning before the freeze.'},
 {subject:'those mouse ears',open:'Call me adorable again. I want the whole room to hear it before I lift you.',reply:t=>`Keep looking at ${t}. It will give you something to think about on the way down.`,close:t=>`If ${t} is so impressive, why are you still worried about somebody my size?`,crowd:'Small ears. Big suplex. You already know the words!'},
 {subject:'your broom',open:'I have cleaned up after everyone in this company. Your turn.',reply:t=>`${capTopic(t)}? Fine. I have cleaned up bigger messes than that.`,close:t=>`I am not asking ${t} for permission. Move aside. I have work to do.`,crowd:"Keep chanting; I am cleaning every last scrap before this bell."},
 {subject:'your guest list',open:'You needed a ticket. I am on the list. We are not arriving at the same place.',reply:t=>`I asked about ${t} at the door. Nobody put it on the list.`,close:t=>`Good luck with ${t}. I will be waiting in the part of the building you cannot get into.`,crowd:'The list is confidential. Very exclusive. You would not recognize the handwriting.'},
 {subject:'your master plan',open:'I have already worked out how this ends. You will catch up.',reply:t=>`I allowed for ${t}. That was the easy part of the plan.`,close:t=>`Keep explaining ${t}. It saves me the trouble of guessing what you will do next.`,crowd:'It is going perfectly. I would be worried if you understood it.'},
 {subject:'your rocket',open:'The countdown is nearly over. Please clear the launch area.',reply:t=>`${capTopic(t)} is taking up space in my launch area. Move it.`,close:t=>`Hold on to ${t}. The next part comes with turbulence.`,crowd:'Ten seconds to liftoff. Front row, make the noise for me!'},
 {subject:'your third act',open:'This is my third act. Stay close. The ending is going to need a witness.',reply:t=>`${capTopic(t)} was a fine opening scene. I am here for the ending.`,close:t=>`Bring ${t} back for the encore. I intend to leave them asking for more.`,crowd:'Then stay with me. Nobody leaves before the last scene.'},
 {subject:'your parallel lines',open:'Our careers run parallel. Yours will never reach mine.',reply:t=>`I measured ${t}. It is drifting dangerously close to a straight defeat.`,close:t=>`Keep ${t} on that side of the line. I am about to demonstrate the angle.`,crowd:'They are perfectly parallel! The referee is welcome to bring a ruler.'},
 {subject:'your tea party',open:'You are late for your own defeat. I have already put the kettle on.',reply:t=>`${capTopic(t)} would make a lovely guest at my tea party. Shame about the manners.`,close:t=>`Set ${t} beside the teapot. I want both hands free for this next bit.`,crowd:'The kettle is on. The invitation, regrettably, is not optional.'},
 {subject:'your insurance policy',open:'Your comeback is not covered under this policy.',reply:t=>`I checked ${t}. The coverage runs out the moment I get hold of you.`,close:t=>`You should have declared ${t} before we entered the ring. Now the claim is contested.`,crowd:'Read it carefully! I charge extra for a rope break.'},
 {subject:'those lovely manners',open:"Please accept a complimentary injury report. The transport home is extra.",reply:t=>`Thank you for bringing ${t}. The auction can begin after the bell.`,close:t=>`Please leave ${t} with the belongings. Collection hours are extremely limited.`,crowd:"Thank you for the noise. Please keep screaming until the liability waiver has been signed."},
 {subject:'your feed',open:'I have read every reply. You are about to give me a new one.',reply:t=>`${capTopic(t)} is getting a lot of attention for something nobody asked to see.`,close:t=>`Say one more thing about ${t}. I want the room to remember it when you lose.`,crowd:'Log off? This is the only place I can hear the replies in person!'},
 {subject:'your love letters',open:"I adore this whole room, and I have saved my biggest wrestling hug for the other corner!",reply:t=>`${capTopic(t)}? I love how much it means to you! Bring it closer!`,close:t=>`Bring ${t}; this welcome has room for absolutely everything you care about!`,crowd:"Such passionate voices! I love you louder every time!"},
 {subject:'your guitar solo',open:'I have played small rooms louder than this. Let us find out what you have got.',reply:t=>`${capTopic(t)} sounds like the warm-up act. I am waiting for the heavy part.`,close:t=>`Turn ${t} up. I want it loud enough to cover the sound of you hitting the mat.`,crowd:'The big finish? You have not even heard the second verse.'},
 {subject:'your fancy footwork',open:'Go on. Try to catch me. I want to see that look on your face.',reply:t=>`${capTopic(t)} might work on dry land. I am harder to keep hold of.`,close:t=>`Hang on to ${t}. The tide is about to turn.`,crowd:'Keep shouting! I can find my way back to shore by following the noise.'},
 {subject:'your sweet little act',open:'Sweet entrance. Bitter ending. You will acquire the taste.',reply:t=>`${capTopic(t)} needs a little bite. Let me add some.`,close:t=>`Careful with ${t}. I would hate for this to leave a sour taste.`,crowd:'You wanted zest? Open wide.'},
 {subject:'your party invitation',open:'Everybody is invited. You are the only one looking nervous about it.',reply:t=>`${capTopic(t)} can come to the party. It still has to get past me at the door.`,close:t=>`Bring ${t}. There is room for everybody, but only one winner.`,crowd:'Then make room! The back row is coming down to the front!'},
 {subject:'your beat drop',open:'You are the warm-up. I am the drop they came to hear.',reply:t=>`${capTopic(t)} is off the beat. I can hear it from here.`,close:t=>`Try keeping ${t} in time. I am about to change the rhythm.`,crowd:'Wait for it. Wait for it. Now!'},
 {subject:'your star rating',open:'I have watched every hold you know. None of them worry me.',reply:t=>`${capTopic(t)} is doing a lot of talking for something with such ordinary footwork.`,close:t=>`I will give ${t} a fair hearing. Then I will show this room a better hold.`,crowd:'I will explain the rating after the bell. Watch the footwork first.'},
 {subject:'your sightseeing map',open:'I have seen the sights. You are about to become one.',reply:t=>`I looked for ${t} on the map. It is right beside the exit.`,close:t=>`Smile beside ${t}. This is going on a postcard.`,crowd:'I took the scenic route. There is still plenty to discover around here!'},
 {subject:'your best-in-show ribbon',open:'Stand still. The judges deserve a proper look before I throw you.',reply:t=>`${capTopic(t)} might impress the back row. It would not place at my show.`,close:t=>`Keep ${t} tidy. I do prefer the competition looking presentable when it loses.`,crowd:'Quite right. The standards have been slipping.'},
 {subject:'your floating home',open:'You can rock the boat. You cannot move the house.',reply:t=>`${capTopic(t)} is a lot of cargo. You will have to shift it yourself.`,close:t=>`Bring ${t} aboard. We will see if it floats after the first collision.`,crowd:'All aboard! Mind the ropes. I have just had them painted.'},
 {subject:'your snack pocket',open:'Take a good look at this smile. It means I have had my break and you have not.',reply:t=>`${capTopic(t)} looks impressive. I brought enough fuel to outlast it.`,close:t=>`Keep ${t} warm. I am coming back for seconds.`,crowd:'One pocket at a time! Nobody leaves hungry.'},
 {subject:'your neutral position',open:"Both corners have had a turn to speak. Both corners may now have a turn to STOP.",reply:t=>`The record acknowledges ${t} without endorsement. Further comment is increasingly unwelcome.`,close:t=>`No position on ${t}. If debate continues after the bell, I will adjourn both corners.`,crowd:"Both chants have been acknowledged. Equal silence would now be appreciated."},
 {subject:'your prized boots',open:'These boots carried me here. They are about to carry me straight through you.',reply:t=>`${capTopic(t)} might slow me down. It is not going to stop me.`,close:t=>`Keep ${t} out of the way. I am coming through at full speed.`,crowd:'Laces tied. Studs ready. Give me the ball!'},
 {subject:'your dessert spoon',open:'You have had the main course. Here comes the finish.',reply:t=>`${capTopic(t)} looks a little light. I brought something that will stick to your ribs.`,close:t=>`Leave room for ${t}. I am not done serving yet.`,crowd:'The proof is right here! Stand back. It is about to wobble.'}
];

ringVoices.push(
 {subject:"your comeback",open:"The glass is down, the fists are up; at last, a comeback with decent fight scenes.",reply:t=>`${capTopic(t)}? I have had worse pitches over better whiskey.`,close:t=>`Bring ${t}; I have been promised a fight and I intend to enjoy it.`,crowd:"Say the name again; I have missed that more than the trailers."},
 {subject:'your strong roots',open:'This is a contact sport. I am the contact your dentist warned you about.',reply:t=>`I checked ${t}. Not nearly enough enamel.`,close:t=>`Brace ${t}. This next part has real bite.`,crowd:'The crown is not decorative. Neither is this one!'},
 {subject:'your other invitations',open:'Yes, I could be elsewhere. Yes, I chose here. Let us all remember that.',reply:t=>`I could discuss ${t} in any number of venues. I have generously selected this one.`,close:t=>`Bring ${t} to the ring I deliberately came to. I will be there by choice.`,crowd:'Of course I am here! I selected here! Please make the distinction.'},
 {subject:'your rulebook',open:'I am a dog. I read the rules. Nothing says dogs cannot wrestle. Ring the bell.',reply:t=>`I checked ${t}. Still no rule against a dog wrestling.`,close:t=>`Bring ${t}. I brought a legal argument and a crossbody.`,crowd:'You heard the room. Let this dog wrestle!'}
);

// How a call went, in each wrestler's own voice. `land` follows a clean hit; `slip` covers a mistake.
// Each takes a noun phrase such as “the Olympus Driver” or “that tag”.
const callLines=[
 {land:x=>`${capTopic(x)}! Record that application of Greco Wrestling.`,slip:x=>`${capTopic(x)} requires further study; Greco Wrestling remains sound.`},
 {land:x=>`${capTopic(x)} is another description of Hold One. Observe the grip.`,slip:x=>`An imperfect application of one of the two holds. The names do not create more holds.`},
 {land:x=>`Did you see ${x}? Somebody tell coach I got in the game!`,slip:x=>`Fumbled ${x}. Doesn’t matter. I always get back up.`},
 {land:x=>`${capTopic(x)}. One man did that. Count again.`,slip:x=>`One bad moment on ${x}. Still one man standing.`},
 {land:x=>`Wave those towels! ${capTopic(x)}, fresh out of the spin cycle!`,slip:x=>`${capTopic(x)} came out a bit wrinkled. Give it another spin.`},
 {land:x=>`Let the record show ${x} was entirely legal and extremely effective.`,slip:x=>`I move to strike ${x} from the record. It never happened.`},
 {land:x=>`${capTopic(x)}, replicated perfectly. Publish it.`,slip:x=>`${capTopic(x)} produced an anomalous result. Further testing is required.`},
 {land:x=>`Tell me the camera got ${x}. That is the highlight reel.`,slip:x=>`Cut. We are reshooting ${x}. Nobody saw that take.`},
 {land:x=>`Feel that chill? ${capTopic(x)}. Below zero.`,slip:x=>`${capTopic(x)} hit a patch of ice. The freeze is still coming.`},
 {land:x=>`Small ears. Big result. Did everybody see ${x}?`,slip:x=>`Still think I’m adorable after ${x}? Good. Keep underestimating me.`},
 {land:x=>`${capTopic(x)}. Clean sweep. Somebody fetch the dustpan.`,slip:x=>`${capTopic(x)} made a mess; move your boots, I am cleaning it now.`},
 {land:x=>`${capTopic(x)}. VIP section only. You were not on the list.`,slip:x=>`${capTopic(x)}? That was not me. Check with my people.`},
 {land:x=>`${capTopic(x)}. Exactly as planned.`,slip:x=>`${capTopic(x)} going sideways? Also part of the plan. Keep up.`},
 {land:x=>`${capTopic(x)}! We have liftoff!`,slip:x=>`${capTopic(x)} was a scrubbed launch. Resetting the countdown.`},
 {land:x=>`That’s the scene! ${capTopic(x)}, and the whole room believed it.`,slip:x=>`${capTopic(x)} was the rehearsal. The real take comes in the third act.`},
 {land:x=>`${capTopic(x)}. Perfectly parallel. Bring a ruler.`,slip:x=>`${capTopic(x)} was a degree off. I am correcting the angle.`},
 {land:x=>`${capTopic(x)}! Somebody pour the tea, this calls for a toast!`,slip:x=>`${capTopic(x)} spilled. Clean cup! Move down!`},
 {land:x=>`${capTopic(x)}. Fully covered. Claim approved.`,slip:x=>`${capTopic(x)} falls under a minor exclusion. I am filing an appeal.`},
 {land:x=>`Delightful. Please add ${x} to the itemized list of damages.`,slip:x=>`Terribly sorry about ${x}. Please accept a second attempt at no charge to the booking office.`},
 {land:x=>`Clip ${x}. Post it. The replies are going to be incredible.`,slip:x=>`${capTopic(x)} is being taken out of context. Deleting that.`},
 {land:x=>`${capTopic(x)}! A great big wrestling thank-you!`,slip:x=>`${capTopic(x)} needs another try; luckily I have SO much affection left!`},
 {land:x=>`Look at this photograph! ${capTopic(x)}, front row, every word!`,slip:x=>`${capTopic(x)} was a little off key. We’re playing it again, louder.`},
 {land:x=>`${capTopic(x)}! Out of the water and still swimming!`,slip:x=>`${capTopic(x)} got away from me. Slippery. Like me.`},
 {land:x=>`${capTopic(x)}. Sweet, sharp, and right on the tongue.`,slip:x=>`${capTopic(x)} came out a little sour. I prefer it that way.`},
 {land:x=>`${capTopic(x)}! Everybody’s invited to that one!`,slip:x=>`${capTopic(x)} didn’t go to plan. Get back up. Third day, remember?`},
 {land:x=>`${capTopic(x)}! Right on the drop!`,slip:x=>`${capTopic(x)} was off the beat. Run it back. I’m remixing.`},
 {land:x=>`${capTopic(x)}. Five stars. I will be writing about that one.`,slip:x=>`${capTopic(x)}? That would have worked in a smaller venue.`},
 {land:x=>`${capTopic(x)}! Somebody take a picture. That’s going on the postcard!`,slip:x=>`Wrong turn on ${x}. Lovely view, though.`},
 {land:x=>`${capTopic(x)}. Best in show. Naturally.`,slip:x=>`${capTopic(x)} was not up to standard. Bad. Very bad.`},
 {land:x=>`${capTopic(x)}. Anchored. Nobody moves the house.`,slip:x=>`${capTopic(x)} rocked the boat a little. Still afloat.`},
 {land:x=>`${capTopic(x)}! Hot and ready in ninety seconds!`,slip:x=>`${capTopic(x)} came out half-frozen. Back in the oven.`},
 {land:x=>`The record shows ${x} worked. This finding confers no endorsement.`,slip:x=>`The result of ${x} is recorded. Neither side needs to submit another interpretation.`},
 {land:x=>`${capTopic(x)}! Laces tight! Studs up!`,slip:x=>`Laces came undone on ${x}. Retie. Go again.`},
 {land:x=>`${capTopic(x)}! The proof is in the pudding!`,slip:x=>`${capTopic(x)} wobbled. I always wobble. Then I set.`},
 {land:x=>`${capTopic(x)}! That deserves a sequel and a toast.`,slip:x=>`${capTopic(x)} needed another take; luckily I still fancy a fight.`},
 {land:x=>`${capTopic(x)}. Real bite. Tell your dentist.`,slip:x=>`${capTopic(x)} chipped a little. The root is still strong.`},
 {land:x=>`${capTopic(x)}. I could have done that anywhere. I chose to do it here.`,slip:x=>`${capTopic(x)}? I meant that. I choose everything I do here.`},
 {land:x=>`${capTopic(x)}! Good dog! Nothing in the rules says a dog can’t do that!`,slip:x=>`${capTopic(x)} was a bad-dog moment. Still not against the rules.`}
];
// The quality of a call (−3…+3) decides how the scene plays out.
const CALL_TIERS={great:{label:'Nailed it',stamp:'NAILED IT!',tone:'great'},good:{label:'Landed clean',stamp:'CLEAN!',tone:'good'},fair:{label:'Got it done',stamp:'GOT IT DONE',tone:'fair'},flat:{label:'Fell flat',stamp:'FLAT',tone:'flat'},miss:{label:'Mistimed',stamp:'MISTIMED!',tone:'miss'}};
function callTier(delta){return delta>=3?'great':delta===2?'good':delta===1?'fair':delta===0?'flat':'miss'}
function callLand(id,thing){return {...ringBeat(id,(callLines[id]||callLines[0]).land(thing)),key:true}}
function callSlip(id,thing){return {...ringBeat(id,(callLines[id]||callLines[0]).slip(thing)),key:true}}
function capTopic(text){return text.charAt(0).toUpperCase()+text.slice(1)}
function ringBeat(speaker,text,kind='speech',cue=''){return {speaker,text,kind,cue}}
function beatStory(beats){return beats.map(beat=>typeof beat.speaker==='number'?`${w(beat.speaker).name}: “${beat.text}”`:beat.text).join(' ')}
function ringOpponent(segment,actor){if(segment.kind==='promo'&&Object.hasOwn(segment,'target'))return segment.target==null?null:w(segment.target);if(segment.kind==='match')return w(matchOpponents(segment,actor)[0]);const linked=state.card.find(s=>s.kind==='match'&&matchPeople(s).includes(actor));if(linked)return w(matchOpponents(linked,actor)[0]);return champion().id!==actor?champion():state.roster.filter(r=>r.id!==actor).sort((a,b)=>b.pop-a.pop)[0]||null}
function ringOpening(moment,segment){
 const a=w(segment.a),av=ringVoices[a.id],b=ringOpponent(segment,a.id),bv=b?ringVoices[b.id]:null;
 const heat=b?(state.rivalries[rivalryKey(a.id,b.id)]||0):0;
 if(segment.kind==='promo'){
  const pitch=String(segment.concept||'').trim(),opening=pitch||[av.open,ringPersonalities[a.id].boast,ringPersonalities[a.id].heart,...CHARACTER_SPECIALS[a.id].branches.map(branch=>branch[1])][(state.week-1)%5];
  const intro=segment.hook==='Debut a gimmick'?ringBeat('commentary',`${a.name} steps through the curtain with a new look. The room takes notice.`,'action','A NEW LOOK!'):ringBeat('commentary',`${a.name} takes the microphone${b?' and turns toward '+b.name:''}.`,'action','MIC TIME!');
  if(b&&(segment.scene!=='Solo address'||['Issue a challenge','Fuel a rivalry'].includes(segment.hook)))return [intro,...(segment.scene==='Interview'?[ringBeat('commentary',`The interviewer asks ${a.name} what they want from ${b.name}.`,'action')]:[]),...(segment.scene==='Interruption'?[ringBeat(b.id,'Before you say another word: I heard my name.')]:[]),ringBeat(a.id,opening),ringBeat(b.id,(pitch?'You want us to believe that? ':'')+bv.reply(av.subject),'speech','HOLD ON!'),ringBeat(a.id,av.close(bv.subject)),ringBeat('commentary',heat>=35?`Neither wrestler looks away. ${a.name} keeps a tight grip on the microphone.`:`${b.name} moves closer to the ropes. The room falls quiet.`,'action')];
  return [intro,ringBeat(a.id,opening),ringBeat('crowd',crowdHeckles[a.id],'shout'),ringBeat(a.id,av.crowd),ringBeat('commentary',`${a.name} waits for the noise to settle, then raises the microphone again.`,'action')];
 }
 const beats=[ringBeat(a.id,av.open,'speech','BELL’S GONE!'),ringBeat(b.id,bv.reply(av.subject))];
 if(teamFormat(segment)){
  const ally=matchSides(segment).find(side=>side.includes(a.id)).find(id=>id!==a.id),voice=ringVoices[ally];beats.push(ringBeat(ally,voice.reply(bv.subject)),ringBeat(b.id,bv.close(voice.subject)));
  beats.push(ringBeat('commentary',`${a.name} and ${b.name} step forward. Their partners take their places on the apron.`,'action'));
 }else if(moment.actors.length>2){
  const third=moment.actors.find(id=>id!==a.id&&id!==b.id),voice=ringVoices[third];beats.push(ringBeat(third,voice.reply(bv.subject)),ringBeat(a.id,av.close(voice.subject)));
  beats.push(ringBeat('commentary',`${w(third).name} edges closer while ${a.name} and ${b.name} watch each other.`,'action'));
 }else{beats.push(ringBeat(a.id,av.close(bv.subject)),ringBeat('commentary',`${b.name} reaches for a lock-up. ${a.name} plants their feet.`,'action'))}
 return beats;
}
function finishBeats(segment,choice){
 const lead=w(segment.winner),opponents=matchOpponents(segment,lead.id).map(w),other=opponents.find(r=>r.id===segment.pin)||opponents[0],side=matchSides(segment).find(ids=>ids.includes(lead.id));
 const finisher=teamFormat(segment)&&choice.tag==='Teamwork'?w(side.find(id=>id!==lead.id)):lead;
 const result=[],say=text=>result.push(ringBeat('commentary',text,'action'));
 if(segment.presentation==='Dominant')say(`${lead.name} keeps the opposition on the defensive through the final stretch.`);
 if(segment.presentation==='Upset')say(`${lead.name} finds an opening while the room holds its breath.`);
 if(segment.prop)say(`${SHOW_PROPS[segment.prop]?.name||'The prop'} is part of the scene; the front row recognizes the callback.`);
 if(segment.finish==='Cheating')say(['No disqualification','Tables match','Ladder match','Office Supplies Deathmatch'].includes(segment.type)?`${finisher.name} feigns an injury. ${other.name} hesitates, and the attack comes from the blind side.`:`The referee turns toward a loose turnbuckle. ${finisher.name} catches ${other.name} with a hidden handful of tights.`);
 if(segment.finish==='Interference')say(segment.interferer!=null?`${w(segment.interferer).name} appears at ringside to ${({'Settle a grudge':'settle a grudge','Help an ally':'help an ally','Demand a title shot':'demand a title shot'})[segment.interferenceReason]||'change the outcome'}. ${other.name} turns toward the interruption. ${finisher.name} seizes the opening.`:`A commotion at ringside draws ${other.name}'s attention. ${finisher.name} seizes the opening.`);
 const format=matchFormat(segment);
 if(format==='royal'){say(`The field thins until ${lead.name} and ${other.name} are left by the ropes.`);say(`${lead.name} tips ${other.name} over the top. Both feet hit the floor, and the bell sounds.`)}
 else if(segment.type==='Ladder match')say(`${finisher.name} climbs above the scrambling opposition and pulls the prize free. The bell sounds.`);
 else if(segment.type==='Tables match')say(`${finisher.name} catches ${other.name} beside the ropes and drives them through the waiting table. The referee calls for the bell.`);
 else if(segment.type==='Submission match')say(`${finisher.name} tightens the hold and pulls ${other.name} away from the ropes. ${other.name} taps, and the referee calls for the bell.`);
 else if(segment.type==='Last person standing')say(`${lead.name} struggles upright. The remaining opposition stay down as the referee reaches ten.`);
 else{say(`${finisher.name} hooks ${other.name}'s leg${matchPeople(segment).length>2?' as the other wrestlers scramble toward them':''}.`);say('One! Two! Three! The referee calls for the bell.')}
 const winners=teamFormat(segment)?sideLabel(side):lead.name;say(`${winners} ${teamFormat(segment)?'have':'has'} won${segment.title&&!lead.champ?' the WWA championship':''}!`);
 const face=teamFormat(segment)?side.map(w).some(r=>r.role==='Face'):lead.role==='Face';result.push(ringBeat('crowd',face?`${lead.name}! ${lead.name}!`:'BOOOOO!','shout'));
 return {beats:result,finisher:finisher.id};
}
function promoBranch(choice,segment,moment){
 const a=w(segment.a),v=ringVoices[a.id],p=ringPersonalities[a.id],r=ringOpponent(segment,a.id),rv=r?ringVoices[r.id]:null,tier=callTier(choice.delta??0),hit=['great','good'].includes(tier);
 let beats,title,labelTag,preview,thing;
 const [showpiece,personal]=CHARACTER_SPECIALS[a.id].branches;
 if(choice.tag==='Call someone out'){
  title=r?`Call out ${r.name}`:'Make a bold statement';
  labelTag=r?'Confrontation':'Confidence';thing=r?'that challenge':'that statement';
  preview=r?`Challenge ${r.name} directly and give them a chance to answer.`:'Tell the audience what you came here to prove.';
  beats=[ringBeat(a.id,rv?v.reply(rv.subject):v.open)];
  if(r)beats.push(hit?ringBeat(r.id,rv.close(v.subject)):ringBeat('commentary',`${r.name} lets the words hang, smirks, and says nothing at all. The challenge loses its air.`,'action'));
  beats.push(ringBeat('commentary',r?(hit?`${a.name} steps up to the ropes, nose to nose with ${r.name}. Neither one blinks.`:`${a.name} steps toward the ropes, but ${r.name} has already turned away.`):`${a.name} raises the microphone and looks straight into the front row.`,'action'));
 }else if(choice.tag==='Show some heart'){
  title='Tell them why it matters';
  labelTag='Personal stakes';thing='that speech';
  preview='Share what’s at stake for the wrestler in their own words.';
  beats=[ringBeat(a.id,personal[1]),ringBeat(a.id,p.heart)];
  if(r)beats.push(ringBeat(r.id,r.role==='Heel'?`Then prove it. ${rv.reply(v.subject)}`:`I heard every word. ${rv.close(v.subject)}`));
 }else{
  title='Go big with the gimmick';
  labelTag='Showmanship';thing='the bit';
  preview=`${a.name} ${p.stunt}.`;
  beats=[ringBeat('commentary',preview,'action'),ringBeat(a.id,showpiece[1])];
  if(r)beats.push(ringBeat(r.id,hit?'All right. You have their attention. Now try keeping it when I get hold of you.':rv.reply(v.subject)));
 }
 // How it landed: the room answers, then the speaker reacts in character.
 if(tier==='great')beats.push(ringBeat('crowd',a.role==='Face'?crowdHeckles[a.id]:'BOOOOO! BOOOOO!','shout','THE ROOM ERUPTS!'),callLand(a.id,thing));
 else if(tier==='good')beats.push(ringBeat('crowd',a.role==='Face'?crowdHeckles[a.id]:'BOOOOO!','shout'),callLand(a.id,thing));
 else if(tier==='fair')beats.push(ringBeat('commentary',`A solid response from the room. Not the loudest night ${a.name} has had, but the point gets across.`,'action'));
 else if(tier==='flat')beats.push(ringBeat('commentary',`${a.name} lowers the microphone as the room murmurs around them. It never quite catches.`,'action'));
 else beats.push(ringBeat('commentary',`${a.name} pauses for a response. A few scattered voices answer before the room falls quiet.`,'action','CRICKETS'),callSlip(a.id,thing));
 beats.push(ringBeat('commentary',r?`${r.name} backs toward the curtain, still watching ${a.name}.`:`${a.name} hands the microphone back and turns toward the ring.`,'action'));
 return {beats,title,labelTag,preview,tier};
}
function matchBranch(choice,segment,moment){
 const lead=w(segment.winner),p=ringPersonalities[lead.id],other=w(matchOpponents(segment,lead.id)[0]),q=ringPersonalities[other.id],v=ringVoices[lead.id],ov=ringVoices[other.id];
 const side=matchSides(segment).find(ids=>ids.includes(lead.id)),third=moment.actors.find(id=>id!==lead.id&&id!==other.id);let beats=[],title,labelTag,preview;
 const tier=callTier(choice.delta??0),hit=['great','good'].includes(tier),miss=['flat','miss'].includes(tier);
 const action=(text,cue='')=>beats.push(ringBeat('commentary',text,'action',cue));
 const crowdPop=(id=lead.id)=>beats.push(ringBeat('crowd',w(id).role==='Face'?crowdHeckles[id]:'BOOOOO!','shout'));
 const verb=[1,17,31].includes(lead.id)?'locks in':'lands';
 if(choice.tag==='Signature sequence'){
  title=`${lead.name} goes for the ${p.move}`;labelTag='The opening';preview=`Bait ${other.name}’s ${q.counter}, then go for the ${p.move}.`;
  beats.push(ringBeat(other.id,ov.reply(v.subject)));
  if(tier==='great'){action(`${other.name} reaches for the ${q.counter}. ${lead.name} slips the grip and ${verb} the ${p.move}. Picture perfect. The whole building feels it.`,'PERFECT!');beats.push(callLand(lead.id,`the ${p.move}`));crowdPop()}
  else if(tier==='good'){action(`${other.name} reaches for the ${q.counter}. ${lead.name} slips the grip and ${verb} the ${p.move} clean.`,'CLEAN!');beats.push(callLand(lead.id,`the ${p.move}`))}
  else if(tier==='fair'){action(`${other.name} gets a piece of the ${q.counter}. ${lead.name} muscles through and ${verb} the ${p.move}. Not pretty, but it counts.`);beats.push(ringBeat(lead.id,v.close(ov.subject)))}
  else{action(`${other.name} sees the ${p.move} coming and gets a piece of the ${q.counter}. The setup falls apart.`,'MISTIMED!');beats.push(callSlip(lead.id,`the ${p.move}`))}
 }else if(choice.tag==='Give both a moment'){
  title=`${other.name} fights back`;labelTag='The counter';preview=`Let ${other.name} hit the ${q.move}. ${lead.name} has to answer it.`;
  if(hit){action(`${other.name} catches ${lead.name} with the ${q.move}. Crisp, right on cue.`,'BACK AND FORTH!');beats.push(callLand(other.id,`the ${q.move}`));action(`${lead.name} sells it, rises at the ropes, and catches the next rush with a ${p.counter}.`);beats.push(ringBeat(lead.id,v.reply(ov.subject)));if(tier==='great')beats.push(ringBeat('crowd','BOTH OF THEM! BOTH OF THEM!','shout'))}
  else if(tier==='fair'){action(`${other.name} lands the ${q.move}, a little tentatively. ${lead.name} waits a beat too long before the ${p.counter}.`);beats.push(ringBeat(other.id,ov.close(v.subject)),ringBeat(lead.id,v.reply(ov.subject)))}
  else{action(`${other.name} goes for the ${q.move} a step early. ${lead.name} isn’t there yet, and both of them stall in the middle of the ring.`,'MISTIMED!');beats.push(callSlip(other.id,`the ${q.move}`));action(`${lead.name} improvises a ${p.counter} to get things moving again. The front row noticed.`);beats.push(callSlip(lead.id,'that exchange'))}
 }else if(choice.tag==='Teamwork'){
  const ally=w(side.find(id=>id!==lead.id));title=`${ally.name} takes the hot tag`;labelTag='The partner';preview=`${lead.name} fights to the corner to tag in ${ally.name}.`;
  action(`${lead.name} slips past ${other.name} and stretches toward ${ally.name}.`);beats.push(ringBeat(ally.id,'Right here! Make the tag!'));
  if(hit){action(`${lead.name} dives for the corner. ${ally.name} tags in and sends ${other.name} reeling. The partners move like one unit.`,'HOT TAG!');beats.push(callLand(ally.id,'that tag'));crowdPop(ally.id)}
  else if(tier==='fair'){action(`The tag lands a beat late. ${ally.name} has to fight off ${other.name}’s first rush before the team gets rolling.`);beats.push(ringBeat(ally.id,ringVoices[ally.id].close(ov.subject)))}
  else{action(`${ally.name} reaches too early and the referee waves it off. ${other.name} drags ${lead.name} back to the middle.`,'MISSED TAG!');beats.push(callSlip(ally.id,'that tag'));action(`${lead.name} finally crawls over and makes the real tag.`)}
  if(side.length>2)action(`${w(side.find(id=>id!==lead.id&&id!==ally.id)).name} cuts off the attempted save.`);
 }else if(choice.tag==='Watch every rival'){
  const extra=w(third);labelTag='The interruption';title=`${extra.name} crashes the exchange`;preview=`${extra.name} is still in this. ${lead.name} has to deal with them.`;beats.push(ringBeat(extra.id,ringVoices[extra.id].reply(ov.subject)));
  const text=matchFormat(segment)==='royal'?`${extra.name} charges. ${lead.name} sidesteps and sends them over the top rope.`:segment.type==='Ladder match'?`${extra.name} reaches the upper rungs. ${lead.name} pulls the ladder away from the prize.`:segment.type==='Submission match'?`${other.name} locks in a hold. ${extra.name} breaks the grip before ${lead.name} can tap.`:segment.type==='Tables match'?`${extra.name} slides a table toward the corner. ${lead.name} sees it coming and pulls the fight back toward the middle.`:segment.type==='Last person standing'?`${extra.name} rises at eight and pulls ${lead.name} away from ${other.name}. The referee stops the count as the fight spills across the ring.`:segment.type==='Steel cage'?`${extra.name} heads up the cage wall. ${lead.name} drags them back down.`:`${other.name} reaches for a cover. ${extra.name} breaks it up, leaving ${lead.name} just enough space to recover.`;
  action(text,hit?'CHAOS!':'');
  if(hit){beats.push(callLand(lead.id,'that scramble'));crowdPop()}
  else{action(`For a moment nobody is sure who should be where. ${extra.name} and ${other.name} nearly collide with each other.`);beats.push(callSlip(lead.id,'that scramble'))}
 }else if(choice.tag==='Play the stipulation'){
  labelTag='The danger';title={'Steel cage':`${lead.name} guards the cage door`,'Tables match':'The table waits at ringside','Submission match':`${lead.name} works the hold`,'Last person standing':'The count reaches nine'}[segment.type]||`${lead.name} presses forward`;
  const text={'Steel cage':`${lead.name} blocks the cage door. ${other.name} has to turn back and fight.`,'Tables match':`${other.name} sets the table in place. ${lead.name} reverses the next rush, leaving them balanced dangerously against its edge.`,'Submission match':`${lead.name} catches an arm and rolls into a hold. ${other.name} claws toward the bottom rope.`,'Last person standing':`${other.name} drags themself upright at nine. ${lead.name} steadies against the ropes and comes forward again.`}[segment.type]||`${lead.name} drives the fight back toward ${other.name}.`;
  preview=choice.title||text;action(text,hit?'THE STIPULATION BITES!':'');
  if(hit){beats.push(callLand(lead.id,'that'));crowdPop()}
  else beats.push(ringBeat(other.id,ov.close(v.subject)),ringBeat('commentary',`It works, but ${lead.name} has to fight harder than planned to keep control.`,'action'));
 }else{
  const story=choice.tag==='Tell the story';labelTag=story?'Rivalry':'Showmanship';title=`${lead.name} refuses to back down`;
  preview=story?`${lead.name} drops the usual routine and goes straight at ${other.name}.`:choice.detail||`${lead.name} ${p.bit}.`;
  action(story?`${lead.name} starts the familiar routine, stops, and goes straight after ${other.name}.`:segment.type==='Ladder match'?`${lead.name} ${p.tell} on the second rung. ${other.name} rattles the ladder, forcing them back down.`:segment.type==='Office Supplies Deathmatch'?`${lead.name} ${p.bit}. ${other.name} sends a folder sailing past, and the referee ducks a shower of loose paper.`:`${lead.name} ${p.bit}.`);
  beats.push(ringBeat(other.id,ov.reply(v.subject)));
  if(hit){beats.push(callLand(lead.id,story?'that stare':'the bit'));crowdPop();action(`${other.name} rushes in. ${lead.name} turns to meet the attack.`)}
  else if(tier==='fair'){beats.push(ringBeat(lead.id,v.close(ov.subject)));action(`A few laughs and a few groans. ${other.name} rushes in. ${lead.name} turns to meet the attack.`)}
  else{action(story?`The stare-down drags on. Somebody in the back row yells for the wrestling to start again.`:`The bit runs long. A crowd waiting for wrestling starts to murmur.`,'TOO LONG!');beats.push(callSlip(lead.id,story?'that stare':'the bit'));action(`${other.name} rushes in. ${lead.name} turns to meet the attack.`)}
 }
 if(tier==='great')action(`The front row rises as ${lead.name} pushes forward.`);
 const end=finishBeats(segment,choice);beats.push(...end.beats);return {beats,title,labelTag,preview,tier,featured:end.finisher};
}
function kayfabeMoment(moment,segment,index){
 const opening=[...memoryBeat(segment),...ringOpening(moment,segment)];
 const result={...moment,dialogueVersion:6,opening};
 result.setup=segment.kind==='promo'?`${w(segment.a).name} has the microphone. ${segment.target!=null?w(segment.target).name+' is the named target.':'This address is for the audience.'}`:`The booked winner is ${w(segment.winner).name}. Your call shapes the action before the finish.`;
 if(segment.kind==='promo')result.context=`${segment.scene||'Solo address'} · ${segment.hook}`;
 result.choices=moment.choices.map((original,option)=>{
  const scene=segment.kind==='promo'?promoBranch(original,segment,moment):matchBranch(original,segment,moment),intent=momentIntent(original,segment);
  const title=segment.kind==='promo'?scene.title:original.title;
  return {...original,...scene,...intent,title,detail:scene.preview,sceneTitle:scene.title,outcome:beatStory(scene.beats),sceneVersion:5,option,segment:index};
 });
 const special=signatureFor(segment);
 if(segment.kind==='match'&&special){
  const owner=matchPeople(segment).find(id=>CHARACTER_SPECIALS[id]===special);
  result.opening.unshift(ringBeat('commentary',`${special.name}: a character showcase with standard pinfall or submission rules. ${w(owner).name} ${ringPersonalities[owner].bit}.`,'action'));
 }
 return result;
}
function ensureKayfabeLive(){
 const live=state.liveShow;if(!live)return;let changed=false;
 live.moments=live.moments.map((moment,index)=>{
  if(moment.dialogueVersion===6)return moment;
  const segment=state.card[index],answer=live.answers[index];
  if([4,5].includes(moment.dialogueVersion)&&answer)return moment;
  changed=true;
  const updated=segment.kind==='promo'?promoMoment(segment,index):matchMoment(segment,index);
  if([4,5].includes(moment.dialogueVersion))return {...updated,opening:moment.opening??updated.opening};
  if(answer&&!answer.beats?.length){
   const oldChoice=moment.choices[answer.option??0];
   if(oldChoice){
    const scene=segment.kind==='promo'?promoBranch(oldChoice,segment,moment):matchBranch(oldChoice,segment,moment);
    live.answers[index]={...answer,beats:scene.beats,featured:scene.featured};
   }
  }
  if(live.exchanges)live.exchanges[index]={intro:0,result:0};
  return updated;
 });
 if(changed)save();
}
