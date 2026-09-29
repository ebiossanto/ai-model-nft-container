# Início Rápido

## Pré-requisitos

- Node.js 20+
- Python 3.11+
- npm ou yarn
- MetaMask (para interações Web3)

## Configuração do Ambiente

### 1. Instalar Dependências

```bash
npm install ethers dotenv
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
RPC_URL="https://infura.io"
PRIVATE_KEY="SUA_CHAVE_PRIVADA_DA_CARTEIRA_WEB3"
CONTRACT_ADDRESS="0xO_ENDERECO_DO_CONTRATO_APOS_O_DEPLOY"
```

### 3. Compilar Contratos

```bash
npm run compile
```

### 4. Deploy do Contrato

```bash
npm run blockchain:deploy
```

### 5. Cunhar um Modelo de IA

```bash
npm run blockchain:mint
```

## Simulação Completa

Para ver todo o ecossistema funcionando de forma integrada:

```bash
npm run simulate-all
```

### O que este comando faz sequencialmente:

1. Roda a rotina **Python** para escanear a pasta de arquivos locais e gerar a Raiz de Merkle do dataset.
2. Compila os arquivos de lógica em **Solidity**.
3. Inicia um ambiente blockchain efêmero na memória e roda os testes de segurança simulando e repelindo o **ataque do hacker**.
4. Executa a validação distribuída do **Oráculo** simulando a liberação de chaves criptográficas para o treinamento confidencial.

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run compile` | Compila os smart contracts |
| `npm run test:security` | Executa testes de segurança |
| `npm run ai:process-data` | Processa dataset e gera Merkle Root |
| `npm run ai:oracle-test` | Testa o cliente do Oráculo |
| `npm run blockchain:node` | Inicia nó local Hardhat |
| `npm run blockchain:deploy` | Faz deploy do contrato |
| `npm run blockchain:mint` | Cunha um novo modelo de IA |
| `npm run simulate-all` | Executa simulação completa |

## Próximos Passos

- Desenvolver o arquivo `dataset_processor.py` para calcular a Raiz de Merkle real
- Criar as regras jurídicas e técnicas em `LICENSE-WEB3.md`
- Escrever testes automatizados `nft_behavior.test.js`
- Configurar GitHub Actions para CI/CD
- Integrar provedor de chaves do Oráculo (Chainlink Functions)
