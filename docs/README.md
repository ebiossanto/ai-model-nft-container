# NFTs de Utilidade para Infraestrutura de IA (Model-Tokens)

Framework técnico e operacional para a convergência entre criptografia distribuída e Inteligência Artificial, utilizando **Tokens Não Fungíveis Dinâmicos (dNFTs)** como contêineres de governança, identidade e propriedade intelectual.

## Índice de Documentação

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](architecture.md) | Visão geral da arquitetura do sistema |
| [Smart Contract](smart-contract.md) | Especificação do contrato Solidity |
| [Sandbox TEE](sandbox.md) | Isolamento de dados sensíveis |
| [Licenciamento](licensing.md) | Modelo de licenciamento descentralizado |
| [Estrutura do Repositório](repository-structure.md) | Layout de pastas do projeto |
| [Componentes Críticos](components.md) | Detalhamento dos componentes |
| [Testes e CI](testing.md) | Suíte de testes e integração contínua |
| [Frontend](frontend.md) | Painel Next.js |
| [Início Rápido](getting-started.md) | Guia de configuração |

## Visão Geral

O sistema utiliza dNFTs (ERC-721) expandidos para suportar o rastreamento mutável de estados de modelos de IA. Ele registra criptograficamente a árvore de hashes do modelo (modelHash), a versão atual (version) e a linhagem de dados utilizada no treinamento (datasetProof).

## Referências

- [Scientific Direct - AI & Blockchain](https://www.sciencedirect.com/science/article/pii/S2096720926000618)
- [Creating Smart Contracts in Solidity](https://medium.com/@fasezayt/creating-a-smart-contract-in-solidity-explained-f38f92f17bc5)
- [Solidity Documentation](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html)
- [Comprehensive Guide to Solidity](https://medium.com/@ankitacode11/comprehensive-guide-to-solidity-smart-contract-development-d106d7051b07)
- [Smart Contract for Copyright Transfer via NFT](https://www.researchgate.net/publication/403893827_Development_of_a_Smart_Contract_for_the_Transfer_of_Copyrights_in_an_Artwork_Linked_to_an_NFT)
