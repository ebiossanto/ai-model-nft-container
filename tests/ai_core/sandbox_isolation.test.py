# -*- coding: utf-8 -*-
"""
@file sandbox_isolation.test.py
@notice Testes de regressão do modelo e enclaves
"""

import pytest
import base64
import os
import sys

# Adicionar caminho do src ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'sandbox', 'src'))

from enclave_main import decrypt_dataset_in_memory, SecurityError


class TestSandboxIsolation:
    """Testes de isolamento e segurança do enclave."""

    def setup_method(self):
        """Configuração inicial para cada teste."""
        self.test_key = b"super_secret_sandbox_key_32_bytes_"
        self.test_key_b64 = base64.b64encode(self.test_key).decode('utf-8')
        self.test_data = b"dados_sensiveis_de_treinamento_da_ia"
        self.test_file = "test_dataset.enc"

    def teardown_method(self):
        """Limpeza após cada teste."""
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def _create_encrypted_file(self, data: bytes):
        """Cria um arquivo criptografado para teste."""
        from Cryptodome.Cipher import AES
        cipher = AES.new(self.test_key, AES.MODE_GCM)
        ct, tag = cipher.encrypt_and_digest(data)

        with open(self.test_file, "wb") as f:
            f.write(cipher.nonce)
            f.write(tag)
            f.write(ct)

    def test_decrypt_valid_data(self):
        """Testa descriptografia de dados válidos."""
        self._create_encrypted_file(self.test_data)
        result = decrypt_dataset_in_memory(self.test_file, self.test_key_b64)
        assert result == self.test_data

    def test_decrypt_invalid_key(self):
        """Testa se chave inválida é rejeitada."""
        self._create_encrypted_file(self.test_data)
        wrong_key = base64.b64encode(b"wrong_key_32_bytes_here_1234567890").decode('utf-8')

        with pytest.raises(SecurityError):
            decrypt_dataset_in_memory(self.test_file, wrong_key)

    def test_decrypt_corrupted_data(self):
        """Testa se dados corrompidos são detectados."""
        self._create_encrypted_file(self.test_data)

        # Corrompe o arquivo
        with open(self.test_file, "r+b") as f:
            f.seek(20)  # Pula IV (12 bytes) + parte do tag
            f.write(b"\x00\x00\x00\x00")

        with pytest.raises(SecurityError):
            decrypt_dataset_in_memory(self.test_file, self.test_key_b64)

    def test_key_length_validation(self):
        """Testa validação do tamanho da chave."""
        short_key = base64.b64encode(b"short_key").decode('utf-8')

        with pytest.raises(ValueError, match="32 bytes"):
            decrypt_dataset_in_memory(self.test_file, short_key)
