# 🚀 Guia Rápido de Início

## Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# O arquivo .env.local já existe com USE_MOCK_DATA=true
# Para usar a API real, altere para false e adicione sua API Key

# 3. Adicionar som (opcional)
# Baixe um arquivo cash-register.mp3 e coloque em /public/sounds/
# O sistema funciona sem o som, mas é mais divertido com ele! 🎵

# 4. Executar
npm run dev
```

## 📝 Configuração da API

### Modo Mock (Desenvolvimento)
```env
USE_MOCK_DATA=true
```
- Usa dados simulados
- Não requer API Key
- Perfeito para desenvolvimento e testes

### Modo Produção
```env
USE_MOCK_DATA=false
NEXT_PUBLIC_IMOVIEW_API_KEY=sua_chave_aqui
NEXT_PUBLIC_IMOVIEW_BASE_URL=https://api.imoview.com.br/
```

## 🎯 Funcionalidades Principais

✅ **Ranking Dinâmico** - Atualiza automaticamente a cada 60 segundos
✅ **Filtros de Período** - Semanal, Mensal, Bimestral, Trimestral, Semestral, Anual
✅ **Pódio Top 3** - Visual destacado para os primeiros colocados
✅ **Gamificação** - Som de caixa registradora e notificações
✅ **Design Dark** - Tema escuro com acentos verde e dourado

## 🔧 Estrutura de Pastas

- `app/` - Páginas Next.js (App Router)
- `components/` - Componentes React reutilizáveis
- `lib/` - Lógica de negócio, services, hooks e utils
- `public/sounds/` - Arquivos de áudio

## 🐛 Troubleshooting

**Problema:** O som não toca
- **Solução:** Adicione o arquivo `cash-register.mp3` em `/public/sounds/`
- O sistema funciona normalmente sem o som

**Problema:** Erro ao buscar dados da API
- **Solução:** Verifique se `USE_MOCK_DATA=true` ou se a API Key está correta
- O sistema faz fallback automático para mock em caso de erro

**Problema:** Imagens não carregam
- **Solução:** As imagens usam fallback com inicial do nome se a foto não estiver disponível

## 📚 Próximos Passos

1. Adicione o arquivo de som em `/public/sounds/cash-register.mp3`
2. Configure a API Key real quando estiver pronto para produção
3. Personalize as cores e estilos em `tailwind.config.ts` e `app/globals.css`


