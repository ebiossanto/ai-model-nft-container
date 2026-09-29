# -*- coding: utf-8 -*-
"""
@file enclave_main.py
@notice Lógica de segurança in-memory para descriptografia do dataset usando a chave do Oráculo.
"""

import base64
import os

# Requer a biblioteca pycryptodome (pip install pycryptodome)
from Cryptodome.Cipher import AES


class SecurityError(Exception):
    """Exceção personalizada para erros de segurança no enclave."""
    pass


def decrypt_dataset_in_memory(encrypted_data_path: str, base64_key: str):
    """
    Descriptografa o arquivo do dataset diretamente na memória protegida do enclave.
    Evita vazamento de dados gravando arquivos descriptografados em disco tradicional.
    """
    print("[TEE Enclave] Iniciando leitura do payload criptografado...")

    # Decodifica a chave simétrica vinda do Oráculo
    aes_key = base64.b64decode(base64_key)

    if len(aes_key) != 32:
        raise ValueError("Erro: A chave AES fornecida deve ter exatamente 32 bytes (AES-256).")

    # Lê o arquivo criptografado (O arquivo deve conter: IV, TAG e os DADOS brutos)
    with open(encrypted_data_path, "rb") as f:
        iv = f.read(12)      # Nonce padrão do AES-GCM (12 bytes)
        tag = f.read(16)     # Tag de autenticação gerada no encrypt (16 bytes)
        ciphertext = f.read()  # Dados restantes (conteúdo do dataset)

    print("[TEE Enclave] Inicializando motor criptográfico AES-GCM...")
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=iv)

    try:
        # Descriptografa e valida a integridade matemática ao mesmo tempo
        decrypted_data = cipher.decrypt_and_verify(ciphertext, tag)
        print("[TEE Enclave] Dataset autenticado e descriptografado com sucesso na memória RAM estável.")

        # O retorno é o binário puro do dataset pronto para ser injetado nas funções de treino da IA
        return decrypted_data
    except ValueError:
        raise SecurityError("ATAQUE OU CORRUPÇÃO DETECTADA: A tag de autenticação AES falhou. Chave errada ou dados violados.")


if __name__ == "__main__":
    # Mock para teste rápido de geração/leitura do fluxo
    CHAVE_MOCK_B64 = base64.b64encode(b"super_secret_sandbox_key_32_bytes_").decode('utf-8')
    ARQUIVO_TESTE = "dataset_comercial.enc"

    # Criando um arquivo criptografado falso para simulação local
    print("Criando arquivo simulado criptografado...")
    cipher_enc = AES.new(b"super_secret_sandbox_key_32_bytes_", AES.MODE_GCM)
    dados_brutos = b"tensors_de_treino_secretos_da_ia_2026"
    ct, tg = cipher_enc.encrypt_and_digest(dados_brutos)

    with open(ARQUIVO_TESTE, "wb") as f:
        f.write(cipher_enc.nonce)
        f.write(tg)
        f.write(ct)

    # Executando a descriptografia interna
    try:
        conteudo_limpo = decrypt_dataset_in_memory(ARQUIVO_TESTE, CHAVE_MOCK_B64)
        print(f"Conteúdo pronto para o pipeline de treino: {conteudo_limpo.decode('utf-8')}")
    finally:
        if os.path.exists(ARQUIVO_TESTE):
            os.remove(ARQUIVO_TESTE)
