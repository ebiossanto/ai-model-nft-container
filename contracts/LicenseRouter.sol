// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title LicenseRouter
 * @notice Distribuidor de royalties automatizado para modelos de IA
 * @dev Reparte receitas entre desenvolvedor original, pool de mantenedores e criadores de derivados
 */
contract LicenseRouter is Ownable {
    /// @notice Taxa base para o pool de mantenedores (15%)
    uint256 public constant MAINTAINER_POOL_BPS = 1500;
    /// @notice Taxa para criadores de modelos derivados (10%)
    uint256 public constant DERIVATIVE_ROYALTY_BPS = 1000;
    /// @notice Base de cálculo (10000 = 100%)
    uint256 public constant BPS_BASE = 10000;

    /// @notice Endereço do pool de mantenedores
    address public maintainerPool;

    /// @notice Mapeamento de token ID para endereço do criador original
    mapping(uint256 => address) public originalCreators;

    /// @notice Mapeamento de token ID para token pai (para derivados)
    mapping(uint256 => uint256) public parentTokens;

    event RoyaltyDistributed(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 creatorAmount,
        uint256 maintainerAmount,
        uint256 derivativeAmount
    );

    event MaintainerPoolUpdated(address indexed newPool);

    constructor(address _maintainerPool) Ownable(msg.sender) {
        require(_maintainerPool != address(0), "Invalid pool address");
        maintainerPool = _maintainerPool;
    }

    /**
     * @notice Registra o criador original de um token
     */
    function registerCreator(uint256 tokenId, address creator) external onlyOwner {
        originalCreators[tokenId] = creator;
    }

    /**
     * @notice Registra um token derivado com seu token pai
     */
    function registerDerivative(uint256 tokenId, uint256 parentTokenId) external onlyOwner {
        parentTokens[tokenId] = parentTokenId;
    }

    /**
     * @notice Distribui royalties automaticamente
     * @param tokenId ID do token que gerou a receita
     * @param revenue Valor total da receita (em wei)
     */
    function distributeRoyalty(uint256 tokenId, uint256 revenue) external onlyOwner {
        address creator = originalCreators[tokenId];
        require(creator != address(0), "Creator not registered");

        // Calcula valores
        uint256 maintainerAmount = (revenue * MAINTAINER_POOL_BPS) / BPS_BASE;
        uint256 creatorAmount = revenue - maintainerAmount;

        // Se for derivado, repassa 10% para o criador do token pai
        uint256 parentTokenId = parentTokens[tokenId];
        uint256 derivativeAmount = 0;
        if (parentTokenId != 0) {
            address parentCreator = originalCreators[parentTokenId];
            if (parentCreator != address(0)) {
                derivativeAmount = (revenue * DERIVATIVE_ROYALTY_BPS) / BPS_BASE;
                creatorAmount -= derivativeAmount;
                (bool success, ) = parentCreator.call{value: derivativeAmount}("");
                require(success, "Derivative transfer failed");
            }
        }

        // Transfere para o criador
        (bool successCreator, ) = creator.call{value: creatorAmount}("");
        require(successCreator, "Creator transfer failed");

        // Transfere para o pool de mantenedores
        (bool successPool, ) = maintainerPool.call{value: maintainerAmount}("");
        require(successPool, "Pool transfer failed");

        emit RoyaltyDistributed(tokenId, creator, creatorAmount, maintainerAmount, derivativeAmount);
    }

    /**
     * @notice Atualiza o endereço do pool de mantenedores
     */
    function setMaintainerPool(address newPool) external onlyOwner {
        require(newPool != address(0), "Invalid pool address");
        maintainerPool = newPool;
        emit MaintainerPoolUpdated(newPool);
    }

    receive() external payable {}
}
