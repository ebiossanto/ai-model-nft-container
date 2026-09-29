# Estrutura de Pastas do Repositório

## Layout Projetado

```
ai-model-nft-container/
├── .github/
│   └── workflows/
│       ├── ai-pipeline-ci.yml       # CI para validação de integridade do modelo
│       └── web3-deployment.yml      # CI para deploy e verificação de contratos
├── contracts/                        # Camada Blockchain (Web3)
│   ├── AISandboxModelNFT.sol        # Smart contract principal do dNFT
│   ├── ILicenseManager.sol          # Interface de regras de compliance de licença
│   └── LicenseRouter.sol            # Distribuidor de royalties automatizado
├── sandbox/                          # Infraestrutura de Execução Isolada (TEE)
│   ├── docker/
│   │   ├── Dockerfile.intel-sgx     # Imagem para execução em enclave confidencial
│   │   └── Dockerfile.dev           # Ambiente local de simulação
│   ├── src/
│   │   ├── enclave_main.py          # Ponto de entrada protegido dentro do TEE
│   │   └── web3_oracle_client.py    # Cliente para escuta de eventos on-chain
│   └── config/
│       └── sandbox-policy.json      # Regras de isolamento e permissões do SO
├── src/                              # Código de Inteligência Artificial (Core)
│   ├── data/
│   │   └── dataset_processor.py     # Script que gera a Raiz de Merkle do dataset
│   ├── models/
│   │   ├── architecture.py          # Definição dos pesos e camadas da IA
│   │   └── weights_hash.py          # Utilitário para gerar o IPFS/Arweave Hash do modelo
│   ├── training/
│   │   └── train.py                 # Script de treinamento adaptado para registrar logs
│   └── main.py                      # Execução e inferência do agente de IA
├── tests/                            # Suíte de Testes Unitários e Integração
│   ├── blockchain/                  # Testes dos smart contracts (Hardhat/Foundry)
│   │   └── nft_behavior.test.js
│   └── ai_core/                     # Testes de regressão do modelo e enclaves
│       └── sandbox_isolation.test.py
├── scripts/                          # Scripts de automação e utilitários
│   ├── deploy-contracts.js          # Script de deploy na mainnet/testnet
│   └── mint-model-token.js          # Script para registrar um novo modelo como dNFT
├── .env.example                     # Modelo de variáveis de ambiente (Chaves API, RPC)
├── .gitignore                       # Bloqueio de pesos pesados (.bin/.pt) e chaves privadas
├── LICENSE-WEB3.md                  # Termos contratuais do modelo de licença descentralizada
├── README.md                        # Documentação de onboarding e arquitetura
└── package.json                     # Dependências do ecossistema Web3 e scripts NPM
```

## Descrição dos Diretórios

| Diretório | Descrição |
|-----------|-----------|
| `.github/workflows/` | Configurações de CI/CD do GitHub Actions |
| `contracts/` | Contratos inteligentes Solidity |
| `sandbox/` | Infraestrutura de execução isolada TEE |
| `src/` | Código-fonte do modelo de IA |
| `tests/` | Testes unitários e de integração |
| `scripts/` | Scripts de automação e deploy |
