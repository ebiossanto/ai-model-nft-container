# Testes e Integração Contínua

## Suíte de Testes de Segurança

O script `tests/blockchain/nft_behavior.test.js` (formato compatível com **Hardhat/Mocha/Chai** usando **ethers.js v6**) simula um vetor de ataque onde uma carteira maliciosa tenta alterar os pesos do modelo de IA e valida que apenas a Sandbox parametrizada detém tal poder.

### Casos de Teste

| Teste | Descrição |
|-------|-----------|
| `assignSandbox` | Verifica se o pesquisador pode associar uma Sandbox autorizada |
| `updateModelMetrics` | Verifica se apenas a Sandbox autorizada pode atualizar métricas |
| `ATAQUE: updateModelMetrics` | Verifica se tentativas maliciosas são rejeitadas |

### Código do Teste

```javascript
// SPDX-License-Identifier: MIT
/**
 * @file nft_behavior.test.js
 * @notice Teste unitário e de invasão para o smart contract AISandboxModelNFT.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testes de Segurança e Comportamento: AISandboxModelNFT", function () {
    let aiNftContract;
    let owner;
    let researcher;
    let authorizedSandbox;
    let maliciousAttacker;
    
    const initialModelHash = "ipfs://QmInitialWeightsHash1234567890";
    const datasetProof = "0x746573745f6d65726b6c655f726f6f745f646174617365745f70726f6f663031";
    const tokenURI = "ipfs://QmMetadataURI";
    let tokenId;

    beforeEach(async function () {
        [owner, researcher, authorizedSandbox, maliciousAttacker] = await ethers.getSigners();

        const AISandboxModelNFT = await ethers.getContractFactory("AISandboxModelNFT");
        aiNftContract = await AISandboxModelNFT.deploy();
        await aiNftContract.waitForDeployment();

        const tx = await aiNftContract.connect(owner).mintModel(
            researcher.address,
            initialModelHash,
            datasetProof,
            tokenURI
        );
        const receipt = await tx.wait();

        const log = receipt.logs[0];
        const parsedLog = aiNftContract.interface.parseLog(log);
        tokenId = parsedLog.args.tokenId;
    });

    it("Deve permitir ao pesquisador associar uma Sandbox autorizada ao seu Token", async function () {
        await expect(aiNftContract.connect(researcher).assignSandbox(tokenId, authorizedSandbox.address))
            .to.emit(aiNftContract, "SandboxAssigned")
            .withArgs(tokenId, authorizedSandbox.address);

        const modelData = await aiNftContract.registry(tokenId);
        expect(modelData.sandboxId).to.equal(authorizedSandbox.address);
    });

    it("Deve permitir que APENAS a Sandbox autorizada envie atualizações de métricas do modelo", async function () {
        await aiNftContract.connect(researcher).assignSandbox(tokenId, authorizedSandbox.address);

        const newModelHash = "ipfs://QmNewTrainedWeightsHash987654321";

        await expect(aiNftContract.connect(authorizedSandbox).updateModelMetrics(tokenId, newModelHash))
            .to.emit(aiNftContract, "ModelUpdated")
            .withArgs(tokenId, newModelHash, 2n, authorizedSandbox.address);

        const modelData = await aiNftContract.registry(tokenId);
        expect(modelData.modelHash).to.equal(newModelHash);
        expect(modelData.version).to.equal(2n);
    });

    it("ATAQUE: Deve REJEITAR e FALHAR se uma entidade maliciosa tentar alterar o modelo", async function () {
        await aiNftContract.connect(researcher).assignSandbox(tokenId, authorizedSandbox.address);

        const maliciousHash = "ipfs://QmHackedAndInjectedWeightsHash";

        await expect(
            aiNftContract.connect(maliciousAttacker).updateModelMetrics(tokenId, maliciousHash)
        ).to.be.revertedWith("Apenas a Sandbox autorizada pode atualizar");

        const modelData = await aiNftContract.registry(tokenId);
        expect(modelData.modelHash).to.equal(initialModelHash);
        expect(modelData.version).to.equal(1n);
    });
});
```

## GitHub Actions - CI Pipeline

O fluxo de trabalho `.github/workflows/ai-pipeline-ci.yml` roda automaticamente a cada push ou pull_request no repositório.

### Jobs

| Job | Descrição |
|-----|-----------|
| `audit-and-test` | Executa testes de IA e Blockchain |

### Passos

1. **Clonar Código** - Checkout do repositório
2. **Configurar Python** - Setup Python 3.11 com cache pip
3. **Instalar Dependências IA** - Instala pytest
4. **Executar Testes IA** - Roda `dataset_processor.py`
5. **Configurar Node.js** - Setup Node 20 com cache npm
6. **Instalar Dependências Web3** - Executa `npm ci`
7. **Compilar e Testar** - Compila contratos e roda testes de segurança

### Código do Workflow

```yaml
name: AI Model Governance CI Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main ]

jobs:
  audit-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Clonar Código do Repositório
      uses: actions/checkout@v4

    - name: Configurar Ambiente Python (Camada IA)
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
        cache: 'pip'

    - name: Instalar Dependências de IA
      run: |
        python -m pip install --upgrade pip
        pip install pytest

    - name: Executar Testes Unitários de IA (Processamento de Dados)
      run: |
        python src/data/dataset_processor.py

    - name: Configurar Ambiente Node.js (Camada Web3)
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Instalar Dependências Web3
      run: npm ci

    - name: Compilar Smart Contracts e Rodar Testes de Invasão
      run: |
        npm run compile
        npm run test:security
```

## Comandos de Teste

```bash
# Compilar contratos
npm run compile

# Rodar testes de segurança
npm run test:security

# Rodar processamento de dados
npm run ai:process-data

# Rodar teste do oráculo
npm run ai:oracle-test

# Rodar simulação completa
npm run simulate-all
```
