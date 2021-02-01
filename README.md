# Damas usando React JS

Demo: [http://www.gabrielmioni.com/react-checkers/](http://www.gabrielmioni.com/react-checkers/)

Um jogo de damas para um ou dois jogadores usando o framework React.js.

### Como jogar?
Escolha a opção de 1 jogador e, ao clicar em uma peça as suas opções de movimento serão exibidas. 
Depois de movimentar sua peça o oponente (a "máquina") fará o seu de forma autônoma, calculando as possibilidade.
Por falar em cálculo a o código determina o vencedor ao não terem mais movimentos possíveis para um dos participantes.


### O código:
Projeto baseado no componente ReactCheckers onde o tabuleiro é inicializado como um objeto node valores definem as coordenadas.

As posições das peças são armazenadas no objeto do tabuleiro. Cada vez que um jogador move sua peça o código do jogo registra o status do tabuleiro. Isso é especialmente interessante por permitir ao jogador voltar atrás no seu movimento. 

Isso é feito por um botão abaixo do tabuleiro que retorna a situação para o registro anterior de status.



