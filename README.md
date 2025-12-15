\# Lattes JCR Parser



Ferramenta web para extração, organização e análise do fator de impacto (JCR) a partir do Currículo Lattes salvo em formato HTML completo.



Autores: Andre Belem (andrebelem@id.uff.br)  <br>

&nbsp;        F.R.I.D.A.Y



\## Motivação



Em diversos editais de fomento, avaliações institucionais e análises comparativas de produção acadêmica, especialmente no âmbito do CNPq, CAPES e fundações estaduais, o fator de impacto dos periódicos (Journal Citation Reports – JCR) é amplamente utilizado como um dos indicadores de qualidade da produção científica.



Apesar disso, não existe uma ferramenta oficial ou padronizada que permita extrair automaticamente, a partir do Currículo Lattes, os valores de JCR associados aos artigos publicados, tampouco realizar somatórios ou análises temporais de forma transparente e reproduzível.



Este projeto surgiu para preencher essa lacuna, oferecendo uma solução simples, auditável e totalmente executada no navegador do usuário.



\## O que é o JCR



O Journal Citation Reports (JCR) é um indicador bibliométrico publicado pela Clarivate Analytics que expressa, de forma resumida, o impacto médio dos artigos publicados em um periódico científico em um determinado ano.



Embora o JCR não seja um indicador absoluto de qualidade individual de artigos ou pesquisadores, ele é amplamente utilizado como critério auxiliar em avaliações acadêmicas, editais e relatórios institucionais.



\## Como o programa funciona



O Lattes JCR Parser opera exclusivamente em ambiente \*client-side\*, ou seja:



\- Todo o processamento ocorre localmente no navegador do usuário

\- Nenhum dado é enviado, armazenado ou transmitido para servidores externos

\- Nenhuma informação é gravada ou compartilhada



O funcionamento básico consiste em:



1\. O usuário faz o upload do arquivo HTML completo do Currículo Lattes

2\. O programa analisa a estrutura do HTML

3\. São identificados os artigos completos publicados em periódicos

4\. Quando disponível, o fator de impacto JCR é extraído a partir do ícone “jcr” presente no próprio HTML do Lattes

5\. Os dados são organizados em uma tabela, com:

&nbsp;  - Ano

&nbsp;  - Referência completa

&nbsp;  - Ano do JCR

&nbsp;  - Valor do JCR

6\. O usuário pode definir um intervalo de anos e calcular:

&nbsp;  - Número de artigos no período

&nbsp;  - Número de artigos com JCR

&nbsp;  - Soma total do JCR

&nbsp;  - Média do JCR no intervalo selecionado

7\. Todos os dados podem ser exportados para Excel





\## Requisitos fundamentais



\### Arquivo HTML completo



É absolutamente essencial que o Currículo Lattes seja salvo como \*\*HTML completo\*\*, incluindo todos os arquivos associados.



Arquivos no formato `.mhtml` não são suportados.



\### Navegador recomendado



O Google Chrome não gera corretamente um HTML completo compatível com este parser.



Recomenda-se fortemente o uso do \*\*Mozilla Firefox\*\*, seguindo os passos:



1\. Acesse o Currículo Lattes

2\. Clique com o botão direito na página

3\. Selecione “Salvar página como”

4\. Escolha a opção “Página completa”

5\. Salve o arquivo `.html` e a pasta associada





\## Sobre inconsistências nos resultados



Caso algum artigo não apresente valor de JCR ou apareça com informações incompletas, recomenda-se verificar primeiramente:



\- Se o lançamento do artigo no Currículo Lattes está correto

\- Se o periódico possui JCR no ano correspondente

\- Se o ícone “jcr” aparece ao lado da publicação na visualização online do Lattes



O programa apenas extrai informações que já estão presentes no HTML gerado pelo próprio sistema Lattes.





\## Escopo e limitações



\- O somatório de JCR não constitui um indicador bibliométrico oficial

\- Os resultados devem ser utilizados de forma exploratória, comparativa ou para organização interna

\- A ferramenta não substitui análises qualitativas da produção científica





\## Desenvolvimento contínuo



Este é um projeto em constante desenvolvimento.



Novas funcionalidades, melhorias no parser e refinamentos na análise poderão ser incorporados progressivamente, mantendo sempre os princípios de transparência, simplicidade e execução local.



Contribuições, sugestões e testes são bem-vindos. E se você gostou desse app, divulgue e cite ! 



