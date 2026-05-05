#!/bin/bash
# Clone the entire zombo-sash-eco ecosystem structure.
# Run from the target directory: ./clone-ecosystem.sh
# Requires: git, SSH keys for github.com
#
# Convention: repos we don't own go under _external/ (see ADR-008)

set -e

clone() { echo "  $2"; git clone --quiet "$1" "$2" 2>/dev/null || echo "    SKIP (already exists or no access)"; }

mkdir -p apps \
  epistemic-universe/_external \
  reasoning-universe \
  infra-eco \
  prodx/_external \
  tools/ai-tools/_external \
  tools/orchestrator/_external \
  tools/sysutils \
  tools/optimization/_external \
  tools/science-libs/_external \
  kernel-forge \
  research/_external

echo "── apps ──"
clone git@github.com:svaiml/code-catalyst.git             apps/code-catalyst
clone git@github.com:zombocoder/reasoning-apps.git         apps/reasoning-apps
clone git@github.com:svaiml/research-scaffold.git          apps/research-scaffold
clone git@github.com:sashml/episteme-platform.git          apps/episteme-platform

echo "── epistemic-universe (ours) ──"
clone git@github.com:svaiml/criterium.git                  epistemic-universe/criterium
clone git@github.com:svaiml/epistemic-game.git             epistemic-universe/epistemic-game
clone git@github.com:AITechCraft/episteme-lab.git          epistemic-universe/episteme-lab
clone git@github.com:AITechCraft/pbelnap.git               epistemic-universe/pbelnap
clone git@github.com:AITechCraft/bilattice-relabeler.git   epistemic-universe/bilattice-relabeler

echo "── epistemic-universe/_external ──"
clone git@github.com:AITechCraft/nanoGPT.git               epistemic-universe/_external/nanoGPT

echo "── reasoning-universe ──"
clone git@github.com:zombocoder/infer.git                  reasoning-universe/infer
clone git@github.com:zombocoder/pctl-rs.git                reasoning-universe/pctl-rs
clone git@github.com:zombocoder/zz-notation.git            reasoning-universe/zz-notation
clone git@github.com:svaiml/fpf-cards.git                  reasoning-universe/fpf-cards
clone git@github.com:zombocoder/axiomvm.git                reasoning-universe/axiomvm
clone git@github.com:zombocoder/aivm.git                   reasoning-universe/aivm
clone git@github.com:svaiml/craftegy-algo.git              reasoning-universe/craftegy-algo
clone git@github.com:zombocoder/obstruct.git               reasoning-universe/obstruct

echo "── infra-eco ──"
clone git@github.com:sashml/o2l.git                        infra-eco/o2l
clone git@github.com:rstmdb/rstmdb.git                     infra-eco/rstmdb
clone git@github.com:rstmdb/rstmdb-studio.git              infra-eco/rstmdb-studio
clone git@github.com:zombocoder/inferense.git              infra-eco/inferense
clone git@github.com:zombocoder/invariantis.git            infra-eco/invariantis
clone git@github.com:zombocoder/ctop.git                   infra-eco/ctop
clone git@github.com:zombocoder/bfc.git                    infra-eco/bfc
clone git@github.com:zombocoder/myria.git                  infra-eco/myria
clone git@github.com:zombocoder/npd-cipher.git             infra-eco/npd-cipher
clone git@github.com:zombocoder/go-freebsd-pf.git          infra-eco/go-freebsd-pf

echo "── kernel-forge ──"
clone git@github.com:zombocoder/bfc.git                    kernel-forge/bfc
clone git@github.com:zombocoder/bfcfs-linux.git            kernel-forge/bfcfs-linux

echo "── prodx (ours) ──"
clone git@github.com:svaiml/craftegy-design.git            prodx/craftegy-design

echo "── prodx/_external ──"
clone https://github.com/ag2ai/ag2.git                     prodx/_external/AgentOS
clone https://github.com/eclectix7/DesignOS.git            prodx/_external/DesignOS
clone https://github.com/OpenCoworkAI/open-codesign.git    prodx/_external/open-codesign

echo "── tools/ai-tools (ours) ──"
clone git@github.com:sashml/codegraph-rust.git             tools/ai-tools/codegraph-rust

echo "── tools/ai-tools/_external ──"
clone https://github.com/ailev/FPF.git                     tools/ai-tools/_external/FPF
clone https://github.com/DeusData/codebase-memory-mcp.git  tools/ai-tools/_external/codebase-memory-mcp
clone git@github.com:svaiml/fpf-problem-solving-skill.git  tools/ai-tools/_external/fpf-problem-solving-skill
clone https://github.com/osovv/grace-marketplace.git       tools/ai-tools/_external/grace-marketplace
clone https://github.com/BalaBenna/grace-skills.git        tools/ai-tools/_external/grace-skills
clone https://github.com/safishamsi/graphify.git           tools/ai-tools/_external/graphify
clone https://github.com/m0n0x41d/haft.git                tools/ai-tools/_external/haft
clone https://github.com/informalsystems/quint.git         tools/ai-tools/_external/quint

echo "── tools/orchestrator (ours) ──"
clone git@github.com:sashml/flowspec.git                   tools/orchestrator/flowspec

echo "── tools/orchestrator/_external ──"
clone https://github.com/thrashr888/AllBeads.git           tools/orchestrator/_external/AllBeads
clone https://github.com/Dicklesworthstone/beads_rust.git  tools/orchestrator/_external/beads_rust
clone https://github.com/Dicklesworthstone/beads_viewer_rust.git tools/orchestrator/_external/beads_viewer_rust
clone https://github.com/paperclipai/paperclip.git         tools/orchestrator/_external/PaperClip
clone https://github.com/gsd-build/gsd-2.git              tools/orchestrator/_external/gsd-2

echo "── tools/sysutils (ours) ──"
clone git@github.com:zombocoder/ghdash.git                 tools/sysutils/ghdash
clone git@github.com:zombocoder/zacta.git                  tools/sysutils/zacta
clone git@github.com:zombocoder/vaultura.git               tools/sysutils/vaultura

echo "── tools/optimization/_external ──"
clone https://github.com/BoundaryML/baml.git               tools/optimization/_external/baml
clone https://github.com/stanfordnlp/dspy.git              tools/optimization/_external/dspy
clone git@github.com:SuperagenticAI/dspy-code.git          tools/optimization/_external/dspy-code
clone https://github.com/promptfoo/promptfoo.git           tools/optimization/_external/promptfoo
clone https://github.com/microsoft/sammo.git               tools/optimization/_external/sammo

echo "── tools/science-libs/_external ──"
clone https://github.com/naproche/naproche.git             tools/science-libs/_external/naproche
clone https://github.com/ips-kyiv/algorithmic-algebras-embedding.git tools/science-libs/_external/algorithmic-algebras-embedding

echo ""
echo "Done. $(find . -maxdepth 4 -name .git -type d | wc -l) repos cloned."
echo "Run: uv run python bin/eco-sync status"
