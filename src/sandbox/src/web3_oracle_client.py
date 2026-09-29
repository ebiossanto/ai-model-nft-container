# -*- coding: utf-8 -*-
"""
@file web3_oracle_client.py
@notice Cliente para simular validações descentralizadas via Oráculos (ex: Chainlink Functions).
"""

import json
import base64


class ChainlinkFunctionsOracle:
    def __init__(self, oracle_node_url: str):
        self.oracle_node_url = oracle_node_url
        print(f"Conectado ao nó de Oráculo descentralizado em: {self.oracle_node_url}")

    def verify_nft_access_request(self, token_id: int, user_wallet: str) -> bool:
        """
        Simula a execução off-chain efetuada por nós da Chainlink consultando a blockchain.
        Verifica se a carteira fornecida realmente detém o NFT correspondente à licença.
        """
        print(f"[Oracle] Auditando propriedade do Token ID: {token_id} para a carteira: {user_wallet}")
        # Em ambiente de produção, executaria uma chamada de leitura 'ownerOf(tokenId)' via RPC criptografada
        if user_wallet.startswith("0x") and len(user_wallet) == 42:
            return True
        return False

    def request_dataset_decryption_key(self, token_id: int, enc_metadata_proof: str, user_wallet: str) -> str:
        """
        Executa o processamento em consenso e injeta a chave simétrica no enclave da Sandbox.
        """
        # 1. Valida se o requisitante tem direito de acesso
        is_valid = self.verify_nft_access_request(token_id, user_wallet)

        if not is_valid:
            raise PermissionError("[Oracle Exception] Acesso negado. Assinatura NFT inválida ou expirada.")

        print("[Oracle Consensus] Consenso atingido por 4/4 nós validadores.")
        print("[Oracle] Descriptografando segredo via rede de computação confidencial...")

        # Chave simétrica fictícia em AES-GCM (retornada apenas em memória volátil dentro da Sandbox/TEE)
        mock_aes_key = base64.b64encode(b"super_secret_sandbox_key_32_bytes_").decode('utf-8')
        return mock_aes_key


if __name__ == "__main__":
    # Teste de comportamento do Oracle rodando internamente na Sandbox
    oracle = ChainlinkFunctionsOracle("https://functions.network")

    try:
        # Simulando uma requisição de validação bem-sucedida
        wallet_exemplo = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
        key = oracle.request_dataset_decryption_key(
            token_id=1,
            enc_metadata_proof="0x74657374...",
            user_wallet=wallet_exemplo
        )
        print(f"Chave de descriptografia injetada com sucesso no Enclave TEE: {key}")
    except Exception as e:
        print(f"Falha de validação pelo Oráculo: {e}")
