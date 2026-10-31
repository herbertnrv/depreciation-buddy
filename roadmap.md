# Required register improvements

## Monthly posting vouchers (new request)
- [x] Add /monthly with category totals, journal proposal, changes, detail and 12-month overview using unchanged schedule values.
- [x] Add offline posted-month snapshots, reopening audit, sequence warnings and discrepancy banners; include in JSON backup/restore.
- [x] Extend account mapping with account names and optional cost-centre overrides.
- [x] Add A4 portrait PDF/Print, formula-based Excel, Journal CSV and full-year export.
- [x] Run concrete acceptance tests (48 passed) and verify posting/export/reopening and account-name flows through the UI; A4 PDF visually checked.

- [x] Phase 1 core implemented: calculation engine, migration, extended assets, settings, events, closing, audit and backups; 24 automated tests passed.
- [x] Phase 2 core implemented: retained summary columns, expandable detail, checks, LAK formats, Excel formulas/frozen headers and A4 PDF; browser exports verified.
- [x] Phase 3 controls implemented: ledger mapping, journal export, reconciliation, QR labels/count and acceptance test view; disposal and journals browser-verified.
- Deferred by request: dashboard and second tax depreciation book.
## Completion pass requested
- [ ] Complete EN/DE coverage for remaining import messages, errors, audit values and accounting export text.
- [ ] Verify multi-page PDF total-row placement and pagination; preview currently displays a single continuous sheet.
- [ ] Verify physical QR printing/count export and year closing through the UI; automated closing tests passed.
- [ ] Review category transfers against category-level year-to-year rollforward; current transfers use year-end category classification.
- [ ] Finish date-input display consistency, unsaved internal navigation protection, and reconciliation balance persistence.
- [ ] Review per-transaction journal dates and partial-disposal journal breakdown before live accounting use.
- [ ] Rebuild the downloadable Windows application separately; only the running app was updated.
