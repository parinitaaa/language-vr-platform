# 🐛 How We Fixed the Hindi Language Bug

This document explains the Hindi speech bug in plain English — what was broken, why it was broken, and exactly what we changed to fix it.

---

## What Was Broken

Two things were not working for Hindi specifically:

1. **The speaker button (Text-to-Speech) was silent.** Clicking the speaker icon next to a Hindi phrase produced no sound at all.
2. **The microphone button (Speech Recognition) was not matching correctly.** Even when the user said the phrase correctly, the app marked it as wrong.

All other languages (Spanish, French, German, etc.) were working fine. Only Hindi was affected.

---

## Bug 1 — Why the Speaker Button Was Silent

### The Root Cause

When the speaker button is clicked, the app tells the browser: "speak this text in this language." It does this by setting a `lang` property — for Hindi, that was `hi-IN`.

The problem is that **setting the language code is not enough**. The browser's speech engine needs an actual installed voice file for that language. Setting `lang = 'hi-IN'` just tells the browser *what* language you want. If the browser cannot find a matching voice on the device, it simply stays silent. No error, no warning — just silence.

This is a known quirk of the `speechSynthesis` browser API.

### The Second Problem — Voices Load Too Late

There is a timing issue on many browsers. When the page first loads, the list of available voices is empty for a brief moment while the browser loads them in the background. If the speaker button is clicked before the voices finish loading, the app sees an empty list, cannot find any Hindi voice, and gives up.

The old code called `getVoices()` and immediately tried to use the result — but the list was often still empty.

### What We Fixed

We rewrote the `speak()` function to do two things:

**Fix A — Wait for voices to load.** Before doing anything, the function now checks if the voice list is empty. If it is, it waits for the browser to fire an `onvoiceschanged` event (which means "voices are ready now") and only speaks after that. This removes the race condition entirely.

**Fix B — Search for a Hindi voice using a fallback chain.** Instead of blindly setting `lang = 'hi-IN'` and hoping, the function now actively searches the available voices in this order:

- First: a voice with the code `hi-IN` (standard Hindi, India)
- Second: a voice with the code `hi` (generic Hindi)
- Third: a voice with the code `en-IN` (Indian English — at least the right accent)
- Fourth: any voice whose name contains the word "hindi"
- If none of the above are found: the speaker button still shows up, but a small amber warning now appears beneath it saying "Hindi voice not available on this device. Try Chrome on Windows or Android."

This means that on a device that has a Hindi voice (like most Windows PCs or Android phones with Chrome), the correct voice is found and used. On devices that don't have one, the user at least sees an explanation instead of mystery silence.

---

## Bug 2 — Why the Microphone Button Wasn't Matching

### Root Cause A — Wrong Default Language

The old code that started the microphone had this line:

> `recognition.lang = langMap[language] || 'es-ES'`

This means: look up the language in the list, and if it fails, default to Spanish. The problem is the lookup could fail silently. If the admin saved the scenario's language as `"hindi"` (lowercase) instead of `"Hindi"` (capital H), the lookup returns `undefined`, and the app defaults to Spanish — so the microphone listens for Spanish instead of Hindi. The user speaks Hindi, the browser hears Spanish-mode audio, and nothing matches.

### Root Cause B — Punctuation Mismatch

Hindi uses its own sentence-ending punctuation mark called a **danda** (`।`). A sentence like `नमस्ते।` ends with that character. The old comparison code stripped out English punctuation like `.` and `?` but did not know about the Hindi danda. So when the browser returned a transcript with `।` at the end and the target phrase also had `।`, the two would not match cleanly after stripping.

### Root Cause C — No Error Message for Unsupported Language

If the browser's `SpeechRecognition` engine doesn't support Hindi at all (some devices simply don't), it fires an error called `language-not-supported`. The old code had no handler for that specific error, so the user would just see a generic "Recognition error: language-not-supported. Please try again." — with no explanation of what to do.

### What We Fixed

**Fix A — Case-insensitive language lookup.** We added two new helper functions: `getLangCode()` and `getCanonicalLang()`. Both of these do a case-insensitive search through the language list. So `"hindi"`, `"Hindi"`, and `"HINDI"` all correctly resolve to `hi-IN`. These helpers replaced the old direct `langMap[language]` lookups everywhere in the component.

**Fix B — Hindi punctuation in the normalize function.** The `normalize()` function (which cleans up text before comparing) already removed accents and Latin punctuation. We added one line to also strip the Hindi danda (`।`) and double-danda (`॥`). Now a phrase ending with `।` is treated the same as one without it.

**Fix C — Specific error message for Hindi.** We added a new case to the `onerror` handler for the `language-not-supported` error. When this happens during a Hindi session, the user now sees:

> "Hindi speech recognition is not supported on this browser/device. Try Chrome on Windows, Android, or a device with the Hindi language pack installed."

For other languages, a generic version of the message is shown instead.

---

## A Bonus Issue We Fixed — The Devanagari vs Roman Script Problem

This one is not a code bug — it is a design gap.

When a user speaks Hindi into Chrome, the browser can return the transcript in either **Devanagari script** (e.g. `नमस्ते`) or **Roman letters** (e.g. `namaste`), depending on the device's language settings.

If the admin typed the target phrase in Roman letters but the browser returns Devanagari, the comparison will always fail — the words look completely different to a computer even if they sound the same.

We cannot automatically convert between scripts without an external library, so the fix here is a guidance one: admins are now told, in the UI and in the documentation, to type Hindi target phrases in Devanagari script. Chrome on Windows and Android consistently returns Devanagari when the device has Hindi set up, so this gives the best chance of a correct match.

---

## Summary of All Changes Made

| What changed | Where | Why |
|---|---|---|
| Voice fallback chain `hi-IN → hi → en-IN → name includes 'hindi'` | `speak()` in VRDialogue.jsx | So the app finds a Hindi voice even if `hi-IN` is not available |
| Wait for `onvoiceschanged` before speaking | `speak()` in VRDialogue.jsx | Fixes race condition where voices load after the button is clicked |
| `hindiVoiceWarning` state + warning message in UI | VRDialogue.jsx | Tells the user clearly when no Hindi voice is found |
| `getLangCode()` helper — case-insensitive lookup | VRDialogue.jsx | Fixes mismatches when language is stored as "hindi" not "Hindi" |
| `getCanonicalLang()` helper | VRDialogue.jsx | Used inside `speak()` and `onerror` to detect the Hindi branch |
| Hindi danda `।` and `॥` removed in `normalize()` | VRDialogue.jsx | Stops danda punctuation causing false mismatches |
| `language-not-supported` error case with Hindi-specific message | `handleStartListening()` in VRDialogue.jsx | Gives users an actionable message instead of a cryptic error |

---

## Which Files Were Changed

Only one file was modified: `client/src/components/VRDialogue.jsx`

No other files were touched. All other languages, the admin panel, courses, lessons, quizzes, and VR scene rendering were left completely unchanged.
