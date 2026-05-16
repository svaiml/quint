---
id: task-003
title: Add Windows support to bfc
status: Done
assignee:
  - '@claude'
created_date: '2026-04-27 15:56'
updated_date: '2026-04-28 14:32'
labels:
  - infra
  - cross-platform
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement cross-platform compatibility for bfc on Windows using Win32 API and MSVC/MinGW-w64.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Implement Win32-based memory mapping (bfc_mmap/bfc_munmap)
- [x] #2 Add MSVC-specific CRC32C intrinsics
- [x] #3 Implement best-effort POSIX metadata mapping for Windows
- [x] #4 Fix header inclusions and type definitions for MSVC
- [x] #5 Update CMake build system for Windows support
- [x] #6 Add Windows CI to GitHub Actions
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Phase 1: Core Library & Tests
1. Implement bfc_mmap and bfc_munmap using Win32 API (CreateFileMapping, MapViewOfFile).
2. Add MSVC-specific CRC32C intrinsics (_mm_crc32_u64) guarded by _MSC_VER.
3. Implement best-effort POSIX metadata (permissions, timestamps) for Windows.
4. Replace POSIX headers (unistd.h, etc.) with Windows equivalents and handle type mismatches (ssize_t).

Phase 2: Build System & CI
5. Update CMakeLists.txt to handle MSVC flags and link Windows libraries (ws2_32, bcrypt).
6. Add windows-latest to CI matrix.

Phase 3: Polish & Testing
7. Mark FUSE as unsupported on Windows for now.
8. Adapt CLI tests for Windows path separators.
9. Update documentation with Windows build instructions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added MSVC compiler flags to root CMakeLists.txt (/W4 /WX /Od /Zi /O2, _CRT_SECURE_NO_WARNINGS)
- Added windows-latest to CI matrix with vcpkg-based zstd/libsodium install
- Added Windows-specific CMake configure (TOOLCHAIN_FILE + x64-windows triplet)
- Added PowerShell test steps for CLI validation on Windows
- Guarded Unix-only steps (benchmarks, symlink tests) with `if: matrix.os \!= windows-latest`
- Added Windows build + test + ZIP packaging to release.yml
- All platform-specific bfc_os.c, bfc_crc32c.c, bfc_win32_compat.h, cli_win32_compat.h already in place from prior work

- Fixed GitHub Advanced Security CodeQL TOCTOU (high severity) at cmd_extract.c: replaced stat()+open() in extract_directory with open(O_RDONLY|O_DIRECTORY|O_NOFOLLOW) as atomic probe; branches on errno (ENOENT/ENOTDIR/ELOOP) instead of separate stat check
- All 11 CI checks pass on PR #11 (6 build-and-test, CodeQL, security, coverage, static-analysis)
<!-- SECTION:NOTES:END -->
