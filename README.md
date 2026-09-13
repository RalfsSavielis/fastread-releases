# Fastread previews

Download the latest [Fastread desktop preview](https://github.com/RalfsSavielis/fastread-releases/releases).

This repository contains distribution files and installer verification only. Application source is maintained separately.

Fastread reads selected or pasted text one word at a time in a small desktop panel. Reading runs locally without accounts, analytics, or text uploads. The latest unfinished reading is saved locally so it can be resumed.

## Choose your download

- **Apple Silicon Mac:** `Fastread-1.0.0-mac-arm64.dmg`.
- **Intel Mac:** `Fastread-1.0.0-mac-x64.dmg`.
- **Windows:** `Fastread-1.0.0-win.exe` selects x64 or ARM64 during installation.

macOS 12 or later is required. Windows 10 or later is required.

On Mac, open the DMG and drag Fastread into Applications. Open the app and follow its Accessibility setup to read selections. On Windows, run the installer and follow the setup steps. The selection shortcut is Command+Option+R on Mac and Ctrl+Shift+Space on Windows. Pasting text into the reader also works.

## Preview limitations

These downloads are previews. The Mac app uses an ad-hoc signature and is not notarized; Windows installers are unsigned. Operating systems may warn or block first launch. This release does not claim normal signed-app installation trust.

Mac Apple Silicon has passed packaged UI and controlled native selection, shortcut, focus, and clipboard fixture checks. Intel UI is checked under Rosetta on Apple Silicon, not on an Intel Mac. The [Windows x64 verification run](https://github.com/RalfsSavielis/fastread-releases/actions/runs/34764945407) passed the actual download checksum, installer, reader UI, and uninstall checks on September 13, 2026. It does not prove selection capture, everyday desktop use, or Windows ARM64 behavior.

Selection support depends on the source application. Password fields, image-only text, and unavailable selections are not readable. The macOS copy fallback has unresolved races with concurrent clipboard writers; clipboard preservation is not guaranteed. Background clipboard tools can trigger the same risk. The app also offers explicit paste input.

SHA-256 checksums accompany each release. There is no automatic updater; install a newer download when one is published.
