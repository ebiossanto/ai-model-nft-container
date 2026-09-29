// SPDX-License-Identifier: MIT
/**
 * @file mint-model-token.js
 * @notice Script de automação para registrar e cunhar um modelo de IA como dNFT na rede
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configurações do ambiente tiradas do arquivo .env
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Caminho para o ABI gerado na compilação do contrato
const CONTRACT_ABI_PATH = path.join(__dirname, "../artifacts/contracts/AISandboxModelNFT.sol/AISandboxModelNFT.json");

/**
 * Função simulada para representar o upload de metadados para uma rede descentralizada (IPFS/Arweave)
 * Em produção, substituir por integração real com Pinata, Web3.Storage ou Arweave
 */
async function uploadToDecentralizedStorage(metadata) {
    console.log("Fazendo upload dos metadados para o IPFS/Arweave...");
    // Em produção, aqui entraria a integração com SDKs do Pinata, Web3.Storage ou Arweave
    // Retorna um hash fictício de exemplo
    return "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
}

async function main() {
    // 1. Validações iniciais das variáveis de ambiente
    if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
        throw new Error("Erro: Certifique-se de configurar RPC_URL, PRIVATE_KEY e CONTRACT_ADDRESS no seu arquivo .env");
    }

    // 2. Inicialização dos provedores Web3 (Ethers v6)
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log(`Conectado à rede através do RPC. Carteira do Pesquisador: ${wallet.address}`);

    // 3. Carregamento do ABI do Smart Contract
    if (!fs.existsSync(CONTRACT_ABI_PATH)) {
        throw new Error("Erro: ABI do contrato não encontrado. Execute a compilação primeiro (npx hardhat compile).");
    }
    const contractArtifact = JSON.parse(fs.readFileSync(CONTRACT_ABI_PATH, "utf8"));
    const abi = contractArtifact.abi ? contractArtifact.abi : contractArtifact;

    // Instancia o contrato conectado à carteira do proprietário/pesquisador
    const aiNftContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    // 4. Definição dos parâmetros específicos do Modelo de IA que será cunhado
    console.log("\nPreparando dados do modelo de IA...");

    // Hash criptográfico exclusivo que identifica os pesos compilados do modelo
    const modelHash = "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

    // Raiz de Merkle que prova matematicamente a integridade e origem do Dataset de treino
    const datasetProof = "0x746573745f6d65726b6c655f726f6f745f646174617365745f70726f6f663031";

    // Estrutura de metadados humanos e técnicos que ficarão visíveis em marketplaces de NFT
    const nftMetadata = {
        name: "NeuralAgent-v1-LLM",
        description: "Modelo generativo otimizado para execução em Sandbox TEE com governança em Blockchain.",
        image: "ipfs://QmZ4t4Ym5vPBN9C87JzEnyR7A7eW4EdfghjklpoiuY6t5R",
        attributes: [
            { trait_type: "Model Type", value: "Transformer" },
            { trait_type: "Parameters", value: "7B" },
            { trait_type: "Licensing", value: "Decentralized-OpenSource-v1" }
        ],
        properties: {
            initialModelHash: modelHash,
            datasetMerkleRoot: datasetProof
        }
    };

    // Faz o upload dos metadados e obtém a URI do Token
    const tokenURI = await uploadToDecentralizedStorage(nftMetadata);

    // 5. Execução da transação de Minting na Blockchain
    console.log(`\nEnviando transação para cunhar o dNFT...`);

    try {
        const tx = await aiNftContract.mintModel(
            wallet.address,
            modelHash,
            datasetProof,
            tokenURI
        );

        console.log(`Transação enviada! Hash da transação: ${tx.hash}`);
        console.log("Aguardando confirmação do bloco na rede...");

        const receipt = await tx.wait();

        // No Ethers v6, os logs contêm os eventos decodificados diretamente no recibo
        const modelMintedEvent = receipt.logs
            .map((log) => {
                try { return aiNftContract.interface.parseLog(log); } catch (e) { return null; }
            })
            .find((event) => event && event.name === "ModelMinted");

        if (modelMintedEvent) {
            const tokenId = modelMintedEvent.args.tokenId.toString();
            console.log(`\nSucesso! NFT de IA Cunhado com êxito!`);
            console.log(`ID do Token (NFT): ${tokenId}`);
            console.log(`Proprietário legítimo: ${wallet.address}`);
            console.log(`URI dos metadados: ${tokenURI}`);
        } else {
            console.log("\nTransação confirmada, mas não foi possível ler o evento ID do Token automaticamente.");
        }

    } catch (error) {
        console.error("\nFalha catastrófica ao executar o processo de Minting:");
        console.error(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
