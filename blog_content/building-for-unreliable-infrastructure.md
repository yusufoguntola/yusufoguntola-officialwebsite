---
title: Building for unreliable infrastructure
date: 2026-01-15
tags: [infrastructure, offline-first, agritech]
excerpt: Notes from building offline-first tools for users who can't count on power or connectivity.
---

A lot of software assumes a baseline: stable power, reliable internet, a recent device. Building Workbench Desktop — a tool for managing commodity aggregation, farmer records, input loans and payments — meant designing for the opposite baseline, because that's the one our actual users had.

## Offline isn't a fallback, it's the default

The instinct is to build for the connected case and bolt on offline support later. That ordering doesn't work. If offline is a fallback, every edge case in your sync logic becomes a production incident. We flipped it: the app works fully offline, and connectivity is the enhancement that syncs state up when it's available.

## Sync conflicts are a business problem, not just a technical one

Two field agents recording the same farmer's loan repayment while both offline isn't a hypothetical — it happens weekly. The interesting part isn't the merge algorithm, it's deciding *whose record wins* in a way that matches how the business actually resolves disputes on the ground. That decision belongs to the people who understand the operations, not just the people who understand git-style merges.

## Design for the failure, not just the happy path

The systems that held up were the ones where we spent real time on what happens when a sync fails halfway, when a device runs out of storage, when a user closes the app mid-transaction. Boring work, and the most valuable work.

If you're building for markets where infrastructure isn't a given, treat "works offline" as a first-class requirement from day one — not a resilience feature you add once something breaks.
