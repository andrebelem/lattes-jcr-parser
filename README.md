<p align="center">
  <img src="assets/lattes-jcr-parser.png" alt="Lattes JCR Parser logo" width="250">
</p>

# Lattes JCR Parser

Ferramenta web para extração, organização e análise da evolução do **fator de impacto** (baseado no JCR) dos artigos do [Currículo Lattes](https://lattes.cnpq.br/) salvo em formato HTML **completo**.

Acesse o aplicativo em [https://andrebelem.github.io/lattes-jcr-parser/](https://andrebelem.github.io/lattes-jcr-parser/)

Autor: Andre Belem [andrebelem@id.uff.br](mailto:andrebelem@id.uff.br) (em parceria com a [F.R.I.D.A.Y.](https://observatoriooceanografico.org/equipe/friday-bot/))

---

## Motivação

Em diversos Comitês de Assessoramento do CNPq, o **somatório do fator de impacto (baseado no JCR)** é utilizado como critério quantitativo na avaliação da produção científica, em especial nos processos de enquadramento e classificação para Bolsas de Produtividade em Pesquisa. No entanto, esse indicador **não é fornecido de forma direta pela Plataforma Lattes**, exigindo que o próprio pesquisador realize levantamentos manuais, artigo por artigo, frequentemente sujeitos a erros, inconsistências e falta de transparência.

Na prática, o cálculo do somatório do fator de impacto a partir do Currículo Lattes é um processo **trabalhoso, repetitivo e pouco auditável**, especialmente para pesquisadores com produção extensa ou distribuída ao longo de muitos anos. Além disso, não há uma forma padronizada de verificar ou reproduzir esse cálculo a partir do próprio arquivo do currículo.

Este projeto surgiu a partir de uma demanda concreta da comunidade acadêmica para **organizar, verificar e sistematizar** essas informações de maneira objetiva. O *Lattes JCR Parser* oferece uma solução simples, auditável e inteiramente executada no navegador do usuário, permitindo a extração do fator de impacto (IF_JCR), o cálculo de somatórios e a visualização temporal da produção científica, sem coleta ou transmissão de dados.

---

## O que é o JCR

O *Journal Citation Reports* (JCR), publicado pela Clarivate Analytics, é a base de dados que reúne indicadores bibliométricos de periódicos científicos indexados na *Web of Science*. Entre esses indicadores, o mais amplamente utilizado é o **Fator de Impacto (Impact Factor – IF)**, que expressa o número médio de citações recebidas, em um determinado ano, por artigos publicados no periódico em um período de referência.

O JCR não avalia artigos ou pesquisadores individualmente, mas fornece métricas associadas aos periódicos científicos. Ainda assim, o fator de impacto derivado do JCR é amplamente utilizado como critério auxiliar em avaliações acadêmicas, editais e relatórios institucionais, especialmente quando combinado com análises qualitativas e contextuais da produção científica.

## Como o programa funciona

O *Lattes JCR Parser* opera exclusivamente em ambiente *client-side*, escrito em JavaScript, o que significa que todo o processamento ocorre localmente no navegador do usuário. Nenhum dado é enviado, armazenado ou transmitido para servidores externos. Nenhuma informação é gravada ou compartilhada. Para que o aplicativo funcione corretamente, é necessário que o navegador permita a execução de JavaScript. Caso o JavaScript esteja desabilitado por configurações de segurança, extensões de bloqueio ou políticas institucionais, o processamento não será executado.

O funcionamento básico consiste em:

1. O usuário faz o upload do arquivo HTML **completo** do Currículo Lattes  
2. O programa analisa a estrutura do HTML  
3. São identificados os artigos completos publicados em periódicos  
4. Quando disponível, o fator de impacto do JCR é extraído a partir do ícone “jcr” presente no próprio HTML do Lattes  
5. Os dados são organizados em uma tabela contendo:
   - Ano
   - Referência completa
   - Ano do IF_JCR
   - Valor do IF_JCR
6. O usuário pode definir um intervalo de anos e calcular:
   - Número de artigos no período
   - Número de artigos com JCR
   - Soma total do IF_JCR
   - Média do IF_JCR no intervalo selecionado
7. Todos os dados podem ser exportados para Excel

## Requisitos fundamentais

### Arquivo HTML completo e navegador recomendado

É absolutamente essencial que o Currículo Lattes seja salvo como HTML completo, incluindo todos os arquivos associados ! Arquivos no formato `.mhtml` não são suportados. O Google Chrome não gera corretamente um HTML completo compatível com este parser. Por isso, recomenda-se fortemente o uso do [Mozilla Firefox](https://www.firefox.com/pt-BR/), seguindo os passos:

1. Acesse o Currículo Lattes  
2. Clique com o botão direito na página  
3. Selecione “Salvar página como”  
4. Escolha a opção **“Página completa”**  
5. Salve o arquivo `.html` e a pasta associada

## Sobre inconsistências nos resultados

Caso algum artigo não apresente valor de IF_JCR ou apareça com informações incompletas, recomenda-se verificar primeiramente:

- Se o lançamento do artigo no Currículo Lattes está correto  
- Se o periódico possui JCR no ano correspondente  
- Se o ícone “jcr” aparece ao lado da publicação na visualização online do Lattes  

O programa apenas extrai informações que já estão presentes no HTML gerado pelo próprio sistema Lattes.

## Escopo e limitações

O somatório de JCR não constitui um indicador bibliométrico oficial. Os resultados devem ser utilizados de forma exploratória, comparativa ou para organização interna. A ferramenta não substitui análises qualitativas da produção científica.

Porém, o gráfico de IF_JCR acumulado ao longo do tempo tem caráter auxiliar e exploratório, sendo particularmente útil para visualizar tendências e a rampa de crescimento da produção associada a periódicos com fator de impacto registrado. Ainda assim, não deve ser interpretado como métrica formal de avaliação.

## Desenvolvimento contínuo

Este é um projeto em constante desenvolvimento. Novas funcionalidades, melhorias no parser e refinamentos na análise poderão ser incorporados progressivamente, mantendo sempre os princípios de transparência, simplicidade e execução local (embora penso que esta deveria ser uma ferramenta incorporada do próprio Lattes).

Contribuições, sugestões e testes são bem-vindos por meio do repositório no GitHub (https://github.com/andrebelem/lattes-jcr-parser).  
Se você considerou este aplicativo útil, a divulgação, a citação do projeto e o apoio voluntário via https://buymeacoffee.com/andrebelem são apreciados.
