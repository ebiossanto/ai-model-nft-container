// SPDX-License-Identifier: MIT
/**
 * @file nft_behavior.test.js
 * @notice Teste unitário e de invasão para o smart contract AISandboxModelNFT
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
