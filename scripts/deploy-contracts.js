// SPDX-License-Identifier: MIT
/**
 * @file deploy-contracts.js
 * @notice Realiza o deploy e verificação inicial do contrato AISandboxModelNFT
 */

const { ethers } = require("hardhat");

async function main() {
    console.log("Iniciando o deploy do contrato de governança de IA...");

    // 1. Obtém a conta que assinará o deploy
    const [deployer] = await ethers.getSigners();
    console.log(`Carteira responsável pelo deploy: ${deployer.address}`);

    // Mostra o saldo atual para garantir que há fundos para o Gas fee
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log(`Saldo disponível: ${ethers.formatEther(balance)} ETH`);

    // 2. Obtém a factory do contrato Solidity compilado
    const AISandboxModelNFTFactory = await ethers.getContractFactory("AISandboxModelNFT");

    console.log("Enviando transação de criação do contrato para a rede...");
    const contract = await AISandboxModelNFTFactory.deploy();

    // 3. Aguarda a confirmação de blocos na Testnet
    console.log("Aguardando a transação ser minerada e propagada...");
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log("\nCONTRATO DEPLOYADO COM SUCESSO!");
    console.log(`Endereço do Contrato: ${contractAddress}`);
    console.log(`Hash da Transação: ${contract.deploymentTransaction().hash}`);
    console.log("\nAtualize o seu arquivo .env com o novo CONTRACT_ADDRESS.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Erro durante o deploy:", error);
        process.exit(1);
    });
