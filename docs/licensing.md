# Modelo de Licenciamento Descentralizado

## Visão Geral

Para que desenvolvedores distribuam algoritmos abertos sem perder os direitos de monetização, o dNFT opera em conjunto com termos contratuais digitais padronizados anexados aos metadados do token.

## Matriz de Permissões de Uso do Modelo

| Modalidade de Licença | Mecanismo de Validação | Repartição de Royalties |
|-----------------------|------------------------|-------------------------|
| **Uso Acadêmico / Livre** | Checagem pública de carteira sem taxas comerciais | N/A (Uso não comercial monitorado por assinaturas estáticas) |
| **Uso em Produção Comercial** | Assinatura recorrente ou compra de NFT corporativo secundário | **85%** desenvolvedor original / **15%** pool de mantenedores e validadores |
| **Derivados e Forks** | Acoplamento obrigatório do dNFT original como "pai" no novo mint | **10%** do faturamento do novo modelo derivado é roteado para o criador do modelo original |

## Fluxo de Royalties Automatizado

Ao fazer a integração do algoritmo em aplicações corporativas ou de nuvem distribuída, o software cliente requisita uma assinatura digital gerada pelo dNFT. Se a chamada comercial faturar microtransações (via APIs integradas à Web3), o roteador liquida automaticamente as porcentagens devidas para o ecossistema Open Source em tempo de execução, erradicando a necessidade de auditorias legais tradicionais centralizadas complexas.

## Licença LPI-W3 (Licença de Propriedade Intelectual Descentralizada Web3)

### 1. Escopo e Vínculo On-Chain

Este software, pesos computacionais associados ("Model Weights"), e dados de arquitetura de Inteligência Artificial contidos neste repositório são licenciados e protegidos estritamente sob as regras deste documento.

A outorga de direitos autorais e operacionais está intrinsecamente vinculada à posse, validação e estado do dNFT (Token Não Fungível Dinâmico) emitido pelo Smart Contract oficial do projeto:

- **Contrato de Referência**: `AISandboxModelNFT`
- **Mecanismo de Validação**: Assinatura criptográfica gerada pela chave privada detentora do ID do Token correspondente à versão do modelo executado

### 2. Direitos e Permissões de Uso

#### 2.1 Uso Acadêmico, de Pesquisa e Não Comercial
É permitida a cópia, modificação e execução local das rotinas deste modelo para fins exclusivamente educacionais e não lucrativos, independente da posse de tokens pagos, desde que mantidos os créditos originais de linhagem de dados mapeados pelo hash imutável `datasetProof`.

#### 2.2 Uso em Produção e Fins Comerciais
Qualquer execução comercial de inferência, fine-tuning corporativo, ou disponibilização deste algoritmo como serviço (AIaaS) requer que o agente de execução possua um token de acesso válido ou execute em uma Sandbox (TEE) cujas transações de liquidação financeira estejam ativas de acordo com o Smart Contract de licenciamento.

### 3. Modificações, Forks e Modelos Derivados

Se você criar um modelo derivado ("Fork"), aplicar transfer learning, ou alterar os pesos computacionais (`modelHash`) deste repositório, você concorda obrigatoriamente em:

1. Executar a função de cunhagem registrando o ID do Token deste repositório original como parâmetro ancestral ("Parent Token").
2. Encaminhar de forma perpétua, automatizada via código em rede blockchain, **10% (dez por cento)** de todas as taxas, microtransações ou royalties comerciais auferidos pela sua aplicação derivada para o endereço da carteira digital contida no contrato criador original.

### 4. Violações e Sanções Técnicas

A quebra de conformidade desta licença ou a tentativa de executar os algoritmos burlando a autenticação das Sandboxes homologadas resultará na invalidação automática e imediata do direito de uso comercial do código, autorizando a rede de oráculos parceiros a cessar o provisionamento de chaves de descriptografia do dataset.
