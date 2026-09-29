# Arquitetura do Sistema

## Visão Geral

O sistema é composto por quatro camadas principais:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│              Painel de Visualização de dNFTs                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Camada Blockchain (Web3)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ AISandboxModelNFT│  │ ILicenseManager │  │LicenseRouter│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Camada de Execução (Sandbox TEE)                │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  enclave_main.py │  │web3_oracle_client│                  │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Camada de IA (Core)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │dataset_processor │  │   train.py      │  │  main.py    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

1. **Registro**: O pesquisador cunha um dNFT via `mintModel()`
2. **Autorização**: Uma Sandbox TEE é autorizada via `assignSandbox()`
3. **Treinamento**: A Sandbox processa dados dentro do enclave seguro
4. **Atualização**: Os novos pesos são registrados via `updateModelMetrics()`
5. **Auditoria**: Eventos on-chain permitem rastreamento completo

## Decisões de Design

- **ERC-721 com URI Storage**: Permite metadados dinâmicos atualizáveis
- **Merkle Tree para Datasets**: Prova de integridade sem revelar dados brutos
- **TEE (Intel SGX/AMD SEV)**: Execução isolada de dados sensíveis
- **Oráculos Descentralizados**: Validação de acesso e distribuição de chaves
