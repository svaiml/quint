# Product Requirement Document: NPD Cipher v5 Hardening & Specification

**Status**: Draft
**Author**: @pm-planner
**Date**: 2026-05-14
**Task ID**: zombocrafteco-k7y

---

## 1. Executive Summary

NPD Cipher v5 is an experimental Feistel-based block cipher designed for research and benchmarking within the ZomboCraft ecosystem. While functional, it currently lacks the side-channel resistance and formal documentation required for production consideration.

**Assessment Scores (from docs/assess/npd-cipher-assessment.md):**
- **Complexity Score**: 75/100 (High)
- **Feasibility Risk**: Medium
- **Value Risk**: Low
- **Viability Risk**: Low

This specification focuses on transforming the cipher from an "Experimental" prototype into a "Hardened Candidate" through formalization, side-channel mitigation, and rigorous automated verification.

---

## 2. User Stories and Use Cases

### 2.1 User Stories
- **As a Security Engineer**, I want the cipher to be constant-time so that it is resistant to timing-based side-channel attacks.
- **As a Cryptanalyst**, I want a formal specification and tight security bounds so that I can evaluate the cipher's resistance to modern attacks.
- **As a Developer**, I want a stable, well-documented API and verified test vectors so that I can integrate the cipher reliably.

### 2.2 Use Cases
- **Authenticated Communication**: Securely transmitting research data using GCM mode.
- **Persistent Storage**: Encrypting local database blocks using CTR or CBC mode.
- **Cryptographic Benchmarking**: Comparing novel Feistel structures against established standards like AES.

---

## 3. DVF+V Risk Assessment

| Dimension | Risk Level | Mitigation Strategy |
|-----------|------------|---------------------|
| **Desirability (Value)** | Low | Ensure the cipher provides unique benchmarking hooks and competitive performance. |
| **Usability** | Low | Maintain idiomatic Rust traits and clear error handling. |
| **Feasibility** | Medium | Use `dudect` and hardware-specific instructions to ensure constant-time properties. |
| **Viability** | Low | Align with ecosystem standards for cryptographic libraries. |

---

## 4. Functional Requirements

### 4.1 Cryptographic Core
- **Block Size**: 128 bits (fixed).
- **Key Size**: 256 bits (fixed).
- **Round Count**: 16 (default), configurable for research.
- **Modes**: CTR, CBC (PKCS#7), GCM (Authenticated).

### 4.2 Hardening
- **Full Constant-Time Path**: The entire encryption and decryption pipeline must avoid secret-dependent branching and memory lookups.
- **GCM Authentication**: GF(2^128) multiplication must be constant-time.
- **Key Schedule**: Round key derivation must be resistant to timing analysis.

---

## 5. Non-Functional Requirements

- **Performance**: Maintain > 40 MB/s throughput on modern hardware (M1/M2/x64).
- **Correctness**: 100% pass rate for all 6 pinned test vectors (`vectors.toml`).
- **Auditability**: Code must be heavily commented with references to the formal specification.
- **Portability**: Fallback scalar implementations for all SIMD-optimized paths.

---

## 6. Task Breakdown (Beads Issues)

The following tasks have been initialized to track implementation:

| ID | Title | Priority |
|----|-------|----------|
| `zombocrafteco-ll5` | Formalize NPD Cipher v5 Specification Document | P2 |
| `zombocrafteco-u22` | Implement Constant-Time Round Function | P1 |
| `zombocrafteco-4rx` | Constant-Time GF(2^128) Multiplication for GCM | P1 |
| `zombocrafteco-13o` | Perform MILP Analysis for Security Bounds | P3 |
| `zombocrafteco-npd` | Integrate Dudect for Timing Leakage Detection | P2 |

---

## 7. Discovery and Validation Plan

### 7.1 Discovery
- **MILP Modeling**: Discover the true minimum active S-box count to confirm safety margins.
- **Hardware Variation Study**: Analyze timing variations across different CPU architectures (x86_64 vs aarch64).

### 7.2 Validation
- **Statistical Timing Analysis**: Use `dudect` to verify the null hypothesis (timing is independent of secrets).
- **Fuzzing**: Continuous fuzzing of GCM and Block roundtrips using `cargo-fuzz`.
- **Equivalence Testing**: Ensure constant-time and SIMD implementations are bit-exact matches of the scalar reference.

---

## 8. Acceptance Criteria and Testing

### 8.1 Automated Tests
- `cargo test --all-features`: Must pass all functional tests.
- `cargo fuzz`: No crashes or inconsistencies after 1 hour of fuzzing per target.
- `dudect`: No statistically significant timing leakage detected in 1M+ samples.

### 8.2 Documentation Criteria
- Specification document (`docs/spec/npd-cipher-v5.md`) is complete and matches implementation.
- `CRYPTANALYSIS.md` updated with MILP-verified bounds.

---

## 9. Dependencies and Constraints

- **Rust Nightly**: Required for certain SIMD intrinsics and `cargo-fuzz`.
- **Hardware AES**: Leverages `AES-NI` and `NEON` where available; must provide scalar fallback.
- **No-std**: Future compatibility for embedded use should be considered.

---

## 10. Success Metrics (Outcome-Focused)

- **Zero Timing Leakage**: Successfully passing `dudect` validation in the CI pipeline.
- **Verified Bounds**: Achieving a proven minimum of 20+ active S-boxes over 16 rounds.
- **Audit-Ready**: Completion of the formal specification document suitable for external review.
- **Performance Parity**: Hardened version remains within 20% of the experimental version's throughput.
