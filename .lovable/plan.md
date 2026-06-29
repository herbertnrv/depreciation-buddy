## Ziel

Eine echte Offline-Anwendung **GastronoAssets — Hotel & Gastro Service** für Windows. Keine Internetverbindung nötig, alle Anlagegüter werden lokal auf dem PC gespeichert. Startbar über ein Desktop-Icon mit deinem Logo.

## Was sich ändert

### 1. Lokale Datenbank statt Cloud
Die Anlagegüter wandern von der Cloud-Datenbank in eine **lokale Browser-Datenbank (IndexedDB)** direkt auf dem PC. Vorteile:
- Funktioniert komplett ohne Internet
- Keine Zugangsdaten nötig
- Daten bleiben auf dem PC
- Schnell, da lokal

Wichtig zu wissen:
- Die Daten liegen nur auf **einem** PC. Kein automatischer Sync zwischen mehreren Geräten.
- Backup/Restore über Excel-Export bleibt verfügbar (du kannst zusätzlich die ganze Datenbank als JSON exportieren/importieren).
- Bestehende Cloud-Daten gehen für die Offline-App verloren – ich baue einen einmaligen Export/Import-Weg ein.

### 2. App-Umbau auf Client-Modus
Die App wird auf reines Client-Rendering umgestellt (Single Page Application). Damit kann sie als statische Dateien laufen — Voraussetzung für eine echte Offline-EXE.

### 3. Windows-EXE „GastronoAssets.exe"
- Verpackt mit Electron + @electron/packager
- Dein Logo wird zum Programm-Icon
- Verknüpfung im Startmenü / Desktop möglich
- Doppelklick → App startet wie ein normales Windows-Programm
- Du bekommst eine ZIP zum Download

### 4. Branding-Anpassung
- App-Titel „GastronoAssets"
- Untertitel „Hotel & Gastro Service"
- Logo im Header

## Funktionsumfang bleibt erhalten

- Anlagegüter-Verwaltung (CRUD)
- Excel-Import aus deiner Vorlage
- Monatliche lineare Abschreibung
- Automatischer Jahres-Übertrag (2025 → 2026 → 2027 …)
- Sortierung Inv #, Standort, Kaufdatum (auf-/absteigend)
- Excel- und PDF-Export
- Nutzungsdauer-Dropdown, Grundstücke ohne Abschreibung
- Eingabevalidierung (Preis > 0, Disposal-Datum nicht in Zukunft)

## Technische Details (für Entwickler)

```text
Datenbank:    IndexedDB via Dexie.js
Render-Modus: TanStack Start SSR → SPA (ssr: false, base: "./")
Speicher:     fixed_assets als lokale Tabelle, gleiches Schema wie zuvor
Wrapper:      Electron (main.cjs, contextIsolation: true)
Packaging:    @electron/packager --platform=win32 --arch=x64
Icon:         Logo → 256x256 .ico für Windows
Auslieferung: GastronoAssets-win32-x64.zip in /mnt/documents/
```

Schritte:
1. Dexie + lokales DB-Modul anlegen, gleiche API wie Supabase-Client (`from('fixed_assets').select/insert/update/delete`)
2. Supabase-Aufrufe in `assets`, `schedule`, `import-xlsx`, `use-assets` durch lokale DB ersetzen
3. JSON-Backup/Restore-Buttons hinzufügen
4. `vite.config.ts`: `base: "./"`, SPA-Modus
5. Logo nach `public/icon.png` + `build/icon.ico` konvertieren
6. `electron/main.cjs` schreiben, `package.json` `main` setzen
7. Build + Package für Windows, ZIP nach `/mnt/documents/`

## Installation auf deinem Windows-PC

1. ZIP herunterladen und entpacken
2. Ordner an gewünschten Ort verschieben (z.B. `C:\Programme\GastronoAssets`)
3. Rechtsklick auf `GastronoAssets.exe` → „An Start anheften" / „Verknüpfung auf Desktop"
4. Doppelklick → läuft offline

## Was nicht geht / Einschränkungen

- Nur ein PC pro Datenbestand (kein Multi-User über mehrere PCs)
- Bestehende Cloud-Daten musst du einmalig per Excel-Export rüberziehen
- Updates der App = neue EXE herunterladen
- Build wird im Sandbox unter Linux gemacht und für Windows cross-compiliert (funktioniert, aber kein signiertes Installer-Setup `.msi/.exe-Installer` — du bekommst den App-Ordner als ZIP)

Soll ich so loslegen?