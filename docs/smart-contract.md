# Smart Contract: AISandboxModelNFT

## Especificação Técnica

O contrato implementa um **dNFT (ERC-721)** expandido para suportar o rastreamento mutável de estados de modelos de IA.

### Estrutura de Dados

```solidity
struct ModelMetadata {
    string modelHash;      // IPFS/Arweave hash dos pesos do modelo
    string datasetProof;   // Raiz de Merkle provando o dataset de treino
    uint256 version;       // Contador de versão incremental
    uint256 lastUpdated;   // Timestamp do bloco do último treino
    address sandboxId;     // Sandbox autorizada a computar atualizações
}
```

### Eventos

| Evento | Parâmetros | Descrição |
|--------|-----------|-----------|
| `ModelMinted` | `tokenId`, `creator`, `modelHash` | Novo modelo registrado |
| `ModelUpdated` | `tokenId`, `newModelHash`, `version`, `updater` | Modelo atualizado pela Sandbox |
| `SandboxAssigned` | `tokenId`, `sandbox` | Sandbox autorizada |

### Funções Principais

#### `mintModel(address researcher, string initialHash, string datasetProof, string tokenURI)`
- **Acesso**: OnlyOwner
- **Retorno**: `uint256` (tokenId)
- Registra um novo modelo de IA na rede

#### `assignSandbox(uint256 tokenId, address sandbox)`
- **Acesso**: Proprietário do token ou Owner do contrato
- Autoriza um endereço de Sandbox a atualizar o estado do modelo

#### `updateModelMetrics(uint256 tokenId, string newModelHash)`
- **Acesso**: Apenas a Sandbox autorizada
- Atualiza as propriedades do modelo após um ciclo de processamento

### Código Completo

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AISandboxModelNFT
 * @notice Gerencia a identidade e o ciclo de vida mutável de modelos de IA via dNFTs.
 */
contract AISandboxModelNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct ModelMetadata {
        string modelHash;      // IPFS/Arweave hash dos pesos do modelo
        string datasetProof;   // Raiz de Merkle provando o dataset de treino
        uint256 version;       // Contador de versão incremental
        uint256 lastUpdated;   // Timestamp do bloco do último treino
        address sandboxId;     // Sandbox autorizada a computar atualizações
    }

    mapping(uint256 => ModelMetadata) public registry;

    event ModelMinted(uint256 indexed tokenId, address indexed creator, string modelHash);
    event ModelUpdated(uint256 indexed tokenId, string newModelHash, uint256 version, address updater);
    event SandboxAssigned(uint256 indexed tokenId, address indexed sandbox);

    constructor() ERC721("AI Agent Sandbox Container", "AISANDBOX") Ownable(msg.sender) {}

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

    function assignSandbox(uint256 tokenId, address sandbox) external {
        require(ownerOf(tokenId) == msg.sender || owner() == msg.sender, "Nao autorizado");
        registry[tokenId].sandboxId = sandbox;
        emit SandboxAssigned(tokenId, sandbox);
    }

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
```

### Segurança

- **Controle de Acesso**: Apenas o owner pode cunhar novos modelos
- **Autorização Granular**: Cada token pode ter sua própria Sandbox autorizada
- **Validação**: Verificação de que apenas a Sandbox autorizada pode atualizar métricas
- **Imutabilidade de Auditoria**: Todos os eventos são emitidos para rastreamento off-chain
