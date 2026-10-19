# Listening course

17 lessons, 412 spoken prompts, based on the user-supplied «Вьетнамский язык за 1 час» PDF and Track 02.mp3–Track 18.mp3. User-provided recordings are the source, not synthesized speech. The originals are not included in the website/repository.

The course is a phrasebook: some prompts are whole sentences, others are numbers or words. No fictional conversations or speakers have been added. The result screen shows the complete Vietnamese text heard in that lesson.

## Reproduce

Requires Python 3 and ffmpeg (libmp3lame):

```sh
python3 scripts/prepare-listening.py --audio-dir /path/to/original-mp3-files
npm run build
npm test
```

Edit `source-manifest.json` for canonical phrases, Russian translations and source cut boundaries (seconds). Edit `glossary.txt` for word/term translations. The script checks that every Vietnamese token is covered by the glossary, preserves first occurrence order, and generates `src/content/listening/lessons.ts` and `public/audio/listening/01.mp3`–`17.mp3` deterministically. It fails if vocabulary is missing. No speech recognition or external service is needed to reproduce the outputs.

Each MP3 contains only the Vietnamese prompts for one lesson. Prompt boundaries are generated alongside the audio. One second of silence separates consecutive prompts; the player pauses at each boundary using both animation frames and timeupdate, and pauses when the document is hidden. Replay restarts the current phrase. Errors never count as successful listening. Only a fully heard phrase enables answers. A rejected autoplay is recovered by the replay button. Leaving the screen cancels audio and pending transitions.

## Source reconciliation

| New lesson | Original recording / PDF section |
| --- | --- |
| 1–3 | Track 02–04 / sections 1–3 |
| 4–17 | Track 05–18 / sections 5–18 |

There is no recording for section 4, «В аэропорту», among the supplied files. It is therefore not presented as a listening lesson. PDF-only hotel phrase «Có chỗ để nối máy tính không?» and US-phone question «Làm sao gọi đi Mỹ?» are unrecorded and excluded. Two recorded phrases missing from the PDF are included: «Bạn có đi Mỹ chưa?» and «Chỗ hút thuốc hay không hút thuốc?». The two shopping questions addressed to a man/woman are separate prompts. The last communication prompt has an unusually long pause between Russian and Vietnamese; it is one prompt. Russian headings, prompts and the Russian course outro are excluded.

OCR errors, shifted hotel translations, nóng/lạnh reversal and mistranslations have been corrected. Repeated «Chào bạn!» and «Xin lỗi» have shared translations so the game does not ask the learner to distinguish identical recordings by different Russian labels. Terms can have contextual meanings (e.g. đường: street/sugar, chín: nine/cooked).

## Loading and existing game exports

The listening screen and its typed content are a separate lazy chunk. No audio is requested on the home page, lesson menu or vocabulary page. Starting/replaying requests only that lesson's audio. There is no service worker or precache. Listening does not import or fetch `public/game-data`; the earlier lesson JSON exports remain build-only and unchanged. No original full-length MP3/PDF is bundled.
