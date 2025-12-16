# WHYNOT.md  
## Por que o HTML salvo pelo Chrome não funciona (e por que usar Firefox)

Este documento explica, de forma objetiva, por que o Lattes JCR Parser funciona corretamente com arquivos HTML salvos pelo Mozilla Firefox e, em geral, não funciona com arquivos HTML salvos pelo Google Chrome.



## O problema em uma frase

O valor do JCR **não faz parte originalmente do HTML do Currículo Lattes**.  
Ele é inserido dinamicamente na página após o carregamento, e o Chrome normalmente não preserva essa informação ao salvar a página.



## Como o JCR aparece no Currículo Lattes

Quando você visualiza o Currículo Lattes online, o fator de impacto JCR aparece como um pequeno ícone “jcr” ao lado de cada artigo.

Tecnicamente, esse valor:

- Não está fixo no HTML inicial da página
- É preenchido dinamicamente via JavaScript
- Depende de uma chamada assíncrona (AJAX) após o carregamento da página

O número do JCR passa a existir no HTML apenas depois que essa etapa dinâmica é concluída.



## O que o Firefox faz de diferente

Ao salvar uma página como **“Página completa”**, o Mozilla Firefox geralmente:

- Preserva o DOM já processado
- Inclui no HTML final os atributos dinâmicos adicionados por JavaScript
- Salva o valor do JCR dentro do atributo `original-title` do ícone “jcr”

Isso permite que o parser encontre diretamente no HTML trechos como:

```
Fator de impacto (JCR 2024): 2.7
```

Ou seja, o dado já está materializado no arquivo salvo.


## O que acontece no Chrome

Ao salvar a mesma página como “Página completa”, o Google Chrome frequentemente:

- Salva uma versão do HTML **anterior ao preenchimento dinâmico**
- Mantém o ícone “jcr”, mas sem o valor associado
- Não inclui o atributo `original-title` com o número do JCR

Nesse caso, o HTML contém apenas algo como:

```
<img class="ajaxJCR" data-issn="..." />
```
O valor do JCR simplesmente não existe no arquivo salvo.

## Consequência direta para o Lattes JCR Parser

O Lattes JCR Parser:

- Não consulta bases externas
- Não faz requisições adicionais
- Apenas extrai informações que já estão presentes no HTML

Se o número do JCR não estiver no arquivo, não há como extraí-lo.

Isso não é uma limitação do parser, mas uma consequência direta da forma como o HTML foi salvo.

## Como garantir que funcione corretamente

Recomenda-se fortemente:

- Utilizar o Mozilla Firefox
- Acessar o Currículo Lattes normalmente
- Aguardar o carregamento completo da página
- Salvar usando “Salvar página como” → “Página completa”
- Utilizar o arquivo `.html` gerado junto com a pasta associada

Arquivos `.mhtml` não são suportados.

## Alternativas (uso avançado)

Em alguns casos, usuários avançados conseguem resultados no Chrome utilizando extensões que salvam um snapshot completo do DOM já processado por JavaScript (por exemplo, extensões do tipo SingleFile). No entanto, esse método não é padronizado nem garantido.

Por esse motivo, o Firefox é a opção recomendada e documentada oficialmente neste projeto.
