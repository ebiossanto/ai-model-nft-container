// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ILicenseManager
 * @notice Interface de regras de compliance de licença para modelos de IA
 */
interface ILicenseManager {
    /// @notice Tipos de licença disponíveis
    enum LicenseType {
        ACADEMIC,       // Uso acadêmico/não comercial
        COMMERCIAL,     // Uso comercial
        DERIVATIVE      // Modelos derivados/forks
    }

    /// @notice Verifica se um endereço possui licença válida para uso comercial
    function hasCommercialLicense(address user, uint256 tokenId) external view returns (bool);

    /// @notice Verifica se um endereço possui licença acadêmica
    function hasAcademicLicense(address user, uint256 tokenId) external view returns (bool);

    /// @notice Registra um novo licenciamento
    function grantLicense(address user, uint256 tokenId, LicenseType licenseType) external;

    /// @notice Revoga um licenciamento
    function revokeLicense(address user, uint256 tokenId) external;

    /// @notice Calcula royalties devidos para um modelo derivado
    function calculateRoyalty(uint256 parentTokenId, uint256 revenue) external view returns (uint256);
}
