# Detalhamento dos Componentes Críticos

## 1. LICENSE-WEB3.md

Este arquivo substitui ou complementa as licenças tradicionais (como MIT ou Apache 2.0). Ele estabelece juridicamente e tecnicamente que:

- O uso comercial do código contido em `/src` é condicionado à validação de posse do token emitido pelo contrato em `/contracts`.
- Modificações ou *forks* deste repositório devem herdar o ID do NFT pai (parentId) na função de minting.

## 2. /sandbox (Camada Confiável)

Responsável por garantir que os dados sensíveis de terceiros nunca vazem. O arquivo `enclave_main.py` roda estritamente dentro da memória criptografada do processador (especificado no `Dockerfile.intel-sgx`), baixa os dados criptografados, processa o treino chamando o `/src/training/train.py` e se comunica de volta com a blockchain usando o `web3_oracle_client.py` para atualizar os metadados do dNFT.

## 3. /src/data/dataset_processor.py

Antes do modelo começar a treinar, este utilitário processa os arquivos de entrada (ex: CSVs, imagens) e gera uma árvore criptográfica (**Merkle Tree**). A raiz dessa árvore (datasetProof) é imutável e serve para provar publicamente quais dados exatos alimentaram a IA, resolvendo disputas legais de direitos autorais sem revelar os dados brutos.

## 4. scripts/mint-model-token.js

Script de automação que utiliza **ethers.js (v6)** para:
- Conectar à rede blockchain
- Interagir com o smart contract
- Calcular dinamicamente os hashes necessários
- Simular o upload de metadados
- Executar a transação on-chain de minting

## 5. scripts/deploy-contracts.js

Script que realiza a publicação do smart contract na Testnet configurada (ex: Sepolia, Base, Arbitrum) utilizando **ethers.js v6** dentro do ecossistema Hardhat.

## 6. sandbox/src/enclave_main.py

Script que roda dentro do ambiente isolado (TEE). Recebe a chave codificada em Base64 retornada pelo Oráculo e descriptografa o dataset usando **AES-256-GCM**.

## 7. sandbox/src/web3_oracle_client.py

Implementação em Python para o ambiente Sandbox que simula o comportamento de uma chamada ao **Chainlink Functions**. O código intercepta eventos on-chain, valida assinaturas digitais com nós descentralizados e libera a chave criptográfica necessária para descriptografar o dataset apenas se o NFT de acesso for legítimo.

## 8. app/page.tsx

Componente React moderno escrito para o **Next.js** utilizando Tailwind CSS. Conecta à carteira do usuário (Metamask/Web3) usando **ethers.js v6**, lê a blockchain e exibe os Model-Tokens de IA ativos no marketplace.
