# Nexus CRM - Gestão Comercial Inteligente

Nexus CRM é um sistema moderno de Customer Relationship Management projetado para rodar localmente no seu computador. Ele oferece gerenciamento completo de funil de vendas, cadastro de contatos/leads, controle de tarefas e gráficos dinâmicos de faturamento e distribuição de pipeline.

## Tecnologias Utilizadas
- **Core**: HTML5, Vanilla JavaScript, CSS3 Avançado (Tema Escuro, Efeitos Glassmorphism e Responsividade).
- **Ícones**: Lucide Icons.
- **Gráficos**: Chart.js.
- **Servidor Local**: Vite (para recarga rápida em tempo real e desenvolvimento local).

---

## Como Executar Localmente

Siga o passo a passo abaixo para inicializar e rodar o projeto localmente no seu navegador:

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### Execução em 2 Passos

1. **Instalar Dependências**
   Abra o seu terminal na pasta do projeto e execute:
   ```bash
   npm install
   ```

2. **Iniciar o Servidor de Desenvolvimento**
   Execute o seguinte comando para iniciar o servidor local com o Vite:
   ```bash
   npm run dev
   ```

3. **Visualizar o Aplicativo**
   Após rodar o comando acima, o Vite disponibilizará um link local (geralmente `http://localhost:5173`). Abra esse endereço no seu navegador de preferência.

---

## Funcionalidades Prontas para Uso

- **Tema Claro / Escuro**: Alterne facilmente as cores da interface clicando no botão no canto inferior esquerdo do menu lateral.
- **Persistência de Dados**: O CRM utiliza o `localStorage` do seu navegador. Todas as alterações, novos contatos e tarefas adicionadas continuarão salvas mesmo se você recarregar a página ou reabrir o navegador.
- **Quadro Kanban Interativo**: Você pode gerenciar seu pipeline arrastando os cards de vendas de uma coluna para outra. O valor total do pipeline e as métricas do Dashboard se atualizarão automaticamente em tempo real.
- **Histórico e Linha do Tempo**: Entre nos detalhes de qualquer cliente para ver a linha do tempo ou registrar novas ligações, e-mails, reuniões e notas.
- **Filtros e Busca Global**: Encontre rapidamente qualquer lead, empresa ou tarefa digitando no campo de pesquisa superior ou filtrando por estágio específico.
