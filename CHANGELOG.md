# Wrestler dilemmas · version 7.97

- The featured eight bring decisions to the booker’s door. Choices can reserve a spot, change a finish, put someone off the card, cost money, or come back as a live interruption.
- A complaint about Hold Two can leave the Man of 2 Holds with just Hold One or send him away to retrain. His 2 Towers pitch can bring a backlash, four missed shows, and a call from the local paper.
- Dilemma decisions, absences, reserved guest bookings, and live interruptions carry through career saves.

# Clearer dialogue · version 7.96

- Greek wants to become the biggest name in Greco Wrestling so he can make a picture about what it feels like to wrestle. His evenings, promos and backstage scenes follow that research, and the welcome makes his grudge with Liam easier to follow.
- Swept the other seven featured wrestlers’ evenings, backstage reactions, promos and match dialogue against their original character notes. Interruption, promo and tag replies now use their own voices.
- 2 Holds and the Dog name the escape they are arguing about. The hallway uses the Dog’s short name in dialogue and keeps his full name on the card.
- Reworked backstage lines that assumed a match had happened when someone might have only cut a promo. After a multi-person loss, the walk and its rematch offer name someone from the winning side.

# Backstage replies · version 7.95

- Fixed a freeze where the next wrestler's replies stayed grayed out after you answered someone in the hallway.

# Choose on the map · version 7.94

- **One night at a time.** The town map shows only the night you're looking at, and only the people free that night. Tap a day on the ribbon to switch nights.
- **The map is how you choose.** Pins of people you could see pulse. Tap one and their invitation comes up under the map with one button to go see them. Tap the other pin to change your mind.
- The night tabs under the map are gone; the ribbon does that job. Everyone else is still in the Locker Room below.

# Four tabs · version 7.93

- **Road, Book, Town, Roster.** The bottom bar is down to four tabs.
- **Road** is your week at a glance: the show, standings, era progress, the Good Lord Above's file, the press call, the champion and your last two shows. Every older show, the promotion's money, crew, hall, tour and season strategy, and settings and backups each fold away at the bottom.
- **Book** keeps the story planner under the card.
- **Town** keeps the one promise ledger. "Who feels what" now folds away.
- **Roster**'s Teams tab now holds your tag teams.
- **Gone:** the Decisions tab (and its old invitation list, which skipped the town map), the Shows tab and the Creative screen. Everything they held lives in the four tabs above.
- The tour stops at the new tabs, and the desktop sidebar credits the Wisconsin Wrestling Alliance.

# Who you see shows up on the card · version 7.92

- **Ride or die.** Keep a small inner circle (four or fewer devoted) and they'll take bookings anyone else would resent: they lose without a morale or popularity hit, work twice in a night without the repeat penalty, carry the main event (a bigger lift on show night), and let one broken promise go each era. The Ask is never forgiven.
- **The room covers for you.** With the whole room behind you, one promise a show can slide a week instead of breaking (never an Ask), tag matches, multi-person matches and face-to-face promos gel, and "make do" on the week's problem costs no quality.
- **The card as an apology.** Give someone you've left cold a real spot (the main event, a title match or their own promo) and their morale holds that week. Show-night calls warn when someone's been phoning it in.
- **Cues.** The booking sheet and the town map say where the room stands: the whole room, who's ride or die, who's pulling ahead and who's been left cold. Picker cards carry a corner stamp, and the best-fit list suggests your favorites for the main event and the overlooked for a big spot. Pins of people you haven't seen lately fade.
- **Tuning.** The whole room now also needs nobody left cold. "Left cold" now means they've asked since your last evening and it's been seven weeks. A new career starts with nobody seen.
- Forgiven promises show as "Forgiven" in the promise ledger and after the show.

# No wrong way to spend your nights · version 7.91

- **The whole room.** Keep the locker room close: see most of the featured eight every few weeks without playing favorites, and the room is behind you. Each of them leads a little better on show night ("The whole locker room is pulling for this one"), morale rises each week, the era epilogue opens on a good word, and the Good Lord Above writes it down.
- **The overlooked.** Go six weeks without an evening with someone who keeps asking, and their morale slides every week until you show up. Their era epilogue notes that they stopped waiting.
- **Favorites have a price.** Pulling one or two people far ahead of everyone else breaks the whole room until the gap closes. You still get their story and their best ending.
- Balance sweep, 24-week era: spreading evenly finishes no routes but keeps the whole room nearly every week and scores the most show-night bonuses. Mixing a few stories with the rest finishes 3–5 routes and keeps the room some of the time. Going deep on favorites finishes routes fastest but loses the room and leaves people overlooked.

# Choosing who matters · version 7.90

- **People drift.** If you go two weeks without spending an evening with one of the featured eight, what you built starts to wear off, a little each week, never below where they started. Finished routes don't drift, and Sweeps doesn't drift during his spotlight month.
- **Only evenings close the gap.** Kept promises, the backstage walk, booking and other people's evenings still warm someone up, but only so far. The late route beats and the Ask need evenings with that person, close together.
- **The people you've been seeing ask again first.** After an urgent scene, whoever you've had an evening with lately gets first call on your free nights.
- Balance sweep (`node tests/balance-sweep.cjs`): spreading your nights evenly now finishes no routes at any era length and leaves nobody devoted. Following a few stories finishes 3–5 routes in a short era. Before, a careful player could finish 7 of 8, and everyone ended at full trust.

# Free nights now · version 7.89

- **Your current week switches to free nights.** A week planned before 7.86 (three days, one person each) is re-planned as two free nights with a choice of people each, as long as you haven't spent an evening yet. A week already under way keeps its days until next week.

# Status bar fix · version 7.88

- **The menu clears the status bar.** On an installed iPhone app the poster no longer slides up under the clock; a solid strip of the board sits behind the status bar.
- **Fixed:** a week already in progress from before free nights no longer reads "Free Monday and Tuesday and Wednesday nights" on the Road; it shows the free evenings you actually have left.

# Wisconsin Wrestling Alliance · version 7.87

- **Presented by the Wisconsin Wrestling Alliance.** The main menu, the flyer and the home page now credit the WWA instead of Kayfabe Promotions.
- **Main menu tidied.** The three wrestler cards on the poster no longer overlap each other or their name labels, the title stays inside the poster on narrow phones, and the tape no longer covers the top line.

# Free nights · version 7.86

- **Free nights, not invitation days.** Each week you have two free nights (they move around week to week; Liam's Sundays and Sweeps' vigil Friday still claim theirs). Each night offers a choice of two people around town, and you see one of them. The other one that night is passed over. The town ribbon shows your free nights and what's keeping you busy the rest of the week, and the sheet under the map opens on a night and its choices.
- **No more repeated replies.** The reply you pick stays highlighted for a beat and goes in the log; the scene no longer types it out again before the reaction.
- **A real hand-bill.** The print proof at Bertum's is now a two-ink indie wrestling flyer taped to the board: big main event with a VS burst, the undercard under "Plus!", door and bell times, ticket price, local sponsors, fine print and tear-off tabs.
- **New main menu.** The title screen is the promotion's own poster on the same board, starring Greek, Sweeps and the Dog, with the menu as admission tickets.
- Saves from 7.85 keep their current week as it was; the new free nights start next week.

# Lighter repo · version 7.85

- **Unused art removed.** The full-resolution paper atlas PNGs and the expansion-portrait source PNGs are gone (about 25 MB; still in git history). The art style guide and its reference manifest now point at the JPG atlases the game already loads, at the same size.
- No gameplay changes.

# Housekeeping · version 7.84

- **Lighter to work on.** The old pre-rewrite line inventories are gone (they live on in git history), and the finished design handoffs now sit in `docs/design/`.
- **One-command releases.** `./release.sh 7.84` bumps every version string in `index.html` and `sw.js` together.
- No gameplay changes.

# Jesus hears things · version 7.83

- **Jesus drops hints.** After some shows he waves you over at the punch bowl with word from prayer group about how you're doing upstairs, and he can tell when a visit from above is coming.
- **The drama is the job.** Cheating finishes and run-ins no longer count against you at all, Face or Heel. Booking only counts when it reaches life outside the ring: promises, working someone three times in one night, giving someone their spot back. Anything already on file for a finish is forgiven.

# The Ledger · version 7.82

- **He's keeping a ledger.** The Good Lord Above now silently writes down the kind of booker you are, naughty and nice: kept and broken promises, showing up for people, the honest answer, the celebrity over your locker room, raids, scapegoats and more.
- **Visits once or twice an era.** He looks in halfway through an era if you're leaning clearly one way, and always on moving day. Good boys get gifts (cash, forgiveness, a blessed card, a packed house, grace). Naughty ones get punishments (empty chairs, a cursed card, a tithe taken, a blessed rival). Lukewarm gets a look.
- **Three endings.** Claiming the legacy plays the final judgment: Ringside forever, folding chairs forever, or the deepest pit of oblivion. The career goes on after any of them.
- **Heels can cheat in peace.** Only a Face winning by cheating or a run-in counts against you.
- **Fixed:** a new week's act of God now lands right away instead of waiting for a reload.

# Acts of God · version 7.81

- **Little snafus come from above.** The Good Lord Above keeps a file on you: broken promises, cheating and run-in finishes, things you said that got back to someone. When it gets heavy enough He checks in at the start of the week, reads you the charges and smites the show. A clean week means no snafu at all.
- **How you take it matters to Him.** Make do humbly, pay to make it right, turn His punishment into a bit, or blame a wrestler. A bit that lands earns a slow clap from the cheap seats. Blaming someone costs their trust, and it goes in the file. In pen.
- **His mood runs from Wrathful to Beaming.** A displeased Lord lets less slide, a wrathful one wants double in the plate and empties a few seats, and a beaming one fills a few more. The Decisions tab shows His mood and what's on file.
- **The venue email and smoke-break chats are gone.** Your words to the roster now happen around town and after the show.

# Dialogue and character sweep · version 7.80

- **2 Holds uses both holds from the first match.** His route builds toward mastering the transition at the tour show, and the crowd counts along with both holds. Existing route progress keeps the same IDs.
- **Jesus leads with faith.** His welcome, promos, ring calls and backstage scenes center prayer, encouragement and fellowship. The punch bowl is still close by.
- **One Man speaks for the boys.** He waves off outside help in tag scenes and credits the stable after his first solo win. Sweeps cleans the grit he finds, the Grinch welcomes everyone wholeheartedly, and Liam gets a comeback chant.
- **The wider roster sounds like its backstage selves.** Updated profiles, crowd calls, promos, match commentary and signature props reflect the character spines. Old factory bios and renamed match rules carry forward in saves.

# Core Eight bios · version 7.79

- **Profiles match the characters.** 2 Holds, Sweeps, Charming, the Grinch and Ron have new bios, and Greek, the Grinch and Liam have new taglines to match who they are now.
- **Ongoing careers get them too.** Saved careers keep their own copy of every bio, so the new ones replace the old factory text on load. Anything you've written yourself stays.

# Core Eight: Ron and Charming · version 7.78

- Ron refuses allegiance in every route outcome, including the televised Neutrality Hearing. His frustration rises as disputes drag on.
- Charming delivers the worst thought in the room with impeccable manners. His existing Ask promises one match.
- Greek and Ron have specific backstage opening lines for new rivals from the wider roster. The Grinch’s crush bond activates in Era II.
- Closes the Core Eight writing pass with a field-by-field coverage review.

# The whole locker room · version 7.77

- **Everyone has something to say after the show.** Twenty-eight more wrestlers now find you backstage in their own words, sharing the same four spots with the featured eight. Rudy from Football comes over on two crutches, the Doctor would like his title used, Frost blames a warm front, and Katy is still in orbit. Anyone who hasn't come over in a while gets more likely to.
- **Each of them reads the room their own way.** Every one has a kind of answer they warm to, one they want after a loss, and one they don't trust. Terrible Towel and David Guetta go by how hot the crowd was, not by the result.
- **Cheating finishes are on the record.** Rudy Giuliani doesn't mind losing. He minds losing to a cheat, and he'll find you first about it. His own cheating wins are, in his words, good sportsmanship.
- **New bonds in Who feels what.** Mandy Mouse won't discuss the Dog. “Street Smart” John Smith and Ron correct each other. Ted Turnsby measures himself against Charming, who hasn't noticed. Cleats follows Rudy, the insurer keeps a folder on Rudy's legs, Jesus keeps trying to save Greek, Smark can't stand Greco Wrestling, and One Man resents a man with only two holds. Freddie and the Houseboat, and Smark and the Miz, are friends. David Guetta and Terrible Towel's feud wakes up in Era II.
- **Some promises cost more.** Katy's mic time runs long, so a promo promised to her counts as two on that week's sheet. Terrible Towel warms up slowly after a broken promise, and weeks later he'll mention it, calmly, by the week. What you tell Jaxxon gets around.
- **Show-night habits.** “Street Smart” John Smith goes for the risky finish. Pissboy, P.H.D won't cut a promo on anyone who has doubted the doctorate.
# Core Eight: 2 Holds and the Dog · version 7.76

- Centers 2 Holds on mastering exactly two holds and the Dog on getting to wrestle. Their rivalry turns on an escape that 2 Holds refuses to recognize as anything new.
- Removes the welcome’s anatomy explanation. Updates evenings, backstage, endings and ring voices while preserving the one-time unveiling, rulebook promise and save IDs.

# Core Eight: Sweeps and the Grinch · version 7.75

- Sweeps cleans every mess with mounting fury; the Grinch answers rejection with still more affection, except for the player’s hard-truth response.
- Rewrites the linked evenings, backstage encounters, endings and ring voices. Keeps the existing tag promise platonic and preserves its target and deadline.

# Core Eight: Greek and Liam · version 7.74

- Replaces the bard and spy routes with Greco Wrestling research and a hard-drinking film-star comeback. Corrects Demeter’s Baby and the shared origin in the welcome and relationship web.
- Rewrites evenings, backstage, endings and legacy ring voices; preserves scene IDs, promises, moods and save structure.

# After the show, written · version 7.73

- **Everyone sounds like themselves backstage.** All eight featured wrestlers have their own lines for every after-show moment: a win, a loss, stealing the show, a flat night, a promise kept or broken, being left off the card, and a long stretch away.
- **Rivals cut in in their own words,** and anyone sore with you has their own way of walking past.

# After the show · version 7.72

- **Show night skips the long read.** Once the doors open, you land on one screen: tonight's headline, the gate, crowd heat across the card, the match of the night, a grade for every segment, and the promises you kept or broke.
- **Then they come to you.** Head backstage and the wrestlers with something to say find you one at a time, biggest moment first: a loss to a rival, a stolen show, a broken promise. Anyone left off the card catches you in the parking lot. How many come over depends on the night, up to four. A quiet night sends you straight home.
- **Rivals cut in.** If two wrestlers with bad blood both have something to say, the second interrupts the first.
- **Some don't come over.** A wrestler who's sore with you walks past instead. That's a tell too.
- **Replies work like evenings.** What they need tonight depends on how their night went, and a reply can put a rematch, a promo or an appearance on next week's sheet.
- The full show report is still there, one tap behind the overview.

# Reading the room, written · version 7.71

- **The featured eight have their dialogue for harder evenings.** Every one of them reads differently after a loss and after a win, has a line for when you keep saying the same thing, and has a line for when something you said about them got back.
- **One hard truth each.** Every route has a moment where the blunt, caring answer is the right one: Greek on a ladder, for a start.
- **Words travel.** Some replies take a side in the locker-room web, and the other wrestler hears about it.
- **The warm answer costs more often.** Many more of the best replies now put a promo or an appearance on the sheet, so they compete for show time.
- Scenes have been rewritten throughout so every evening has at least two answers worth defending.

# Reading the room · version 7.70

- **Evenings are about the person, not the answer key.** The week after a loss or a win, each of the featured eight can need something different from you, and their opening tell shows it if you're watching. Greek after a loss doesn't want the song. He wants to know someone still believes.
- **Saying the same thing wears thin.** Give someone the same kind of answer three times running and it lands softer.
- **Your reputation follows you in.** Each of the eight distrusts one kind of booker. If the locker room has you down as that, everything you say to them lands a little softer.
- **The blunt answer can be the right one.** New hard-truth replies cost a little trust but steady a wrestler's nerves. Some replies now play differently depending on the week, and some get back to whoever you were talking about.
- **Promises are on the button.** Any reply that commits the booking sheet says so before you pick it, along with how many promises that show already owes.
- Outside easy mode the window card no longer tells you what someone warms to. Read them on the night.

# Back to the one-sheet map · version 7.69

- **The town map is a single static map again.** The whole town fits in one view, no dragging. The local businesses stay, re-placed to fit: the print shop, Bev's chairs, Filbuster's, Crandle and Crindles, The Pound, Mitzie's and Shop and Shop in Sturgeon Bay, and six or seven in every tour town.

# Main Street · version 7.68

- **The town map is drawn at street scale.** Pins have room to breathe, labels are smaller and sharper, and on phones the map window is taller. Drag to get around town.
- **Local businesses on every map.** Sturgeon Bay has Bertum's Print Shop, Bev's Discount Folding Chairs, the Door County Advocate, Filbuster's Toy Depot, Crandle and Crindles, The Pound, Mitzie's Particle Accelerators, Shop and Shop and more. Every tour town has its own: the Cheese Vault and Heidi's Lederhosen Repair in New Glarus, Yorick's Skull Polish in Spring Green, Knudsen Insurance & Taxidermy in Algoma, and a Shop and Shop wherever you go.

# Haunts · version 7.67

- **Everyone has a place in every town.** On the road, each of the featured eight turns up somewhere that suits them: Greek on the Bluff overlook in Sister Bay and Theater hill in Spring Green, Ron under the Swiss flag in New Glarus and in the middle of the bridge in Spring Green, Liam in a bait shop back room, the Dog barking at the goats on the roof. Evenings on the road happen there too.
- **Drag the map.** The town map is a little bigger than its window now; drag it to look around. It opens centred on whoever you're looking at, and remembers where you left it for the week.
- Tap a pin to see where they are. The sheet says where to find them.

# Welcome wagon · version 7.66

- **Jesus' welcome, tidied up.** You're on your feet in the parking lot before he comes out to meet you, and each wrestler's card pops up on screen while he's talking about them.
- **Dialogue always fits the box on phones.** The text box grows with long lines, and long names stay on a single nameplate.

# Word travels · version 7.65

- **All eight featured wrestlers can get jealous now.** New bonds: 2 Holds and the Dog can't agree on what the rulebook says, and Sweeps keeps sweeping up the Grinch's decorations. Charming notices when you spend time with Ron, the one he keeps trying to recruit.
- **A welcome in the parking lot.** After you land, “Party Animal” Jesus H. Christ jogs out with punch, welcomes the WWA's new head booker and fills you in on who already can't stand whom. The same reasons now show in Who feels what.
- **Passing someone over stings more than being busy.** If a wrestler asked to see you this week and you spent the evening with their rival instead, they take it to heart. If they weren't free anyway, they've only heard about it, and it's a lighter tell with no hard feelings.

# Around town · version 7.64

- **Every week starts on the town map.** After the results, you land in whichever town this week's show is in: Sturgeon Bay most weeks, the tour town on monthly show weeks. Each of the 13 towns has its own map, with its water, streets, landmarks and the hall marked for show night.
- **See who's around.** Everyone who asked to see you this week is pinned where they'll be, with the day they're free. A red **!** means it can't wait (a one-week chance, an Ask, or a night that matters); a ✓ means you've spent that evening. The rest of the featured eight are on the map too, dimmed: in town, but not free.
- **Evenings left, up top.** The header counts down the evenings you have before show night, and a strip across the top lays out the week, Sunday to the show on Saturday.
- Tap a pin to read their invitation and spend the evening right from the map. Tap someone who isn't free for their tell and their window card. **Skip to booking** (or **Book the card** once your evenings are spent) when you're ready.
- The Locker tab is now **Town**: the map on top, with the featured eight, promise ledger and who-feels-what below it. The Road page's week-ahead strip now opens the map.

# From the curtain · version 7.63

- **Show night belongs to the wrestlers.** You book the card; once the bell goes, each act calls its own segment by instinct and you watch from the curtain. The live show is now a quick run of report cards: who won, a couple of lines on what happened, the line everyone will be quoting, and how it landed. Tap **Next segment**, or **Skip to the results**.
- **Booking is where the call gets made.** Technicians reach for their signature sequence, showboats commit to the bit, faces speak from the heart and heels go after somebody. Put people in spots that suit them and the night takes care of itself.
- **How they're doing decides how it goes.** Each segment's result now leans on the people in it: low morale makes them look flat, real ring skill or a hot mic lifts it, a wrestler who trusts you goes the extra mile, one who doesn't ignores the plan and does it their way, and a genuine feud or a well-drilled team adds something extra. Each report card shows what helped and what hurt.
- **Trust is earned off the show.** Calls the wrestlers make still move momentum, rivalry heat and team chemistry, but not their trust in you. That comes from the week: evenings, promises and backstage answers.
- A show saved mid-broadcast in an older version picks up where it left off, with the remaining segments called by the wrestlers.
- The dialogue-speed and scene-length settings are gone from Settings & device, since there's no live dialogue to pace.

# Checking in · version 7.62

- **Cutscenes hold the game still.** While any cutscene plays (the opening, an evening, the epilogue reel), the page behind it can’t scroll, take taps or take focus, so tapping through dialogue on a phone no longer drags the game around underneath. It returns to exactly where you were when the scene ends.
- **A short first-week tour.** Right after the opening, the Good Lord Above checks in, as promised, and walks you through one week in six stops: the Road, booking the card, backstage decisions, the Locker Room’s free evenings, and the Shows tab. Each stop opens the real tab and spotlights the part that matters; the last one sends you straight to book week 1.
- Skip it at any stop, step back, or use the arrow keys. Take it again from **How to play** or from **Settings & device** on the Shows tab.

# In the beginning · version 7.61

- **New opening cutscene.** Every new career begins in first person on a Sturgeon Bay crosswalk, thinking about what to send the group chat. Headlights. A crash. Then, very gently, up.
- **The Good Lord Above has been waiting since the day you were born** for his most perfect creation to arrive and fulfil its purpose: the most incredible wrestling show the world has ever seen. Unfortunately, your life was a test, and you have been a naughty, naughty boy. Exhibit A: the million-dollar banana taped to the wall, which you ate. Exhibit B: every new Charmin bear ad, sent to the group chat during HGTV. They don’t want to see toilet paper ads.
- **Explain yourself or apologize.** Try to explain and he cuts you off, furious. Apologize and he presses a small mercy into your hand: $300 of extra starting cash.
- **The curse:** you’ll finish your life’s work with a roster of utter buffoons,. He’ll be checking in periodically, and failure means the deepest pit of oblivion. Then he pulls a big brass lever marked Small Town Wisconsin, and you plummet past Green Bay into the parking lot of St. Elbow’s.
- Replay it any time with **Watch the opening** on the title screen. Replays never pay out the mercy again.
- The cutscene player can now stage speakers who aren’t on the roster, change sets mid-scene, shake the screen on any line, and show a paper card or a lineup of wrestlers over the stage.

# Fresh off the floor · version 7.60

- **Sweeps has a fifth evening:** an untorn ticket under the front row.
- **Every featured wrestler now has their own jealousy line**, ready for when their rivalries are added to the relationship web.

# Every story, written · version 7.59

- **All eight featured routes are now complete.** Greek Polanski, The Man of 2 Holds, Charming Friendly, The Grinch, Ron Toledo, Liam Neesen and the Dog join Sweeps with full stories: three build-up evenings that each pay off with something bookable, a one-week-only flag event, the Ask, a final scene the week it’s due, a scrapbook polaroid and best, neutral and bad endings.
- **New Asks with their own staging.** Greek’s title match played as a tragedy, the Dog reading the entire rulebook in the main event, 2 Holds revealing Hold Number Two once (pick the wrong show and the best ending is off the table), Charming choosing his own opponent, the Grinch’s mixed tag with Lemon Tart, Ron’s televised Neutrality Hearing and Liam’s final extraction.
- **More evenings.** Every featured wrestler has five drop-in scenes (Sweeps has four), so visits stop repeating so soon.
- **Fallout in their own words.** Kept and broken promises now read as an in-voice line from the wrestler, and every featured wrestler has their own best, neutral and bad era epilogue.
- **Jealousy speaks up.** Greek, Ron and Liam now say it themselves when you’ve been spending evenings with their rival.
- Older careers keep all of Sweeps’ progress.

# The locker room · version 7.58

- **Cutscenes are staged like a courtroom visual novel.** Every evening opens on a title card (day, time, place), then plays on its own set: Mount Olympus’ pipes and furnace glow, the barn, St. Elbow’s checkerboard floor, a floral tea room, the tinselled craft room, the library stacks, neon lanes, the yard fence. The wrestler stands on their mark and talks while their lines type into a textbox with a nameplate. Tap anywhere to finish a line or move on; Skip jumps to the next decision, and Log shows everything said tonight.
- **Your reply lands with a shout** (“I believe!”, “Noted.”, “Heck yes!”, “So moved!”, or a deflated “Come on…”), a flash, then your line under a “You” nameplate. Reactions split into narration and the wrestler’s own words. Wrestlers hop with delight, nod, or flinch and turn grey when you break their world, with a screen shake.
- **Dating-sim beats, without numbers.** When someone’s feelings shift, the scene stops for it: “Something’s different” (hearts rise) or “Something cooled”, followed by their new tell. Scrapbook polaroids drop onto the screen, promises stamp “On the booking sheet”, and route endings appear as cards.
- **New Locker Room tab.** This week’s invitations, the featured eight as a cast board (mood portrait, current tell, where their story stands, open promises, scrapbook pips, “Still sore” or “Jealous” flags), the promise ledger, who feels what about whom, and past epilogues. Tap anyone for their window card.
- The Road page opens with the week ahead: who’s asking, what’s urgent (“Only this week”, “Wants to ask you something”), and a way into the Locker Room.
- **Jealousy.** Warming up Greek Polanski cools Liam Neesen, and vice versa; Greek also irritates Ron Toledo. A jealous wrestler opens their next scene by mentioning it. Looking after Sweeps grows Sweepstakes & Deductibles’ chemistry.
- **After the show** on the recap: featured wrestlers who worked tonight wait by the van, wave on the way out, or are gone before the lights come up.
- **Era epilogues.** When you move up an era, every featured wrestler gets an ending card (best, neutral or bad) before moving day. Finished routes keep their ending; everyone else is read from where things stand. Replay them from the Locker Room.
- Featured wrestlers’ trust numbers are gone from post-show fallout, live-decision summaries, challenge refusals, briefings and roster cards. Easy mode brings them back.
- Under the hood: every route now runs on one engine driven by routes.js, so new routes play as soon as their dialogue is complete. Sweeps plays exactly as before. Older careers keep all of Sweeps’ progress.

# The week ahead · version 7.57

- Relationship layer, first slice. After the venue owner and the smoke break, the weekly briefing ends on **The week ahead**: three invitations from featured wrestlers and two free evenings. Whoever you don't see that week, you don't see. The same panel sits on the Decisions page.
- Every evening is a short cutscene in the wrestler's own world (Mount Olympus in the boiler room, the safehouse booth at the lanes, the yard behind the hall) with two or three replies. Replies that play along with a wrestler's reality warm them up; replies that break it cost the most and get remembered.
- Featured wrestlers (Greek Polanski, The Man of 2 Holds, Sweeps McKenzie, Ron Toledo, Charming Friendly, The Grinch, Liam Neesen and the Dog) no longer show a trust number. Read them instead: the tell in their wrestler file, how they invite you (a text, or nothing at all), how they sign off, and their portrait in scenes. Everyone else keeps Trust /100.
- Your play-along reputation (Believer, Straight Man, Hype Man or Bureaucrat) builds from your replies. Each featured wrestler warms fastest to one style; their window card reveals which once they're warm.
- Sweeps McKenzie has the first full route, opening after his spotlight month: after hours at St. Elbow's, a promise of a freshly swept canvas, a one-week-only flag event (the Unsweepable Stain) that pins a polaroid to his window card, and the Ask: a title match on a floor he has swept for twenty-four hours. Stand the vigil the Friday before, keep the promise, and his Era I ending is the best one.
- Every payoff lands on the booking sheet: route promises, a pencilled story beat and a new kind of promise, the championship match, which the booking queue can book in one tap.
- The Decisions page has a **Promise ledger**: open promises by deadline, whether each is on tonight's card, and what you recently kept or broke.
- Easy mode (off by default) shows what each reply changes.
- Older careers migrate with empty relationship state; backups export and restore it.

# Tap to pick · version 7.56

- Booking is tap-first. Tap any space on the card and a sheet slides up from the bottom with the best fits for that exact spot. One tap books the wrestler and the sheet moves to the next space, closing when the segment is complete.
- Each card shows one reason, not a number: promises, requests, Sweeps' qualifier, challenges and title defenses lead a “Needs you tonight” group; then Rivals, Feud, Team, Best chemistry, Electric?, Never met, Rub and Face v heel. Chemistry is read from past matches you have actually booked.
- The shape row (Singles, Tag, Trios, Triple threat, Four-way, Battle royal, Promo) sits at the top of the sheet and can change anytime. Shrinking a match sends extras back with a note. Tag and trios fill a whole team before the opponents.
- Promo types (Solo, Face-off, Interview, Interruption) are a chip row too, before or after picking the talker. The Segment view holds the story beat and prop.
- Stips & titles view: title on the line, every allowed stipulation with a one-line fit (“Suits Mizanin & Mouse.”, “Tough for Cleats.”) and its cost, presentation and props. Finishes and run-ins stay in Details, which opens the full one-sheet editor.
- On the card: 👑 Win under each side, a Pin choice when two or more lose (the chosen wrestler takes the fall in the commentary), modifier chips, a summary line and a crowd read in words (Should deliver, Solid, Risky, or what's still missing).
- Wrestlers already on the card show dimmed. Picking one offers to move them here, since everyone works once a night.
- Tap a booked wrestler to replace them. Hold and drag to move or trade places; drop off the card or flick sideways to send them back. Hold a segment's name to reorder the card; whatever ends up last is the main event.
- Half-built segments stay drafts until legal, then join the card on their own. The checklist names what each draft still needs.
- Suggest the rest fills empty spaces from wrestlers' traits alone and leaves every winner to you.
- The Book screen ends with the checklist, the venue owner and backstage request, then Proof at Bertum's at the very bottom. Creative advice is collapsed under the required items.
- A small tick and haptic on each pick.

# One-sheet match booking · version 7.55

- Matches are booked on a single screen instead of Format → Wrestlers → Finish. A clean singles match now takes about five taps instead of twelve.
- Tapping a Best fit card puts that wrestler straight into the open corner; there is no separate preview-then-Add step. Hold a card to see the full spotlight.
- Pick to win sits under each corner. Finish, run-in wrestler and motive, match rules and the title are tap-once chips rather than dropdowns; rules show their setup cost.
- Presentation and prop are under one optional section, and the booker's read is a collapsible note.
- A sticky footer shows crowd heat, the next missing choice and Book it.
- The wrestler hand under the poster is gone. Tapping any spot on the poster opens that segment's sheet with the spot ready to cast. Promos keep their existing one-screen booking.

# Restore from the title screen · version 7.54

- The title screen has a Restore a backup button, so a fresh install (or a re-added Home Screen app) can bring a career back without starting a new one first.
- Backups taken during a live show now restore at every card size. Previously a mid-show backup from The Circuit onward (five or more segments) was rejected.

# Fresh icon files · version 7.53

- The Home Screen and browser icons use new file names, so iPhone and iPad pick up the window card icon instead of a cached copy of the old one.

# Paying its way · version 7.52

- Economy rebalance. Every chapter now has its own venue rent, per-appearance pay and fix price, so costs keep pace with the room: a sold-out weekly show clears about a quarter of the gate and a monthly show about half, instead of four-fifths.
- Venue problems cost a real share of a week's profit ($350 in the Gym Years, up to $75,000 in Supremacy) and the old $40 prices in problem texts follow the chapter rate. Special rules, props, crew salaries and Bev's lifeline scale the same way.
- Monthly shows sell tickets at half again the weekly price, rather than a flat $10 extra.
- Moving into a bigger room takes a deposit of four shows of the new venue's rent, so saving up matters. The offer shows how much more you need.
- Money now reads "−$460" instead of "$-460".
- Leftover screens brought onto the boxing window card: inbox headers with status stamps, the smoke break, the venue email, venue-problem answers as lettered cards with cost badges, the career summary, Office ledger rows, roster search, modal close buttons and in-form pickers.
- New Home Screen icon to match the design.

# Calls that land · version 7.51

- In-match and promo choices now play out by how well they went. Each call is graded (Nailed it, Clean, Got it done, Flat, Mistimed) from the wrestlers' skill, the crowd and the stipulation, and the dialogue follows: clean hits, late tags, botched timing and dead rooms all read differently.
- Every wrestler has their own in-character lines for landing a big moment and for covering a mistake. Concise playback always keeps them.
- After the scene, a verdict card shows the grade, the quality change, why it went that way and what it changed.
- Choice cards describe the plan instead of spoiling the result, and their consequences are colour-coded badges (momentum, trust, morale, heat, chemistry) with a short "rides on" note.
- Backstage requests: answers are in-theme cards with badges instead of a dropdown, "Who hears it?" is a two-way toggle, the redundant "Pass tonight" button is gone, and the character-promo pitch only appears when it adds something new.
- Every dropdown in the game now opens an in-theme picker instead of the system menu.

# Rise to Supremacy · version 7.50

- Group the eight career chapters into five eras (The Gym Years, The Circuit, The Territory, The War, Supremacy). Each era changes the job: the card grows from four to seven segments, problems and fixes scale from $40 to $8,000, and the era's accent color carries through every screen.
- Add a rival promotion on every rung, live power rankings, and an "outdraw your rival" goal in every chapter. On monthly tour nights the rival books your town: go head to head, move the show, or raid their card.
- Add 24 era-specific weekly problems, monthly press calls that grow from the local paper to a documentary crew, and crew hires (ring crew, road agent, production manager) that handle a department's problems for a salary. Talent problems always reach your desk.
- Add the writers' room in The War: your writers draft the undercard and you book the main event.
- Add Moving Day: when you outgrow an era, the originals react and you choose traditions (Bev's chairs, a free kids' section, Father Tom on the mic and more) with permanent effects. The Road tracks the St. Elbow's originals.
- Replace Home with The Road: standings, the era ladder with this chapter's goals, rival challenges, press calls and roots.
- Restyle every screen as a boxing window card: cream card stock, wood-type Alfa Slab One headlines, Oswald labels, flat red/yellow/blue bands, hard rules and offset shadows. Both typefaces are bundled for offline play.

# Kayfabe artwork and icon · version 7.46

- Recreate the Home logo and screen headers with live lettering and vector shapes, replace the cropped texture, and match the install icon to the new poster design.

# Kayfabe Promotions · version 7.45

- Recast the game in red, black, yellow, and newsprint with a new weekly Home screen, compact mobile roster, and matching booking, backstage, and recap screens.
- Add match control dials and booking stamps, blend the Home logo into the background, and make the booking footer open the next draft or backstage task.

# Saturday Night Blowout · version 7.37

- Bring pink and cyan overprint, diagonal portrait crops, and stacked billing to the title, booking, roster, Creative, Office, live show, results, and install icons.

# The booker’s desk · version 7.30

- Book directly on the show poster, with separate pencil drafts and a public print proof.
- Handle venue messages and wrestler requests alongside the bill. See which promises your bookings fulfill and how a draft changes the forecast.
- Call the show from a private running order, then pencil a follow-up into next week’s notes.
- Compare your current room with a promotion offer before taking on a bigger venue and its costs.

# Booking desk · version 7.12

- Put the show card first, with a compact status strip, expandable career milestone, and persistent budget/next-action controls.
- Bundled genuine Barlow Condensed and DM Sans WOFF2 fonts and introduced a shared readable type/control system.
- Added draft summaries, resume at the first unfinished match step, explicit pending-edit status, and undo for clearing bookings or discarding drafts.
- Added earned-qualifier guidance and ranking, compact casting controls, and optional finish presentation/props.
- Added roster search/filter/sort, promo speaker discovery, named dialogs and focus restoration.
- Split required booking fixes from creative advice; preserve all existing save, history, roster and simulation rules.

# Story update · version 4

- Added persistent story incidents, rivalry phases, trust, momentum and meaningful live consequences while preserving player-booked winners.
- Added Sweeps' four-week branching story, dated promises, earned rematches, unlikely partners and aftermath scenes.
- Added explicit promo formats/targets, optional custom lines, open challenges, named interference and separate result presentation.
- Reworked casting to start with format, retain separate drafts, sort by purpose, and show booking readiness and budget forecasts.
- Added an editable four-week plan, rotating backstage requests, optional production calls, three distinct props, two character milestones, season goals and retrospectives.
- Rebalanced repeat exposure, featured-story attendance, popularity gains, gimmick debuts and audience satisfaction.
- Added remembered playback options, preserved decision labels, story-first recaps and durable show history.
- Kept legacy save compatibility and added dependency-free regression coverage.

No new assets, third-party dependencies, backend services or deployment are required. The original extracted source remains in `source-review/` for comparison and is excluded from the release archive.

# iOS webapp update · shell v5.2

- Added an original folding-chair Home Screen icon, iPhone/iPad sizes, favicon, standalone manifest and Safari metadata.
- Added a complete offline shell, scope-safe cache cleanup and player-controlled updates that wait during shows/editing.
- Added safe-area and landscape navigation spacing, touch-sized controls, 16px inputs and keyboard-aware dialogs.
- Reduced portrait transfer by 79% with optimized JPEG atlases; original PNG source is retained.
- Added installation/backup guidance, native file sharing when available, background saving, duplicate-write suppression and persistent storage-failure warnings.
- Added offline, icon, scope and update regression coverage. Physical iPhone/iPad Safari smoke testing is still needed.

# Wisconsin tour and copy update · shell v6

- Replaced the recurring Potluck show with a 12-stop Wisconsin circuit, rotating every four weeks through week 48 and repeating for continued careers.
- Added town-specific show names, fictional halls, local details, poster accents, and an upcoming tour schedule in the Office.
- Connected show previews, story conversations/deadlines, and future recaps to the scheduled town. Past career results keep their original names.
- Removed the title-screen slogans and roster burst; simplified navigation, booking, roster, creative, recap, and install copy while retaining character dialogue.
- Preserved ticket prices, venue capacity, financial rules, and existing saves. Added calendar rollover, recap identity and migration checks.

# Little Snafu · shell v7.2

- Added a required start-of-week briefing: production problem, backstage response, conversation tone, and booking reminders before the desk opens.
- Expanded production to ten local-wrestling problems with paid, improvised and basic-workaround choices, all reflected in the show budget and recap.
- Saved partial/completed briefings, locked already-resolved decisions, and made response effects idempotent across reloads and repeated submissions.
- Kept in-progress shows/recaps uninterrupted and migrated existing production decisions and backstage replies.
- Added a read-only weekly summary, accessible modal steps, title-screen pause, and mobile-safe scrolling. Updated offline resources and regression coverage.

## Mobile booking and opponent fits · shell v7.6

- Replaced the crowded participant step bar with Format, Wrestlers and Finish stages, plus a collapsible participant summary.
- Added a full-screen phone editor, two-column touch roster and one named Add action. Drafts save through Done for now or close.
- Saved show cards now open the relevant participant, stipulation, finish, winner or prop editor directly. Replacing a participant returns to review when the lineup is full; replacing the winner requires choosing a valid winner again.
- Best fit sorting explains opponent recommendations using alignment, ring and mic skills, popularity, rivalry heat and open challenges. Tag teammates are excluded from opponent comparisons. Suggestions do not grant hidden bonuses.

## 7.7 — Character content expansion

- Twenty rotating Little Snafus, up from ten.
- Two additional authored live promo branches per wrestler, five opening lines, and character-specific backstage promo offers.
- Thirty-four participant-unlocked signature match presentations and thirty-four owner-bound signature props.
- Signature matches preserve standard pin/submission finishes and booked outcomes; props grant owner momentum without a rating bonus.
- Offline shell updated atomically to 7.7; expanded engine regression coverage across all characters.
- Seasonal creative-brief proposal documented separately for discussion; current goal behavior unchanged.


## 7.8 — Sturgeon Bay Slam: Rise to Supremacy

- Eight permanent career chapters, from selling out the local hall to a generational dynasty, reviewed every twelve weeks with unfinished progress retained.
- Player-chosen seasonal strategies and progress on the booking desk, full roadmap in the Office, archived season ambition reports.
- Larger venues, scaled attendance and operating costs, regional/national broadcast income, and historically accurate capacities in recaps.
- Renamed title, desktop branding, manifest and new backups; legacy backup names and save keys remain supported.
- Progression import validation, new end-to-end engine regressions and atomic 7.8 offline release.
- Fixed portable backups rejecting the new character backstage promo choice.

## 7.9 — Four new human performers

- Added Liam Neesen, The Tooth, “Allowed Elsewhere, Choosing to Be Here” Tessa Blanchard, and A Dog That The Rules Don't Say Is Banned (stable IDs 34–37).
- Added four cut-paper portraits, character voices, crowd responses, signature matches, props and branching promos.
- Characters stay fully in gimmick: the Dog insists he is a dog and demands the rule that bans dogs from wrestling.
- Established the permanent human-performer canon in AGENTS.md, data, migration and regression checks. The Tooth and Dog are people in costumes.
- Preserve 34-person backups and add the expansion without resetting career progress. New portraits join the 7.9 offline shell.

## 7.10 — Faster promo booking and consistent roster cards

- One-screen promo editor with four intent choices, conditional targets, optional presentation/line/prop controls, and saved drafts.
- Standard rule label across match formats, preserving legacy save values and simulation behavior.
- Tighter expansion portrait framing and bounded roster-card names; compact Tessa name with full identity retained in previews.
- Updated offline shell and regressions for rule labels, promo target requirements and speaker changes.

## 7.11 — Reference-matched expansion artwork

- Rerendered Liam Neesen, The Tooth, Tessa Blanchard and the Dog using their existing identities plus the actual approved Cut-Paper Misfits atlas images.
- Square caricature compositions with larger heads, simpler eyes, broad paper shapes and matching cream backgrounds.
- Preserved native 1254px sources, prompts, reference manifest and 512px runtime exports; explicit standalone mappings keep IDs stable.
- Verified original atlas hashes and phone-sized roster, casting and dialogue crops. Updated the offline shell to load the rerenders.

