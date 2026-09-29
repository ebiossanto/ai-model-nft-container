// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AISandboxModelNFT
 * @notice Gerencia a identidade e o ciclo de vida mutável de modelos de IA via dNFTs.
 * @dev ERC-721 expandido para rastreamento mutável de estados de modelos de IA.
 */
contract AISandboxModelNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    /**
     * @notice Estrutura de metadados dinâmicos do modelo de IA
     * @param modelHash IPFS/Arweave hash dos pesos do modelo
     * @param datasetProof Raiz de Merkle provando o dataset de treino
     * @param version Contador de versão incremental
     * @param lastUpdated Timestamp do bloco do último treino
     * @param sandboxId Sandbox autorizada a computar atualizações
     */
    struct ModelMetadata {
        string modelHash;
        string datasetProof;
        uint256 version;
        uint256 lastUpdated;
        address sandboxId;
    }

    /// @notice Mapeamento do Token ID para os metadados dinâmicos
    mapping(uint256 => ModelMetadata) public registry;

    /// @notice Eventos emitidos para auditoria off-chain
    event ModelMinted(uint256 indexed tokenId, address indexed creator, string modelHash);
    event ModelUpdated(uint256 indexed tokenId, string newModelHash, uint256 version, address updater);
    event SandboxAssigned(uint256 indexed tokenId, address indexed sandbox);

    constructor() ERC721("AI Agent Sandbox Container", "AISANDBOX") Ownable(msg.sender) {}

    /**
     * @notice Registra um novo modelo de IA na rede
     * @param researcher Endereço do pesquisador/criador que receberá a posse do dNFT
     * @param initialHash Hash criptográfico inicial dos pesos do modelo
     * @param datasetProof Raiz de Merkle do dataset de treino
     * @param tokenURI URI dos metadados do token (IPFS/Arweave)
     * @return tokenId ID do token recém-criado
     */
    function mintModel(
        address researcher,
        string memory initialHash,
        string memory datasetProof,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(researcher, newItemId);
        _setTokenURI(newItemId, tokenURI);

        registry[newItemId] = ModelMetadata({
            modelHash: initialHash,
            datasetProof: datasetProof,
            version: 1,
            lastUpdated: block.timestamp,
            sandboxId: address(0)
        });

        emit ModelMinted(newItemId, researcher, initialHash);
        return newItemId;
    }

    /**
     * @notice Autoriza um endereço de Sandbox específico a atualizar o estado do modelo
     * @param tokenId ID do token
     * @param sandbox Endereço da Sandbox autorizada
     */
    function assignSandbox(uint256 tokenId, address sandbox) external {
        require(ownerOf(tokenId) == msg.sender || owner() == msg.sender, "Nao autorizado");
        registry[tokenId].sandboxId = sandbox;
        emit SandboxAssigned(tokenId, sandbox);
    }

    /**
     * @notice Atualiza as propriedades do modelo após um ciclo de processamento
     * @dev Restrito apenas ao endereço da Sandbox autorizada associada ao token
     * @param tokenId ID do token
     * @param newModelHash Novo hash dos pesos do modelo
     */
    function updateModelMetrics(
        uint256 tokenId,
        string memory newModelHash
    ) external {
        ModelMetadata storage model = registry[tokenId];
        require(msg.sender == model.sandboxId, "Apenas a Sandbox autorizada pode atualizar");

        model.modelHash = newModelHash;
        model.version += 1;
        model.lastUpdated = block.timestamp;

        emit ModelUpdated(tokenId, newModelHash, model.version, msg.sender);
    }
}
