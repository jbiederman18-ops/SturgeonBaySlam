'use strict';
// Each voice answers a shared topic. Openers, rebuttals and follow-ups belong to one scene.
const ringVoices=[
 {subject:"your Greco Wrestling picture",open:"Athens, I’m making a picture about Greco Wrestling. I came down here to find out what it feels like when you’re all looking at me.",reply:t=>`${capTopic(t)}? I’d like to see what Athens makes of that when the bell rings.`,close:t=>`Bring ${t}. I want to see what the front row remembers once we’re done.`,crowd:"Keep that up, Athens. I want to remember how it sounds from the ring."},
 {
  subject:"your two holds",open:"Hold One. Hold Two. Then back to One. We can do this all evening.",reply:t=>`${capTopic(t)} sounds like an elaborate way to ask for Hold One.`,close:t=>`After ${t}, Hold Two. Then we’ll check the pressure on Hold One again.`,crowd:"Keep counting. We’re starting back at One.",
  interrupt:"Keep talking. I’m on Hold Two. Back to Hold One in a second.",
  heartAnswer:"You’ve got time to tell me where the pressure slipped. I’ll start with Hold One again.",
  showAnswer:"Good. They’re looking. Hold One first, then Hold Two.",
  tagCall:"One step. Two steps. Tag. Good. Now Hold One."
 },
 {subject:'your playbook',open:'I only need one play. Put me in front of you and find out.',reply:t=>`${capTopic(t)} looks impressive from the sidelines. Try stopping me on the field.`,close:t=>`I heard all about ${t} before I got here. I showed up anyway.`,crowd:'I am right here! Now give me somebody to run through!'},
 {subject:"your whole stable",open:"We took a vote. The boys are unanimous. We want both tag titles.",reply:t=>`The boys discussed ${t}. A lively debate, with excellent attendance.`,close:t=>`Bring ${t}. Our corner is full, so don’t send anybody over to help.`,crowd:"The boys can hear you! We’re all right here!"},
 {subject:"your list of grievances",open:"I remember what you did last time. I thought I’d give you a moment to remember it too.",reply:t=>`I’ll fold ${t} in with the rest. I never run out of room.`,close:t=>`We can discuss ${t} after the main event. I expect to be in it.`,crowd:"I heard you the first time. I wrote that down too."},
 {subject:"your pending appeal",open:"I have reviewed the footage. It confirms the parts I intend to submit.",reply:t=>`${capTopic(t)} is admissible when I do it. I can explain the distinction at length.`,close:t=>`Save ${t} for the hearing. I object to the idea that there will be a result to appeal.`,crowd:"A foul? I’m grateful the referee saw such exemplary sportsmanship."},
 {subject:"your credentials",open:"The announcement is short. Doctor. If you need help with the pronunciation, I can wait.",reply:t=>`We can discuss ${t} after the title is correctly entered on the card.`,close:t=>`I’ll discuss ${t} with someone who has acknowledged my credentials.`,crowd:"Thank you. The title is Doctor. You can all say it together."},
 {subject:'your close-up',open:'The camera is here for me. Try not to block the shot when you fall.',reply:t=>`${capTopic(t)} can wait. The camera has already found the star.`,close:t=>`Nobody bought a ticket for ${t}. They came to see how I end this.`,crowd:'Then keep your eyes open. This is the close-up they will replay.'},
 {subject:"your freeze ray",open:"Freeze right there. This ray is nearly ready. There’s already a puddle.",reply:t=>`Put ${t} on ice. Or in ice. The technical details are still chilling.`,close:t=>`Bring ${t} and a thermometer that can go below wet.`,crowd:"Keep that noise down. I’m trying to make the temperature drop."},
 {subject:'those mouse ears',open:'Call me adorable again. I want the whole room to hear it before I lift you.',reply:t=>`Keep looking at ${t}. It will give you something to think about on the way down.`,close:t=>`If ${t} is so impressive, why are you still worried about somebody my size?`,crowd:'Small ears. Big suplex. You already know the words!'},
 {
  subject:'your broom',open:'I have cleaned up after everyone in this company. Your turn.',reply:t=>`${capTopic(t)}? Fine. I have cleaned up bigger messes than that.`,close:t=>`I am not asking ${t} for permission. Move aside. I have work to do.`,crowd:"Keep chanting; I am cleaning every last scrap before this bell.",
  interrupt:"Hold that thought. Who tracked this bloody grit across my floor?",
  heartAnswer:"I hear you, boss. Lift your heel for a second. There’s a whole pile under it.",
  showAnswer:"You got their attention. Good. Tell the bastards where the bins are while I sweep.",
  tagCall:"Tag me in, boss. There’s grit under the bottom rope. I can reach it once I’m in."
 },
 {subject:'your guest list',open:'You needed a ticket. I am on the list. We are not arriving at the same place.',reply:t=>`I asked about ${t} at the door. Nobody put it on the list.`,close:t=>`Good luck with ${t}. I will be waiting in the part of the building you cannot get into.`,crowd:'The list is confidential. Very exclusive. You would not recognize the handwriting.'},
 {subject:"your safety briefing",open:"Technically, the apron is a controlled crossing. Look both ways before I put you on it.",reply:t=>`Before we address ${t}, you misused the word hazard. I have a handout.`,close:t=>`Bring ${t}. Take the side street. I can explain why the whole way there.`,crowd:"It’s a safety vest. A badge would be an entirely different piece of equipment."},
 {subject:'your rocket',open:'The countdown is nearly over. Please clear the launch area.',reply:t=>`${capTopic(t)} is taking up space in my launch area. Move it.`,close:t=>`Hold on to ${t}. The next part comes with turbulence.`,crowd:'Ten seconds to liftoff. Front row, make the noise for me!'},
 {subject:"your dad’s seat",open:"Have you heard of my dad? He was in Jerry Maguire. I saved him a seat.",reply:t=>`We can talk about ${t} in a second. Did I mention my dad was in Jerry Maguire?`,close:t=>`Bring ${t}. If you see Dad on the way, tell him I’m about to go on.`,crowd:"Thanks! Dad, are you hearing this?"},
 {subject:"your parallel route",open:"Walk alongside me. One of these days we might find a way to meet.",reply:t=>`${capTopic(t)} is welcome in the next lane. Stay there.`,close:t=>`Bring ${t} beside me. We can see where the routes end without crossing them.`,crowd:"Side by side. If you can see daylight between us, that’s deliberate."},
 {subject:'your tea party',open:'You are late for your own defeat. I have already put the kettle on.',reply:t=>`${capTopic(t)} would make a lovely guest at my tea party. Shame about the manners.`,close:t=>`Set ${t} beside the teapot. I want both hands free for this next bit.`,crowd:'The kettle is on. The invitation, regrettably, is not optional.'},
 {subject:'your insurance policy',open:'Your comeback is not covered under this policy.',reply:t=>`I checked ${t}. The coverage runs out the moment I get hold of you.`,close:t=>`You should have declared ${t} before we entered the ring. Now the claim is contested.`,crowd:'Read it carefully! I charge extra for a rope break.'},
 {
  subject:'those lovely manners',open:"Please accept a complimentary injury report. The transport home is extra.",reply:t=>`Thank you for bringing ${t}. The auction can begin after the bell.`,close:t=>`Please leave ${t} with the belongings. Collection hours are extremely limited.`,crowd:"Thank you for the noise. Please keep screaming until the liability waiver has been signed.",
  interrupt:"Please continue. The family should hear the last words while the seats are still good.",
  heartAnswer:"Thank you for sharing. Please leave the tenderest detail with the announcer for use after the loss.",
  showAnswer:"Such a lovely crowd. Please start the collection for the next injury before anybody has time to ask where the money goes.",
  tagCall:"Please make the tag. The injured partner can crawl back during the applause."
 },
 {subject:'your feed',open:'I have read every reply. You are about to give me a new one.',reply:t=>`${capTopic(t)} is getting a lot of attention for something nobody asked to see.`,close:t=>`Say one more thing about ${t}. I want the room to remember it when you lose.`,crowd:'Log off? This is the only place I can hear the replies in person!'},
 {
  subject:'your love letters',open:"I adore this whole room, and I have saved my biggest wrestling hug for the other corner!",reply:t=>`${capTopic(t)}? I love how much it means to you! Bring it closer!`,close:t=>`Bring ${t}; this welcome has room for absolutely everything you care about!`,crowd:"Such passionate voices! I love you louder every time!",
  interrupt:"You were thinking of ME? I have so much to say back!",
  heartAnswer:"I love that you told me! I’m going to cheer for you so loudly you can hear me while we wrestle!",
  showAnswer:"They love you! I love you! Do you think there’s time for all of us to hug before the bell?",
  tagCall:"I LOVE what you’re doing! Tag me and I can love it from in there!"
 },
 {subject:'your guitar solo',open:'I have played small rooms louder than this. Let us find out what you have got.',reply:t=>`${capTopic(t)} sounds like the warm-up act. I am waiting for the heavy part.`,close:t=>`Turn ${t} up. I want it loud enough to cover the sound of you hitting the mat.`,crowd:'The big finish? You have not even heard the second verse.'},
 {subject:"your side of the ring",open:"If you can see my face, tell the people behind me I’m in the match.",reply:t=>`${capTopic(t)} can come around to this side. I’m staying put.`,close:t=>`Bring ${t} over here. I’ll be flat in exactly this direction.`,crowd:"That was me! I was here the whole time!"},
 {subject:'your sweet little act',open:'Sweet entrance. Bitter ending. You will acquire the taste.',reply:t=>`${capTopic(t)} needs a little bite. Let me add some.`,close:t=>`Careful with ${t}. I would hate for this to leave a sour taste.`,crowd:'You wanted zest? Open wide.'},
 {subject:"your invitation to fellowship",open:"The Lord sees every person in this room. If you need someone to pray with after the bell, I’ll be at the fellowship table.",reply:t=>`Bring ${t} and sit with me. There’s room for the question and room for a cup of punch.`,close:t=>`Bring ${t}. The Lord can meet us right where we are. The fellowship table opens after the bell.`,crowd:"Amen. And somebody put another leaf in the table. We’ve got more people coming."},
 {subject:'your beat drop',open:'You are the warm-up. I am the drop they came to hear.',reply:t=>`${capTopic(t)} is off the beat. I can hear it from here.`,close:t=>`Try keeping ${t} in time. I am about to change the rhythm.`,crowd:'Wait for it. Wait for it. Now!'},
 {subject:"your match structure",open:"Shine, heat, comeback, finish. In that ordah. What are we doin’ heah otherwise?",reply:t=>`You can give ${t} all the stars you want. Where’s the heat? Where’s the comeback?`,close:t=>`Pahk ${t} for a minute. The finish hasn’t earned its turn yet.`,crowd:"I’ll give it stars aftah the bell. First let the comeback breathe."},
 {subject:'your sightseeing map',open:'I have seen the sights. You are about to become one.',reply:t=>`I looked for ${t} on the map. It is right beside the exit.`,close:t=>`Smile beside ${t}. This is going on a postcard.`,crowd:'I took the scenic route. There is still plenty to discover around here!'},
 {subject:"your best angle",open:"Stand beside me. We can compare jawlines while the audience comes to the obvious conclusion.",reply:t=>`${capTopic(t)} photographs well. In a group shot I would still stand in front.`,close:t=>`Bring ${t} into better light. We owe the audience a fair comparison before I win it.`,crowd:"Ten? Thank you. I was worried you’d only counted the left side."},
 {subject:"your reserved berth",open:"I’ll be in the ring when I’ve finished docking. You can sit until then.",reply:t=>`${capTopic(t)} can come aboard. Give the little ones time to move over.`,close:t=>`Leave ${t} by the gangway. I’ll get to it after we’ve all settled.`,crowd:"Slowly, please. There are small guests on deck."},
 {subject:"your full serving",open:"Everybody eats. There’s a whole meal in this pocket, and the middle is a little dangerous.",reply:t=>`There’s room for ${t} at the table. I brought enough for both corners.`,close:t=>`Keep ${t} warm. I’ll make sure nobody leaves hungry.`,crowd:"Full plates, front row! Let the middle cool before you take a bite."},
 {
  subject:'your neutral position',open:"Both corners have had a turn to speak. Both corners may now have a turn to STOP.",reply:t=>`The record acknowledges ${t} without endorsement. Further comment is increasingly unwelcome.`,close:t=>`No position on ${t}. If debate continues after the bell, I will adjourn both corners.`,crowd:"Both chants have been acknowledged. Equal silence would now be appreciated.",
  interrupt:"Before either corner issues a rebuttal, I’d like to remind BOTH corners that silence is available.",
  heartAnswer:"The statement has been heard. The response will be neither agreement nor disagreement. That is the ENTIRE response.",
  showAnswer:"The audience has responded. Anybody who wishes to dispute the response may do so silently, from either exit.",
  tagCall:"Tag if needed. The tag expresses no position on this argument."
 },
 {subject:"your tied laces",open:"Both halves here. Left a little ahead. Rudy, if you need us, we’re ready.",reply:t=>`We can get past ${t} together. Nobody unties anything.`,close:t=>`Bring ${t}. We’ll get there as a pair. Tell Rudy to look down.`,crowd:"Both boots! Count the laces if you lose track of us."},
 {subject:'your dessert spoon',open:'You have had the main course. Here comes the finish.',reply:t=>`${capTopic(t)} looks a little light. I brought something that will stick to your ribs.`,close:t=>`Leave room for ${t}. I am not done serving yet.`,crowd:'The proof is right here! Stand back. It is about to wobble.'}
];

ringVoices.push(
 {
  subject:"your comeback",open:"Hold my drink. No, the other one. The one I haven’t finished. Right, who am I fighting?",reply:t=>`${capTopic(t)}? I have had worse pitches over better whiskey.`,close:t=>`Bring ${t}; I have been promised a fight and I intend to enjoy it.`,crowd:"Say the name again; I have missed that more than the trailers.",
  interrupt:"Hang on, was that my name? Say it again. Then tell me if we’re fighting.",
  heartAnswer:"That’s a good speech. I had one like that in a picture once. I spent the whole thing waiting for the punch.",
  showAnswer:"They’re still looking. Quick, hit me before somebody calls for an autograph.",
  tagCall:"Tag me. No, now. I’ve been waiting since the second drink."
 },
 {subject:'your strong roots',open:'This is a contact sport. I am the contact your dentist warned you about.',reply:t=>`I checked ${t}. Not nearly enough enamel.`,close:t=>`Brace ${t}. This next part has real bite.`,crowd:'The crown is not decorative. Neither is this one!'},
 {subject:'your other invitations',open:'Yes, I could be elsewhere. Yes, I chose here. Let us all remember that.',reply:t=>`I could discuss ${t} in any number of venues. I have generously selected this one.`,close:t=>`Bring ${t} to the ring I deliberately came to. I will be there by choice.`,crowd:'Of course I am here! I selected here! Please make the distinction.'},
 {
  subject:'your rulebook',open:'I am a dog. I read the rules. Nothing says dogs cannot wrestle. Ring the bell.',reply:t=>`I checked ${t}. Still no rule against a dog wrestling.`,close:t=>`Bring ${t}. Dog brought the rulebook. Can we wrestle now?`,crowd:'You heard the room. Let this dog wrestle!',
  interrupt:"Dog heard the bell. Was that the bell? Dog is ready either way.",
  heartAnswer:"Dog heard you. Dog checked the rules, too. Both of us can wrestle.",
  showAnswer:"Crowd is watching. Ref is watching. No rule against it. Ring the bell for the dog!",
  tagCall:"Here! Dog can tag. Dog checked that page."
 }
);

// How a call went, in each wrestler's own voice. `land` follows a clean hit; `slip` covers a mistake.
// Each takes a noun phrase such as “the Olympus Driver” or “that tag”.
const callLines=[
 {land:x=>`${capTopic(x)}! Remember the sound Athens made when that landed.`,slip:x=>`${capTopic(x)} looked much better in my notes. Keep watching, Athens.`},
 {land:x=>`${capTopic(x)}. Hold One into Hold Two. Straight back to Hold One.`,slip:x=>`${capTopic(x)} slipped. Next drill: Hold One, Hold Two, repeat.`},
 {land:x=>`Did you see ${x}? Somebody tell coach I got in the game!`,slip:x=>`Fumbled ${x}. Doesn’t matter. I always get back up.`},
 {land:x=>`${capTopic(x)}. Credit the boys. We voted on that in the huddle.`,slip:x=>`${capTopic(x)} needs a meeting. Some of us have concerns.`},
 {land:x=>`${capTopic(x)}. That’s the one I owed you from last month.`,slip:x=>`${capTopic(x)} didn’t land. I’ll remember where it went wrong. I remember most things.`},
 {land:x=>`Let the record show ${x} was excellent sportsmanship. There is no need to view the other camera.`,slip:x=>`${capTopic(x)} is under appeal. Especially the part where somebody saw it.`},
 {land:x=>`${capTopic(x)}. A successful demonstration. Please credit the Doctor.`,slip:x=>`${capTopic(x)} requires another trial. The credentials are settled.`},
 {land:x=>`Tell me the camera got ${x}. That is the highlight reel.`,slip:x=>`Cut. We are reshooting ${x}. Nobody saw that take.`},
 {land:x=>`${capTopic(x)}! Look at the puddle. That’s how you know the ray is freezing.`,slip:x=>`${capTopic(x)} missed. It’s an ice aim issue. Give me the ray back.`},
 {land:x=>`Small ears. Big result. Did everybody see ${x}?`,slip:x=>`Still think I’m adorable after ${x}? Good. Keep underestimating me.`},
 {land:x=>`${capTopic(x)}. Clean sweep. Somebody fetch the dustpan.`,slip:x=>`${capTopic(x)} made a mess; move your boots, I am cleaning it now.`},
 {land:x=>`${capTopic(x)}. VIP section only. You were not on the list.`,slip:x=>`${capTopic(x)}? That was not me. Check with my people.`},
 {land:x=>`${capTopic(x)}. Correct term, correct route, technically avoidable outcome.`,slip:x=>`${capTopic(x)} didn’t fail. It demonstrated a preventable hazard. There’s a difference.`},
 {land:x=>`${capTopic(x)}! We have liftoff!`,slip:x=>`${capTopic(x)} was a scrubbed launch. Resetting the countdown.`},
 {land:x=>`${capTopic(x)}! Can somebody tell Dad? He was in Jerry Maguire.`,slip:x=>`${capTopic(x)} needs another try. Dad might not have been looking yet.`},
 {land:x=>`${capTopic(x)}. Same direction. Never had to cross over.`,slip:x=>`${capTopic(x)} took me into the wrong lane. I’m moving back beside it.`},
 {land:x=>`${capTopic(x)}! Somebody pour the tea, this calls for a toast!`,slip:x=>`${capTopic(x)} spilled. Clean cup! Move down!`},
 {land:x=>`${capTopic(x)}. Fully covered. Claim approved.`,slip:x=>`${capTopic(x)} falls under a minor exclusion. I am filing an appeal.`},
 {land:x=>`Delightful. Please add ${x} to the itemized list of damages.`,slip:x=>`Terribly sorry about ${x}. Please hold the guest still for the second attempt.`},
 {land:x=>`Clip ${x}. Post it. The replies are going to be incredible.`,slip:x=>`${capTopic(x)} is being taken out of context. Posting the whole thing again.`},
 {land:x=>`${capTopic(x)}! A great big wrestling thank-you!`,slip:x=>`${capTopic(x)} needs another try; luckily I have SO much affection left!`},
 {land:x=>`${capTopic(x)}! Hit the loud chord and let the ring shake!`,slip:x=>`${capTopic(x)} was a little off key. We’re playing it again, louder.`},
 {land:x=>`${capTopic(x)}. Did they see me that time?`,slip:x=>`${capTopic(x)} landed behind me. I’ll wait here until it comes around.`},
 {land:x=>`${capTopic(x)}. Sweet, sharp, and right on the tongue.`,slip:x=>`${capTopic(x)} came out a little sour. I prefer it that way.`},
 {land:x=>`${capTopic(x)}! Thank the Lord for the strength to finish. Come give thanks with me afterward.`,slip:x=>`${capTopic(x)} didn’t land. I can pray and try again. The Lord has time.`},
 {land:x=>`${capTopic(x)}! Right on the drop!`,slip:x=>`${capTopic(x)} was off the beat. Run it back. I’m remixing.`},
 {land:x=>`${capTopic(x)}. There’s your comeback. Now earn the finish, kid.`,slip:x=>`${capTopic(x)} belongs latah in the match. Ya can’t have a comeback without the heat.`},
 {land:x=>`${capTopic(x)}! Somebody take a picture. That’s going on the postcard!`,slip:x=>`Wrong turn on ${x}. Lovely view, though.`},
 {land:x=>`${capTopic(x)}. It looks even better from my side. Every side is my side.`,slip:x=>`${capTopic(x)} looked unfortunate from that angle. I’ll give the room another one.`},
 {land:x=>`${capTopic(x)}. Berth secured. Give the passengers a minute to disembark.`,slip:x=>`${capTopic(x)} needs another approach. We’ll take it at docking speed.`},
 {land:x=>`${capTopic(x)}! A whole meal, served hot. I brought enough to share.`,slip:x=>`${capTopic(x)} needs another minute in the oven. Nobody’s leaving hungry.`},
 {land:x=>`The record shows ${x} worked. This finding confers no endorsement.`,slip:x=>`The result of ${x} is recorded. Neither side needs to submit another interpretation.`},
 {land:x=>`${capTopic(x)}! Left first, right behind. Both still tied.`,slip:x=>`${capTopic(x)} pulled on the laces. Wait for the other half before we try it again.`},
 {land:x=>`${capTopic(x)}! The proof is in the pudding!`,slip:x=>`${capTopic(x)} wobbled. I always wobble. Then I set.`},
 {land:x=>`${capTopic(x)}! Get somebody to save that clip. And get somebody else in here to fight me.`,slip:x=>`${capTopic(x)} needs another take. I’m bloody delighted to oblige.`},
 {land:x=>`${capTopic(x)}. Real bite. Tell your dentist.`,slip:x=>`${capTopic(x)} chipped a little. The root is still strong.`},
 {land:x=>`${capTopic(x)}. I could have done that anywhere. I chose to do it here.`,slip:x=>`${capTopic(x)}? I meant that. I choose everything I do here.`},
 {land:x=>`${capTopic(x)}! Good dog! Nothing in the rules says a dog can’t do that!`,slip:x=>`${capTopic(x)} got away from Dog. Dog is ready to chase it down. Ring the bell again.`}
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
  if(a.id===6&&b&&doubtsDoctorate(b.id))return [intro,ringBeat(a.id,'Doctor. The title is settled. There will be no address to that corner.'),ringBeat('commentary',`${a.name} turns away from ${b.name} without taking questions.`,'action')];
  if(b&&(segment.scene!=='Solo address'||['Issue a challenge','Fuel a rivalry'].includes(segment.hook)))return [intro,...(segment.scene==='Interview'?[ringBeat('commentary',`The interviewer asks ${a.name} what they want from ${b.name}.`,'action')]:[]),...(segment.scene==='Interruption'?[ringBeat(b.id,bv.interrupt||'Before you say another word: I heard my name.')]:[]),ringBeat(a.id,opening),ringBeat(b.id,pitch?(bv.heartAnswer||'You want us to believe that? '+bv.reply(av.subject)):bv.reply(av.subject),'speech','HOLD ON!'),ringBeat(a.id,av.close(bv.subject)),ringBeat('commentary',heat>=35?`Neither wrestler looks away. ${a.name} keeps a tight grip on the microphone.`:`${b.name} moves closer to the ropes. The room falls quiet.`,'action')];
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
 const finisher=teamFormat(segment)&&choice.tag==='Teamwork'?w(side.includes(3)?3:side.find(id=>id!==lead.id)):lead;
 const result=[],say=text=>result.push(ringBeat('commentary',text,'action'));
 if(segment.presentation==='Dominant')say(`${lead.name} keeps the opposition on the defensive through the final stretch.`);
 if(segment.presentation==='Upset')say(`${lead.name} finds an opening while the room holds its breath.`);
 if(segment.prop)say(`${SHOW_PROPS[segment.prop]?.name||'The prop'} is part of the scene; the front row recognizes the callback.`);
 if(segment.finish==='Cheating')say(['No disqualification','Tables match','Ladder match','Office Supplies Deathmatch'].includes(segment.type)?`${finisher.name} feigns an injury. ${other.name} hesitates, and the attack comes from the blind side.`:`The referee turns toward a loose turnbuckle. ${finisher.name} catches ${other.name} with a hidden handful of tights.`);
 if(segment.finish==='Interference')say(segment.interferer!=null?`${w(segment.interferer).name} appears at ringside to ${({'Settle a grudge':'settle a grudge','Help an ally':'help an ally','Demand a title shot':'demand a title shot'})[segment.interferenceReason]||'change the outcome'}. ${other.name} turns toward the interruption. ${finisher.name} seizes the opening.`:`A commotion at ringside draws ${other.name}'s attention. ${finisher.name} seizes the opening.`);
 if(matchPeople(segment).includes(1))say(`${w(1).name} switches from Hold Number One to Hold Number Two, then resets for Hold Number One again.`);
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
 if(a.id===6&&r&&doubtsDoctorate(r.id))return {title:'Decline the address',labelTag:'Credentials',preview:'The Doctor refuses to address the doubter.',tier,beats:[ringBeat(a.id,'There is no debate scheduled. Please correct the nameplate.'),ringBeat('commentary',`${a.name} returns the microphone without addressing ${r.name}.`,'action')]};
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
  if(r)beats.push(ringBeat(r.id,rv.heartAnswer||(r.role==='Heel'?`Then prove it. ${rv.reply(v.subject)}`:`I heard every word. ${rv.close(v.subject)}`)));
 }else{
  title='Go big with the gimmick';
  labelTag='Showmanship';thing='the bit';
  preview=`${a.name} ${p.stunt}.`;
  beats=[ringBeat('commentary',preview,'action'),ringBeat(a.id,showpiece[1])];
  if(r)beats.push(ringBeat(r.id,hit?(rv.showAnswer||'All right. You have their attention. Now try keeping it when I get hold of you.'):rv.reply(v.subject)));
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
 }else if(choice.tag==='Teamwork'&&side.includes(3)){
  title='One Man waves off the tag';labelTag='The stable';preview='One Man insists the boys have the situation in hand.';
  action(`${w(3).name} waves away the offered tag and consults the boys. The discussion is entirely internal.`);
  beats.push(ringBeat(3,hit?'Unanimous. We’ll take it from here.':'Motion to accept outside assistance denied. The boys will need a minute.'));
 }else if(choice.tag==='Teamwork'){
  const ally=w(side.find(id=>id!==lead.id));title=`${ally.name} takes the hot tag`;labelTag='The partner';preview=`${lead.name} fights to the corner to tag in ${ally.name}.`;
  action(`${lead.name} slips past ${other.name} and stretches toward ${ally.name}.`);beats.push(ringBeat(ally.id,ringVoices[ally.id].tagCall||'Right here! Make the tag!'));
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
