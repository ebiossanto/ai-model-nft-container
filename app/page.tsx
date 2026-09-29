'use client';
/**
 * @file page.tsx
 * @notice Painel Next.js para renderização de dNFTs de IA e metadados de governança.
 */
import { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

// ABI resumido contendo apenas o mapeamento do registro técnico para otimizar leitura 
const ABI_RESUMIDO = [
  "function registry(uint256 tokenId) view returns (string modelHash, string datasetProof, uint256 version, uint256 lastUpdated, address sandboxId)"
];
const CONTRACT_ADDRESS = "0xO_ENDERECO_DO_CONTRATO_APOS_O_DEPLOY"; // Substituir pós deploy

interface AIModelToken {
  id: string;
  hash: string;
  proof: string;
  version: string;
  sandbox: string;
}

export default function AIMarketplaceDashboard() {
  const [wallet, setWallet] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<AIModelToken | null>(null);
  const [searchId, setSearchId] = useState<string>('1');

  async function connectAndFetchToken() {
    if (!window.ethereum) {
      alert("Metamask não encontrada! Instale a extensão.");
      return;
    }
    
    try {
      setLoading(true);
      // 1. Conecta a carteira e muda estado visual do botão 
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);

      // 2. Instancia o contrato de leitura off-chain de forma direta 
      const contract = new Contract(CONTRACT_ADDRESS, ABI_RESUMIDO, provider);
        
      // 3. Faz a chamada da função 'registry' mapeada no Solidity 
      console.log(`Buscando dados para o Token ID: ${searchId}`);
      const data = await contract.registry(BigInt(searchId));
        
      setTokenData({
        id: searchId,
        hash: data.modelHash || "Não inicializado",
        proof: data.datasetProof,
        version: data.version.toString(),
        sandbox: data.sandboxId
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar dados da Blockchain. Verifique o ID e o endereço do contrato.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center border-b border-slate-800 pb-6 mb-12">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
          AI Model-Token Explorer
        </h1>
        <button 
          onClick={connectAndFetchToken}
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg font-medium transition-all text-sm"
        >
          {wallet ? `${wallet.substring(0,6)}...${wallet.substring(38)}` : "Conectar Carteira Web3"}
        </button>
      </header>

      <section className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-cyan-400">Consultar Licença de IA</h2>
        <div className="flex gap-3 mb-6">
          <input 
            type="number" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Token ID"
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 w-full text-slate-200 focus:outline-none focus:border-cyan-400"
          />
          <button 
            onClick={connectAndFetchToken}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2 rounded-lg transition-all text-sm whitespace-nowrap"
          >
            {loading ? "Buscando..." : "Consultar"}
          </button>
        </div>

        {tokenData && (
          <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800 text-sm">
            <div>
              <span className="text-slate-500 block text-xs uppercase font-mono">Token Identificador (dNFT)</span>
              <span className="text-base font-bold text-violet-400">ID #{tokenData.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-mono">Versão Computacional Ativa</span>
              <span className="bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-bold">v{tokenData.version}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-mono">IPFS Hash dos Pesos (modelHash)</span>
              <p className="font-mono text-xs break-all text-slate-300 bg-slate-900 p-2 rounded mt-1 border border-slate-800">{tokenData.hash}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-mono">Raiz de Merkle do Dataset (Linhagem)</span>
              <p className="font-mono text-xs break-all text-slate-300 bg-slate-900 p-2 rounded mt-1 border border-slate-800">{tokenData.proof}</p>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-mono">Sandbox Autorizada (TEE Address)</span>
              <p className="font-mono text-xs break-all text-slate-300 bg-slate-900 p-2 rounded mt-1 border border-slate-800">{tokenData.sandbox}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
