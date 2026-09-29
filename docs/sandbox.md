# Sandbox TEE - Isolamento de Dados Sensíveis

## Visão Geral

Para treinar ou executar inferências em modelos protegidos sem expor dados proprietários ou viés de código, propõe-se um ambiente de execução isolado (**TEE-Based Sandbox**) orquestrado pelo dNFT.

## Arquitetura

```
+-------------------------------------------------+
|          Ambiente Confiável (TEE)               |
|                                                 |
|  [ dNFT ] ---->  |  1. Verificação de Token de Acesso (On-chain)   |
|                   |  2. Descriptografia de Dados em Memória Volátil |
|                   |  3. Execução do Ciclo de Treinamento da IA     |
+-------------------------------------------------+
                          |
                          v
          [ Registro de Logs de Auditoria Não Modificáveis ]
```

## Protocolo de Isolamento e Ciclo de Execução

### 1. Verificação de Token de Acesso
A infraestrutura de nuvem confidencial (ex: *Intel SGX* ou *AMD SEV*) valida a posse do NFT ou de um token ERC-20 associado de uso de tempo antes de abrir o ambiente.

### 2. Descriptografia In-Memory
Os dados sensíveis (carregados criptografado via IPFS) entram na memória volátil do processador protegido isolado. As chaves criptográficas de descriptografia de curta duração são fornecidas por um *Oracle* descentralizado via API web3 confiável somente após a validação do NFT.

### 3. Auditoria em Ledger
Nenhuma informação confidencial sai da sandbox. No final do pipeline, o enclave emite uma prova criptográfica do processamento (*proof-of-execution*) e os novos pesos consolidados do modelo chamam a função `updateModelMetrics` do contrato, encerrando a instância virtual e destruindo os dados sensíveis da memória.

## Componentes

### `enclave_main.py`
Ponto de entrada protegido dentro do TEE. Responsável por:
- Receber a chave do Oráculo
- Descriptografar o dataset em memória
- Executar o pipeline de treinamento
- Retornar os novos pesos do modelo

### `web3_oracle_client.py`
Cliente para escuta de eventos on-chain. Responsável por:
- Verificar propriedade do NFT
- Solicitar chaves de descriptografia ao Oráculo
- Validar assinaturas digitais

## Configuração do Ambiente

### Dockerfiles

| Arquivo | Descrição |
|---------|-----------|
| `Dockerfile.intel-sgx` | Imagem para execução em enclave confidencial Intel SGX |
| `Dockerfile.dev` | Ambiente local de simulação |

### Políticas de Segurança

O arquivo `sandbox-policy.json` define:
- Regras de isolamento de processo
- Permissões do sistema operacional
- Restrições de rede
