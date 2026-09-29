# AI Model NFT Container

Framework para governança e licenciamento descentralizado de modelos de IA utilizando dNFTs (Tokens Não Fungíveis Dinâmicos).

## Visão Geral

Este projeto estabelece o framework técnico e operacional para a convergência entre criptografia distribuída e Inteligência Artificial, utilizando dNFTs como contêineres de governança, identidade e propriedade intelectual.

## Arquitetura

O sistema é composto por quatro camadas principais:

1. **Frontend (Next.js)**: Painel de visualização de dNFTs
2. **Blockchain (Web3)**: Contratos inteligentes Solidity
3. **Sandbox TEE**: Execução isolada de dados sensíveis
4. **IA (Core)**: Código do modelo de Inteligência Artificial

## Início Rápido

### Pré-requisitos

- Node.js 20+
- Python 3.11+
- MetaMask (para interações Web3)

### Instalação

```bash
# Instalar dependências Node.js
npm install

# Instalar dependências Python
pip install pycryptodome pytest
```

### Configuração

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`

### Compilação e Testes

```bash
# Compilar contratos
npm run compile

# Rodar testes de segurança
npm run test:security

# Processar dataset
npm run ai:process-data

# Simulação completa
npm run simulate-all
```

## Estrutura do Repositório

```
├── contracts/          # Contratos inteligentes Solidity
├── scripts/            # Scripts de automação e deploy
├── src/                # Código-fonte do modelo de IA
│   ├── data/           # Processamento de datasets
│   ├── models/         # Definição dos modelos
│   ├── training/       # Scripts de treinamento
│   └── sandbox/        # Infraestrutura TEE
├── tests/              # Testes unitários e integração
├── app/                # Frontend Next.js
└── docs/               # Documentação detalhada
```

## Documentação

Consulte a pasta [`docs/`](docs/) para documentação detalhada:

- [Arquitetura](docs/architecture.md)
- [Smart Contract](docs/smart-contract.md)
- [Sandbox TEE](docs/sandbox.md)
- [Licenciamento](docs/licensing.md)
- [Testes](docs/testing.md)
- [Início Rápido](docs/getting-started.md)

## Citação

Se você usar este software em sua pesquisa, por favor cite:

```bibtex
@software{ai_model_nft_container,
  author = {Soares, Euzébio},
  title = {AI Model NFT Container: Framework para Governança e Licenciamento Descentralizado de Modelos de IA utilizando dNFTs},
  year = {2026},
  version = {1.0.0},
  url = {https://github.com/seu-usuario/ai-model-nft-container},
  license = {LPI-W3}
}
```

Consulte [`docs/references.md`](docs/references.md) para todas as referências bibliográficas.

## Licença

Este projeto está licenciado sob os termos da Licença de Propriedade Intelectual Descentralizada Web3 (LPI-W3). Consulte [`LICENSE-WEB3.md`](LICENSE-WEB3.md) para mais detalhes.

## Aviso

Use o código com cuidado. Revise cada código antes de usá-lo.
