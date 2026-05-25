# 🎙️ Pronunciation Features — How It Works

This document explains how Text-to-Speech (the speaker button) and Speech Recognition (the microphone button) work in the VR pronunciation practice screen. Written in plain English for anyone — no coding knowledge needed.

---

## 1. What Tools We Use

**Text-to-Speech (TTS)** is when the app reads text out loud using a computer voice. We use the browser's built-in `speechSynthesis` API. No external service, no paid API, no internet call — the voice lives inside the browser itself.

**Speech-to-Text (STT)** is when the app listens to the user speak and converts it to written text. We use the browser's built-in `SpeechRecognition` API. Again, no external service — it runs inside the browser.

Both features are **free and built into the browser**. They work with zero setup for the user.

**Supported browsers:** Chrome and Edge only. Firefox and Safari do not support `SpeechRecognition` and have limited support for TTS voices. All other features of the app (courses, quizzes, admin panel) work in any browser.

---

## 2. How Text-to-Speech Works (Speaker Button)

The speaker button appears in two places on the pronunciation screen: next to the NPC's dialogue line, and next to the target phrase.

**When the user clicks the speaker button**, the `speak()` function runs. Here is what it does, step by step:

1. It checks that the browser has `speechSynthesis` available. If not, it does nothing.
2. It checks that there is actually text to speak. If the text is empty, it stops and logs a warning.
3. It cancels any voice that is currently playing, so two voices don't overlap.
4. It waits for the browser's voice list to finish loading. If the list is empty, it listens for the `onvoiceschanged` event and speaks as soon as voices are ready. This prevents a common bug where voices load slowly on first page open.
5. It creates a new utterance (a speech request) with the text to read.
6. It picks the right voice using the language of the current VR scenario.
7. It sets the speech rate to 0.85 (slightly slower than normal, for clarity), pitch to 1, and volume to 1.
8. It speaks the utterance.

**How the voice is selected:**

The app looks up the scenario's language in a built-in list called `langMap`. This list maps language names to language codes:

| Language | Code |
|---|---|
| Spanish | es-ES |
| French | fr-FR |
| Hindi | hi-IN |
| German | de-DE |
| Italian | it-IT |
| Japanese | ja-JP |
| Portuguese | pt-BR |
| Mandarin | zh-CN |
| Arabic | ar-SA |
| Korean | ko-KR |

The lookup is **case-insensitive**, handled by a helper called `getLangCode()`. So "hindi", "Hindi", and "HINDI" all correctly resolve to `hi-IN`.

**If the language is not in the list**, the app defaults to `en-US` (English).

**Hindi is a special case** — see Section 4 for details.

---

## 3. How Speech Recognition Works (Microphone Button)

After the user picks the correct answer in a dialogue step, a pronunciation practice screen appears. The user sees a target phrase and a large microphone button.

**When the user clicks the mic button**, the `handleStartListening()` function runs. Here is what happens:

1. It checks that the browser supports `SpeechRecognition`. If not, it shows a message asking the user to switch to Chrome or Edge.
2. It asks the browser for microphone permission using `navigator.mediaDevices.getUserMedia`. If the user clicks Deny, an error is shown.
3. It creates a fresh `SpeechRecognition` instance and sets the language using `getLangCode()` — the same case-insensitive helper used by TTS.
4. It starts listening. The mic button turns red and pulses to show it is active.
5. An 8-second safety timeout starts. If the user has not spoken after 8 seconds, the app stops listening and shows a "timed out" message.
6. When the browser hears something, it returns a text transcript of what was said.
7. The `handlePronounceCheck()` function compares that transcript to the target phrase.

**How the comparison works — the `normalize()` function:**

Before comparing, both the transcript and the target phrase are run through `normalize()`. This function:
- Converts everything to lowercase
- Removes accent marks (so "café" matches "cafe")
- Removes punctuation like `.`, `,`, `!`, `?`, `¿`, `¡`
- Removes Hindi danda punctuation (`।` and `॥`)

This makes the comparison flexible. A small typo in punctuation or casing won't cause a wrong result.

**If the answer is correct:** A green "Correct! Well done." banner appears. The practice screen closes and the user can move to the next step.

**If the answer is incorrect:** A red banner shows what the user said and what was expected. The user gets 1 retry. After 2 failed attempts, the retry button disappears and the user can click Skip.

**The Skip button:** Always visible at the bottom of the pronunciation screen. Clicking it closes the pronunciation panel without marking it as correct or incorrect. The user simply moves on.

**Possible errors and what they mean:**

| Error | What it means |
|---|---|
| `not-allowed` or `service-not-allowed` | The user denied microphone permission, or the browser blocked the mic. Check browser settings. |
| `no-speech` | The app listened but didn't hear anything. Speak louder or closer to the mic. |
| `network` | Speech recognition needs an internet connection. Check the connection. |
| `language-not-supported` | The browser or device does not support that language for STT. Hindi users see a specific message pointing them to Chrome on Windows or Android. |

---

## 4. Hindi Specifically

Hindi is harder than other languages for two reasons:

**Reason 1 — Voice availability.** Not every device has a Hindi voice installed. Windows has it, Android has it, but many computers do not.

To handle this, the `speak()` function uses a special fallback chain when the language is Hindi. It searches the available voices in this order:

- First, it looks for a voice with the language code `hi-IN`
- If not found, it looks for `hi` (generic Hindi)
- If not found, it looks for `en-IN` (Indian English, which at least has the right accent)
- If not found, it looks for any voice whose name contains the word "hindi"
- If none of those are found, the app shows a small warning below the speaker button: "Hindi voice not available on this device. Try Chrome on Windows or Android."

**Reason 2 — Devanagari vs Roman script.** When a user speaks Hindi into a Chrome microphone, the browser may return the transcript in Devanagari script (e.g. नमस्ते) or in Roman letters (e.g. "namaste"), depending on the device's language settings. If the admin typed the target phrase in one script and the browser returns the other, the comparison will always fail.

**How to avoid this:** Admins should type target phrases in Devanagari script (हिंदी). This matches what Chrome on Windows and Android returns when the user speaks in Hindi. If Roman letters are used in the target phrase, the comparison will fail on most devices.

**The case-insensitive fix:** The `getLangCode()` and `getCanonicalLang()` functions ensure that even if the language was saved to MongoDB as "hindi" (lowercase) by the admin, it still correctly resolves to `hi-IN` and triggers the Hindi-specific voice search.

---

## 5. How the Admin Sets Up Pronunciation

In the Admin Dashboard, go to the VR Scenarios section. Open any scenario and look at its dialogue steps. Each step has a field called **Target Phrase**.

The target phrase is the exact text the user should say out loud. When the user clicks the mic button, the app compares what it hears to this phrase. The comparison uses the `normalize()` function, so exact punctuation does not matter — but the words must match.

**The speaker button on the admin side** (if visible) uses the same `speak()` function to preview how the phrase will sound. This lets the admin hear it before publishing.

**Tips for writing good target phrases:**

- Keep the phrase short — one sentence or less works best.
- For Hindi, write the phrase in Devanagari script, not Roman letters.
- Do not include punctuation — the normalize function strips it, but cleaner input is always better.
- Match the phrase to what a real person would naturally say in that scenario.
- Test it yourself by clicking the mic button and speaking the phrase.

---

## 6. Known Limitations

- **Chrome and Edge only.** TTS voices and `SpeechRecognition` do not work in Firefox or Safari.
- **Hindi voice may not be installed.** If no Hindi voice is found, TTS will either be silent or fall back to an Indian English voice. The app shows a warning when this happens.
- **Internet required for STT.** Chrome's `SpeechRecognition` sends audio to Google's servers for processing. An internet connection is required.
- **Language pack required for some languages.** On Windows, some languages (including Hindi) require the matching language pack to be installed in Windows Settings before the voice and recognition work correctly.
- **Script mismatch for Hindi.** If the target phrase is in Roman letters but the browser returns Devanagari (or vice versa), the pronunciation check will always fail. Use Devanagari for Hindi phrases.
- **One tab only.** Running the VR scene in multiple tabs at the same time can cause the microphone or speech engine to conflict. Use one tab.
