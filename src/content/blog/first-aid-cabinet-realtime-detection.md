---
title: 'Real-time detection on a Raspberry Pi, built for eight-year-olds'
date: '2026-08-21'
summary: 'A wooden arcade cabinet, a Raspberry Pi, and one TensorFlow Lite model doing four different jobs. What the code actually does, and what broke once real kids started using it.'
tags: ['Python', 'Computer Vision', 'Raspberry Pi']
readingTime: 6
image: '/blog/first-aid-cabinet-realtime-detection.webp'
draft: true
---

First Aid Adventure was a defended thesis, built with two teammates: a
first-aid learning system for grade 3 to 5 kids, running on a fullscreen
Tkinter interface inside a wooden arcade cabinet powered by a Raspberry Pi.
A camera and a TensorFlow Lite model watch what a kid holds up to the lens
and grade it in real time.

Going back through `MainMode.py` after the fact, three things stood out
that weren't obvious from the outside.

## One classifier, four different games

`labels.txt` has 19 classes:

```
0 Unknown    5 Three   10 Bruise      15 True
1 Natural    6 One     11 Laceration  16 False
2 Manmade    7 Four    12 Abration    17 Landslide
3 Fire       8 Strain  13 Burn        18 Earthquake
4 Flood      9 Sprain  14 Two
```

That's disaster types, injury types, true/false, and the digits one
through four, all in a single model. There's no per-quiz classifier. A kid
holds up a printed card, `model_unquant.tflite` says which of the 19
classes it thinks it's looking at, and each screen just interprets that
same output differently: a disaster-ID screen only cares about classes 1
through 4, a true/false screen only cares about 15 and 16. One MobileNet
model trained once in Teachable Machine (the unquantized export, the
default `-1` to `1` normalization, the 224×224 input) is doing the job of
four separate quiz mechanics, because retraining a model per mini-game
was never worth it next to just re-reading the same output differently
per screen.

## Tuned for a Pi, not a laptop

The camera loop assumes it's running on hardware that will struggle if you
let it:

```python
self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
self.cap.set(cv2.CAP_PROP_FPS, 10)
self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
```

320×240 at 10fps is a small frame to classify, but the buffer size is the
detail that matters more. OpenCV will happily queue up frames faster than
you read them, which means a `.read()` call can hand you a frame that's
already stale by the time inference finishes with it. Capping the buffer
at 1 forces every read to be the newest frame available, at the cost of
occasionally dropping one. For a kid holding a card up to a camera, a
slightly choppier feed reading the *current* card beats a smooth feed
that's a second behind.

Opening the camera at all took more than one line, too:

```python
for idx in camera_indices:
    self.cap = cv2.VideoCapture(idx)
    if self.cap.isOpened():
        ret, test_frame = self.cap.read()
        if ret and test_frame is not None:
            break
```

`cap.isOpened()` returning `True` doesn't mean the camera will actually
hand you frames. It's a common enough OpenCV gotcha that the code probes
indices 0, 1, and 2 and demands a real, non-empty frame before it trusts
any of them.

## The threshold that says 90% and means 60%

```python
# Only respond to high-confidence detections (90% confidence threshold)
if confidence >= 0.60:
```

The comment and the code disagree, and the code is the one telling the
truth: it was tuned down from 90% during real testing, not in a lab with
good lighting and a card held steady at a fixed distance, but with actual
grade-school kids in an actual classroom. Lighting shifted, cards tilted,
distance from the lens varied kid to kid, and a threshold tuned for clean
training photos missed constantly. Dropping it to 60% traded some false
positives for a system that actually responded to a real kid holding a
real card at a real angle, and the comment above it is just a fossil from
before that tradeoff got made.

## A servo door as the reward

The cabinet has a physical door on a GPIO servo, and it's wired straight
to detection state:

```python
def open_servo_door(self):
    self.servo.value = 0.5   # right position first
    time.sleep(0.5)
    self.servo.value = -0.5  # then down (open)
```

The door opens when a scanning screen becomes active, and closes again
five seconds after a confident correct detection, right before the UI
navigates on. It's a small thing, but it's the difference between "the
screen changed" and something in the cabinet physically responding to
what the kid just did. That physical feedback loop is arguably a bigger
part of why this reads as a game and not a quiz app than anything in the
Tkinter UI is.

## What's still rough

Two things a defended thesis doesn't have to fix, but a shipped product
would:

**The database path is hardcoded to a dev machine.** `db.py` still points
at `D:\Desktop\Game\MainMode\TkinterDesigner-MainMode\GameDatabase.db`: a
literal Windows path from whichever laptop this was last built on, baked
into the same file that also assumes `/dev/video0` for the camera
elsewhere in the app. The two assumptions contradict each other, and
neither survives moving to a different machine.

**Servo error handling arrived late, not everywhere.** Tkinter Designer
generates one class per screen, so the servo-and-model setup in an early
screen like `Learn3Frame26` assumes `Servo(18, ...)` just works. By the
time a later screen like `Learn4Frame65` was written, that same setup is
wrapped in a `try/except` with `self.servo = None` as a fallback. Something
broke a servo init at some point during development, and the fix landed
in whichever screens got touched after, not retroactively in the ones
written before it.

---

The model doesn't know first aid. It knows which of 19 printed cards is
closest to the lens, at whatever confidence a real classroom actually
produces. That's not a limitation the project is hiding, it's the whole
design: turn a fixed, well-lit training set into something that still
responds correctly when the "well-lit" part stops being true, because a
room full of eight-year-olds was never going to hold still for the
alternative.
