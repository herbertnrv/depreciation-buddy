<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Offline register architecture
- Keep asset persistence and version migrations in IndexedDB via local-db; never move this register to cloud storage because existing offline records must remain available.
- Keep calculation/model logic pure and shared between schedule, summary and accounting; use unrounded balances internally and currency-rounded display months.
- Store immutable closed-year schedules and audit events with backups; report later master-data changes as explicit next-period adjustments.
- Keep Settings and accounting controls within the two existing content routes; preserve their search parameters.
- Generate QR codes and report exports locally; attachments remain data URLs in IndexedDB and JSON backups.
- Retain dated disposal, impairment and transfer movements in the pure schedule so journals and category rollforwards share the same calculation results.
- Persist ledger reconciliation balances by year in IndexedDB and include them in backup/restore to retain accounting checks offline.
- Protect dirty forms with TanStack navigation blockers; keep ISO date values in storage and show dd.mm.yyyy alongside native date controls.
