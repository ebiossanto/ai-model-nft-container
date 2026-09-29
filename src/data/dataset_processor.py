# -*- coding: utf-8 -*-
"""
@file dataset_processor.py
@notice Calcula a Raiz de Merkle real a partir de arquivos em um diretório local.
"""

import os
import hashlib
import glob


def calculate_sha256(file_path):
    """Calcula o hash SHA-256 de um arquivo individual em modo binário."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        # Lê em blocos para não estourar a memória com datasets gigantes
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def compute_merkle_root(file_hashes):
    """Calcula a Raiz de Merkle a partir de uma lista de hashes ordens (folhas)."""
    if not file_hashes:
        return "0x0"

    # Converte os hashes hexadecimais puros para strings ordenadas para garantir determinismo
    current_level = sorted(file_hashes)

    while len(current_level) > 1:
        next_level = []
        # Se o número de elementos for ímpar, duplica o último elemento da lista
        if len(current_level) % 2 != 0:
            current_level.append(current_level[-1])

        for i in range(0, len(current_level), 2):
            # Concatena os dois hashes filhos correspondentes
            combined = current_level[i] + current_level[i + 1]
            combined_hash = hashlib.sha256(combined.encode('utf-8')).hexdigest()
            next_level.append(combined_hash)

        current_level = next_level

    # Retorna formatado como um hash hexadecimal padrão EVM (0x...)
    return f"0x{current_level[0]}"


def process_dataset_directory(directory_path):
    """Processa todos os arquivos de um diretório e gera a prova criptográfica."""
    print(f"Escaneando o diretório de dados: {directory_path}")

    # Pega todos os arquivos de forma recursiva ignorando pastas vazias
    search_pattern = os.path.join(directory_path, "**", "*")
    all_files = [f for f in glob.glob(search_pattern, recursive=True) if os.path.isfile(f)]

    if not all_files:
        raise ValueError(f"Erro: Nenhum arquivo encontrado no caminho especificado: {directory_path}")

    print(f"Encontrados {len(all_files)} arquivos para indexação.")

    file_hashes = []
    for file_path in all_files:
        f_hash = calculate_sha256(file_path)
        file_hashes.append(f_hash)

    merkle_root = compute_merkle_root(file_hashes)
    return merkle_root


if __name__ == "__main__":
    # Caminho de simulação local baseado na estrutura sugerida
    DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data_sample"))

    # Criar uma pasta e arquivos de teste caso não existam
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
        with open(os.path.join(DATASET_DIR, "train_inputs.bin"), "w") as f:
            f.write("input_data_tensor_xyz")
        with open(os.path.join(DATASET_DIR, "train_labels.bin"), "w") as f:
            f.write("label_data_tensor_123")

    try:
        proof_root = process_dataset_directory(DATASET_DIR)
        print("\nProva criptográfica gerada com sucesso!")
        print(f"Dataset Merkle Root (datasetProof): {proof_root}")
        print("Copie este valor hexadecimal e insira no seu script mint-model-token.js.")
    except Exception as e:
        print(f"Falha no processamento: {str(e)}")
