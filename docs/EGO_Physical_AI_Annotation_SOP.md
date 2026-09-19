**Standard Operating Procedures (SOP): Physical AI Video Annotation & Labeling**

# Change Log

| Date       | Change |
| ---------- | ------ |
| 2026/09/18 |        |

- Format change

| 2026/09/04 |   |
| ---------- | - |

- Removed use of hands

| 2026/09/03 |   |
| ---------- | - |

- Added in fold edge case to doc

| 2026/09/01 |   |
| ---------- | - |

- Added hands back into the spec
- Changed to max 5 identical consecutive sub-goals
- Added “carry” as an approved verb

| 2026/08/20 |   |
| ---------- | - |

- Added in best practices for repeated subgoals
- Added in no special characters/capitalize first verb only

| 2026/08/17 |   |
| ---------- | - |

- Removed the need to annotate “Collector Issue”
- Added in how to get to tooling/translation quick start videos
- Added in captions cannot be differentiated by adverbs

| 2026/08/14 |   |
| ---------- | - |

- Next subgoal can start at the same or +1 frame

| 2026/08/12 |   |
| ---------- | - |

- Clips must be at least 1s
- Added in rules on combining shorter clips into min 1s clips
- Should be 1 verb per subgoal with the exception of dependent actions or actions that take <1s

| 2026/08/07 |   |
| ---------- | - |

- Added in rule that we should not have more than 3 consecutive identical subgoals

|   |
| - |

## Link.png Useful Links

|   |
| - |

- [Tooling Walkthrough Video](https://static.remotasks.com/uploads/sfl/clip-review-walkthrough.mp4)
- [Translation Tool Walkthrough Video](https://static.remotasks.com/uploads/sfl/translation-walkthrough.mp4)

# 1. Project Overview

Every task in this project includes a video of egocentric human data — the world from a person's own point of view, through their own hands. Your goal is to review, segment and annotate people doing everyday tasks (washing dishes, cooking, folding laundry, and similar activities) and mark them up so a robot can learn to do the same. The model only learns from what you mark, so the accuracy and clarity of your work directly shapes what the robot is able to learn.
You will **confirm that each clip's start, end, and duration follow the rules** (fixing or adding clips wherever they're wrong or missing), **and write a clear, consistent description for every Sub-goal and Clip Export.**

**What makes a task good?** The verb and the object in a caption match what is actually happening in those frames. Clips do not need to be frame-perfect, as long as the description matches what happens in the video, the annotation is correct.

# 2. Task Workflow

On every task, you will follow the same four steps in the same order. The rest of this document walks you through each step in detail.

1. **Identify the Inactive Time: confirm or fix the start and end of the inactive time at the beginning and end of the video.**
2. **Clip and Caption the Sub-goals: confirm or fix the start and end of every action. Then, write a caption describing the action of each clip, following the formulas below. **
3. **Clip and Caption the Clip Export: add the annotation timeline and confirm the start and end of the clip. Then, write a caption describing the whole task action, following the formulas below. **
4. **Run the quality check and submit: resolve linters, run through the checklist and submit. **

# 3. The Timelines

Every task is built from two nested segment types that sit on the timeline like bricks, with no gaps. The table below describes each one and its duration.

| **Segment**     | **Description**                                                                                      | **Duration**       | **Key Rules**                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------- |
| **Clip Export** | The complete continuous sequence where the collector performs actions to achieve the main task goal. | **≤ 5 min (300s)** | Tasks longer than 300 seconds must be split evenly into logical, aligned segments  |
| **Sub-goal**    | A single action step, or small group of dependent micro-actions, contributing to the overall task.   | **≥ 1s, < 10s**    | Never 10s or more<br>Never under 1s                                                |

**Note:** There is a third timeline called **Hand Tracking Errors.** You **don’t** need to review or edit this timeline.

## Timeline Continuity

Sub-goals and Clip Exports sit side-by-side like bricks. There shouldn’t be gaps or overlaps of more than 1 frame between each sub-goal clip or Clip Export.

| ThumbsUp.png | ThumbsDown.png |
| ------------ | -------------- |
|              |                |

- Sub-goal A ends at frame 22; Sub-goal B must start at frame 22 or 23.
- Clip export 1  ends at frame 8,657; Clip export 2 must start at frame 8,657 or 8,658.

|   |
| - |

- Sub-goal A ends at frame 22 and sub-goal B starts at frame 20.
  - Overlap of 1+ frames
- Sub-goal A ends at frame 22 and sub-goal B starts at frame 26.
  - Gap of 3 frames

Since both timelines are nested in each other, **their start and end needs to match.**

- The start of the first Sub-goal must match the start of the Clip Export, and the end of the last Sub-goal must match the end of the Clip Export.  
- If there are more than one Clip Export, the separation needs to match the start/end of a Sub-goal.

# 4. Inactive Time

The **Inactive Time** is the time before the main demonstration starts and after it ends: camera/hand calibration, adjusting equipment, or the collector stopping timers. It has no timeline, so it must be **unclipped** and not be a Sub-goal or part of the Clip Export.

### Where the Inactive Time Starts and Ends

🟢 **Start:** At the beginning or the end of the task, when the person is adjusting the cameras or not contributing to the demonstration.
🔴 **End:** When the demonstration (clip export) is going to start or the video ends.

image

# 5. Sub-goals

In this next part of the document, you will understand how to clip the actions into sub-goals and the parts that make up the caption for each.

## 5.1 Clipping

A sub-goal is a single action, or small group of dependent micro-actions, contributing to the overall task. Think of the steps to make pancakes — add an egg, add batter, mix the batter — each step is a subgoal.

### Where a Sub-goal Starts and Ends

🟢 **Start:** The exact frame where the body or hand begins moving toward the target object/action. 
🔴 **End:** The exact frame where physical contact is broken (hand-object or object-object disengagement).

| Compass.png | **Edge Case - Pouring Exception**<br>Starts when the container begins to tilt to initiate the pour; ends when liquid stops flowing and the container returns upright. |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

**Tolerance:** Bounding within 5 frames of exact contact or release is acceptable. 

### Splitting Long Actions

A single continuous physical action that runs longer than 9.99 s must be split into shorter Sub-goal segments, each under 10 seconds. 

image 

### Merging Micro-Actions

**What is a Micro-action?** A micro-action is an atomic, brief physical movement or single manipulation sub-step (e.g., tapping a button, flipping a switch, unscrewing a bottle cap slightly, grabbing a handle, or nudging an object).

**Up to 3 micro-actions** may be combined into a single Sub-goal, but only when one of the following is true:

- The Sub-goal is under 1 second long — you may add more micro-actions to bring it above 1 second (max 3 total).
- The actions are **dependent** on each other — for example, picking up a paintbrush and then setting it down can be merged into one sub-goal, since you can't put down an object without first picking it up.

Combining **4 or more** actions into one Sub-goal is **never allowed.**

| ThumbsUp.png<br>**Good examples:** | ThumbsDown.png<br>**Bad examples:** |
| ---------------------------------- | ----------------------------------- |
|                                    |                                     |

- Grab the shirt and drop the shirt into the washing machine
- Pick up the cloth and wipe the table with the cloth

|   |
| - |

- Pick up the pen and fold the cloth
  - Independent actions
- Grab the shirt and put the shirt on the table and grab the pair of jeans and put the pair the jeans on the table
  - More than 3 actions

### Pick-and-Place Sequences

When an object is picked up and set down consecutively, both steps must be captured together in the same sub-goal

***Pick up [Object] and put [Object] on [Destination]***

Always caption every “pick up” action, even if it’s immediately followed by “put” action.

### Idle time

Idle time refers to pauses, hesitation, walking, or resting between action cycles — anything the person does that is not part of the demonstration.

- **Idle < 5 seconds:** mark it as its own separate Sub-goal, captioned strictly as "Idle."
- **Idle > 5 seconds:** split it into multiple short Idle Sub-goals.

* **Never** merge idle time into an active manipulation Sub-goal.

image

## 5.2 Captioning

A caption is the written description of what happens in the video. It connects the visual action to language a model can understand. This section covers the formula, wording, and object/direction rules for Sub-goal captions specifically.

Things to clearly look for and add to the sub-goal caption: 

- When there is change of object that any of the hands are touching (e.g., pick up the phone)
- When there is change of actions that the hands are doing (e.g., lift up first vs set down later)

### The Caption Formula

**Standard Action**
***[Imperative Verb] + the [Object] (+ with [Tool])***

**Placement Action**
***[Imperative Verb] + the [Object] + [Destination]***

**Syntax**

- Use **imperative mood only**. No “-ing,” no third person.
- **Capitalize only the first letter** of the first word (the verb).
- Only use one verb per sub-goal, unless it meets a merging exception we covered in the previous section. These are the only cases when it is allowed to use **‘and’** in a caption.
- **Don’t** use special characters (commas, periods, etc). Only letters and spaces are allowed.
- **Don’t** use ‘while’ in the captions

| ThumbsUp.png<br>**Good examples:** | ThumbsDown.png<br>**Bad examples:** |
| ---------------------------------- | ----------------------------------- |
|                                    |                                     |

- **Standard Action:** Twist the bottle cap
- **Standard Action with Tool:** Wipe the door with a cloth
- **Placement Action:** Put the mug on the counter
- **Pick-and-Place:** Pick up the mug and put the mug on the counter

|   |
| - |

- Cut the cucumber
  - Doesn’t include the tool – a knife
- Grasping the ball
  - Uses -ing verb
- Picks up the pencil
  - Uses third person
- Wiped the window
  - Uses past tense
- Clean the table while spraying the cleaning solution
  - Uses ‘while’ + -ing verb

### Naming Objects

When naming objects please be minimally descriptive — add the least detail that makes the object unambiguous.

- **1 object in view:** Use the plain object name without extra descriptors (e.g., "Pick up the apple").  
- **2–3 similar objects:** Add the minimum distinguishing feature such as color or position (e.g., "Pick up the **red** pencil").
- **4+ identical objects:** Use an indefinite descriptor (e.g., "Pick up **a** pencil").

When identifying objects, always use the specific object name rather than a broad category, to reduce ambiguity.

| ThumbsUp.png | ThumbsDown.png |
| ------------ | -------------- |
|              |                |

- T-shirt, pants, sweater, jacket, socks
- Fork, spoon, knife, chopsticks
- Plate, bowl, cup, mug
- Hammer, screwdriver, wrench, scissors

|   |
| - |

- Clothes
- Cutlery
- Dishes
- Tool

**Generic terminology:** Always use generic names rather than brand names (e.g., use tablet instead of iPad, earphones instead of AirPods).

### Destinations

For "Put," "place," "set down," "pour," and similar verbs describe moving an object, always name where.

| ThumbsUp.png | ThumbsDown.png |
| ------------ | -------------- |
|              |                |

- Put the mug **on the counter**
- Set down the box **on the floor**
- Place the folded towel **in the basket**
- Pour the water **in the glass**
- Insert the plug **into the socket**
- Drop the peels **into the trash bin**
- Hang the jacket **on the hook**
- Stack the plate **on the plate pile in the sink**
- Slide the chair **under the table**
- Load the mug **into the dishwasher rack**

|   |
| - |

- Put the mug down
- Set down the box
- Place the folded towel
- Pour the water
- Insert the plug
- Drop the peels
- Hang the jacket up
- Stack the plate
- Slide the chair
- Load the mug

### Directional Descriptors

**Egocentric by default:** All relative directions (left, right, top, bottom) are based on the camera wearer's perspective.

We use directions in two cases:

- **Identical objects in frame: Two look-alike objects, point to which one:**
  - **Pick up the left glasses**
- **Splitting a continuous action: Long actions cut into segments by the 10s cap.**
  - **Wipe the bottom right of the table with a cloth**

| Compass.png | **Object-centric Exception**<br>Small handled items or garments with an unmistakable named side use the object's own orientation, no matter how it's lying — e.g., "the neckline of the shirt," "the back of the phone," "the handle of the drawer." <br>⚠️ Large furniture (tables, cabinets) always stays egocentric. |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### Repeated Consecutive Sub-goals

For split long actions, you can use the same caption **up to 5 times**. The 6th instance must have a differentiator – a corner, a side, a color.

|     ThumbsUp.png | **Example**<br>The long action is to mop under a table, divided into 6 sub-goals of 9.9s each.<br>You can write “Mop under the **left corner** of the table” five times, the sixth one needs to be different. You should observe the scene closely and indicate the **difference** in the action compared to the previous description, such as "Mop under the **inferior left corner** of the table"<br> |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

**Level of Detail:** for differentiating consecutive subgoals, please use the same level of detail if you are already adjusting the captions 

| ThumbsUp.png<br>**Ideal **<br>Same level of detail on each caption | Warning.png<br>**Acceptable, but not ideal**<br>A differentiator only in the 6th caption |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
|                                                                    |                                                                                          |

- Wipe the **handle** of the black scissors
- Wipe the **blade** of the black scissors
- Wipe the **handle** of the black scissors
- Wipe the **right side** of the black scissors
- Wipe the **handle** of the black scissors
- Wipe the **handle** of the black scissors

|   |
| - |

- Wipe the black scissors
- Wipe the black scissors
- Wipe the black scissors
- Wipe the black scissors
- Wipe the black scissors
- Wipe the **right side** of the black scissors

| ThumbsDown.png | **Adverbs** (a word that modifies or describes a verb) are **not** an acceptable way to differentiate captions.<br>Example: |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |

- 1 to 5 captions: Mop under the table 
  - 6th caption: Mop under the table **carefully**

### Folding

When using the verb **Fold**, you must caption at a higher granularity than other actions. Please state where the fold starts and ends.

| ThumbsUp.png | ThumbsDown.png |
| ------------ | -------------- |
|              |                |

- Fold the pants from bottom to top
- Fold the top right corner of the paper to the bottom left corner of the paper
- Fold the right left sleeve of the shirt to the center 

|   |
| - |

- Fold the pants
- Fold the paper
- Fold the right sleeve of the shirt

# 6. Clip Export

In this next part of the document, you will understand what is the Clip Export, including its boundaries and how to caption it.

## 6.1 Clipping

The Clip Export is the complete continuous sequence of actions to achieve the main task goal.

### Where a Clip Export Starts and Ends

🟢 **Start:** When the hands or body begin to move to perform the demonstration. 
💡 The same frame where the first sub-goal starts.
🔴 **End:** When the demonstration is completed.
💡 The same frame where the last sub-goal ends.

**Tasks longer than 5:00** must be split into 2+ logical, aligned Clip Exports (e.g., an 8-minute task = two 4-minute segments, or 5 + 3). Do not over-clip (e.g., cutting an 8-minute task into seven exports).
image

| LightBulb.png | **Timeline Continuity**<br>Remember that the start and end of the Clip Export and Sub-goals timelines need to match. So, if you have more than one Clip Export segment, the separation also needs to follow this rule. |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 6.2 Captioning

The Clip Export caption is a short summary of the whole task, written after you've watched the entire clip.

### Key Rules

- Provide a concise summary of the overall task in 1 or 2 sentences, maximum.
- Always name the environment – physical location or surface – where the task is taking place (kitchen counter, office desk, living room, etc.)
- Use the 3rd or 2nd person, consistently.

| ThumbsUp.png | ThumbsDown.png |
| ------------ | -------------- |
|              |                |

- The person stands at a kitchen counter and prepares a sandwich by slicing bread, adding fillings, and placing it on a plate
- In a bedroom, the person puts away clean laundry by sorting, folding and placing on a drawer each clothing item.

|   |
| - |

- Make a sandwich
  - Too short, no environment, no detail.
- The person picks up a blue shirt and folds it. The person picks up a pair of jeans and folds it. The person picks up the blue shirt and jeans and puts them in a drawer.
  - Too detailed, no environment.

# 7. Pre-Submission Quality Checklist

Once you have gone over all the video, clipped and captioned, your timelines should look similar to this:
image

Before you submit a task, run through this checklist in full and resolve every red error the linter flags.

- **Clip Export limits: Every Clip Export is under 4:59 minutes.**
- **Sub-goal limits: every Sub-goal is strictly under 10.00 seconds (≤ 9.99 s) and above 1.00 second (≥ 1.00 s).**
- **Timeline continuity: Sub-goals align end-to-start without gaps or overlapping frames.**
- **Imperative mood: captions start with imperative verbs (e.g., Pick up, Wipe, Place).**
- **Approved verbs: Captions start with a verb in the Approved Verb List (Appendix A).**
- **Syntax: Every sub-goal caption follows the formula and syntax rules.**
- **Single verb: Sub-goal captions use only 1 verb, unless the caption meets a merging exception.**
- **Linter check: Run Quality Assistant linters and resolve all red errors before submitting.**

# Appendix A – Approved Verb List

| Adjust      | Flick    | Prepare    | Steady     |
| ----------- | -------- | ---------- | ---------- |
| Agitate     | Flip     | Press      | Stick      |
| Align       | Fluff    | Pry        | Stir       |
| Apply       | Fold     | Pull       | Stitch     |
| Arrange     | Form     | Pump       | Straighten |
| Assemble    | Fry      | Punch      | Stretch    |
| Attach      | Gather   | Push       | String     |
| Attempt     | Get      | Put        | Strip      |
| Bend        | Glue     | Reach      | Stuck      |
| Bind        | Grab     | Regrasp    | Sweep      |
| Blow        | Grasp    | Reinstall  | Swing      |
| Break       | Grip     | Release    | Swivel     |
| Breakdown   | Guide    | Remove     | Take       |
| Brush       | Hammer   | Repair     | Tap        |
| Buckle      | Hand off | Reposition | Tape       |
| Button      | Hang     | Retrieve   | Tear       |
| Cap         | Hold     | Return     | Test       |
| Carve       | Hook     | Reverse    | Thread     |
| Change      | Hover    | Rinse      | Throw      |
| Clean       | Idle     | Roll       | Tie        |
| Clip        | Immerse  | Rotate     | Tighten    |
| Close       | Inflate  | Rub        | Tilt       |
| Coat        | Insert   | Rummage    | Touch      |
| Coil        | Inspect  | Saw        | Trace      |
| Comb        | Install  | Scan       | Transfer   |
| Combine     | Iron     | Scatter    | Tuck       |
| Compress    | Knead    | Scoop      | Turn off   |
| Condition   | Knit     | Scramble   | Turn on    |
| Connect     | Label    | Scrape     | Turn       |
| Cook        | Lace     | Scratch    | Twist      |
| Count       | Lay      | Screw      | Unbutton   |
| Crack       | Level    | Scrub      | Unclamp    |
| Crash       | Lift     | Sculpt     | Unclip     |
| Crease      | Light    | Search     | Unclog     |
| Crimp       | Link     | Seal       | Uncoil     |
| Crochet     | Load     | Seat       | Uncrumple  |
| Crumple     | Lock     | Secure     | Unfold     |
| Crush       | Loose    | Separate   | Unhang     |
| Cut         | Make     | Set        | Unlink     |
| Dab         | Measure  | Sew        | Unlock     |
| Deal        | Merge    | Shake      | Unplug     |
| Dip         | Mix      | Shape      | Unroll     |
| Disassemble | Model    | Sharpen    | Unscrew    |
| Dispense    | Modify   | Shift      | Unseal     |
| Divide      | Mold     | Shook      | Unstack    |
| Drag        | Mop      | Shred      | Unspool    |
| Drain       | Move     | Shuffle    | Unstick    |
| Draw        | Navigate | Slice      | Untangle   |
| Drip        | Off      | Slide      | Untie      |
| Drop        | Open     | Slip       | Unwrap     |
| Dump        | Organize | Smash      | Unzip      |
| Embroider   | Paint    | Smear      | Vacuum     |
| Erase       | Paste    | Smooth     | Walk       |
| Exchange    | Peel     | Snap       | Wash       |
| Expand      | Pick up  | Soak       | Wave       |
| Fasten      | Pin      | Sort       | Wedge      |
| Fetch       | Pinch    | Split      | Wet        |
| Fill        | Place    | Spray      | Wipe       |
| Find        | Plug     | Spread     | Wrap       |
| Fix         | Poke     | Squeeze    | Wring      |
| Flat        | Position | Stack      | Write      |
| Flatten     | Pour     | Carry      | Zip        |

# Appendix B – Forbidden Verb List

| Analyze   | Assess   | Browse     | Check      |
| --------- | -------- | ---------- | ---------- |
| Choose    | Compare  | Confirm    | Detail     |
| Disengage | Ensure   | Examine    | Fine tune  |
| Finesse   | Group    | Look       | Match      |
| Observe   | Portion  | Reach for  | Refine     |
| Review    | Select   | Survey     | Tune       |
| Verify    | View     | Weigh      | Begin      |
| Complete  | Continue | Finalize   | Finish     |
| First     | Initiate | Maintain   | Rearrange  |
| Start     | Handle   | Manipulate | Pace       |
| Perform   | Section  | Work       | Additional |
| Again     | Another  | Current    | Extra      |
| Final     | Further  | More       | New        |
| Old       | Other    | Remaining  | Specific   |