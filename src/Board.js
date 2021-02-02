import React from 'react';
import * as utils from './utils.js';


//função que cria cada uma das casas do tabuleiro.
function Square(props) {
    //recebe as props de classe e clique.
    const squareClasses = props['squareClasses'];
    const onClick = props['onClick'];
    //e retorna um "botão" com as propriedades definidas.
    return (
        <button className = { "square " + (squareClasses) } onClick={onClick} />
    );
}

//aqui a classe do tabuleiro que vai tratar de renderizar cada uma das casas.
class Board extends React.Component {
    //recebe como propriedade as coordenadas e a classe e retorna um elemento
    //Square com uma chave, classe e definição de ação no clique.
    renderSquare(coordinates, squareClasses) {
        return (
            <Square
                key = {coordinates}
                squareClasses = {squareClasses}
                onClick = {() => this.props.onClick(coordinates) }
            />
        );
    }
    //no render temos 2 arrays vazios, um para o tabuleiro e outro para colunas.
    render() {
        let boardRender = [];
        let columnsRender = [];
        //os movimentos são armazenados em uma constante que recebe as props de moves.
        const moves = this.props.moves;
        //com um for in vamos trabalhar as coordenadas...
        for (let coordinates in this.props.boardState) {
            //se o boardState não tiver suas coordenadas o código segue.
            //esse hasOwnProperty é um método do React que verifica se aquele objeto tem 
            //a propriedade indicada, no caso coordenadas.
            if (!this.props.boardState.hasOwnProperty(coordinates)) {
                continue;
            }
            //duas const são criadas, uma pra coluna e outra pra linha.
            //esse getColasInt é uma função do arqtuivo utils.js que 
            //recebe como argumento a coluna e coordenada e retorna columns[coordinate.charAt(0)], 
            //ou seja um coluna com o 1º caractere da coordenada.
            const col = utils.getColAsInt(this.props.columns, coordinates);
            //mesma coisa aqui mas aqui retorna parseInt(coordinate.charAt(1), 10);
            //ou seja faz um parseInt no 2º carcatere da coordenada em uma base decimal.
            const row = utils.getRowAsInt(coordinates);

            //aqui se define o jogador por um booleano: se true é o P1, se false é o p2.
            //esse returnPlayerName lá em utils.js retorna playerBool === true ? 'player1' : 'player2';
            const currentPlayer = utils.returnPlayerName(this.props.currentPlayer);

            //para definir a cor ce cada quadradinho se faz da seguinte forma:
            //se tanto coluna quanto linha forem ímpares (Math.abs(n % 2) === 1;) é branco. 
            //Se linha e colunas NÃO forem ímapres é preto. 
            const colorClass  = ( (utils.isOdd(col) && utils.isOdd(row)) || (!utils.isOdd(col) && !(utils.isOdd(row)) ) ) ? 'white' : 'black';

            //daí tudo é armazenado em um array.
            let squareClasses = [];

            //e nesse array damos um push tanto nas coordenadas quanto nas classes de cor. 
            squareClasses.push(coordinates);
            squareClasses.push(colorClass);

            //daí são feitas algumas verificações: se a peça selecionada for igual às coordenadas
            //é feito um push no array squareClasses com a string 'isActive'.
            if (this.props.activePiece === coordinates) {
                squareClasses.push('isActive');
            }

            //se o índice de coordenadas da const moves for maior que -1 (ou seja, se existir algo lá)
            //ele cria uma variável chamada moveClass e atribui a ela o valor de movable junto do 
            //player e da string '-move'. Também faz um push em squareclass com essa variável moveClass.
            if (moves.indexOf(coordinates) > -1) {
                let moveClass = 'movable ' + currentPlayer + '-move';
                squareClasses.push(moveClass);
            }

            //se tiver no boardState alguma coordenada esse if faz um push no squareClass com 
            //as coordenadas oriundas das props desse player junto da string 'piece'.
            if (this.props.boardState[coordinates] !== null) {
                squareClasses.push(this.props.boardState[coordinates].player + ' piece');

                //e se for Dama ele joga lá no array também...
                if (this.props.boardState[coordinates].isKing === true ) {
                    squareClasses.push('king');
                }
            }

            //junta tudo que tiver no array tirando os espaços.
            squareClasses = squareClasses.join(' ');
            //AQui dei un console log pra ficar mais claro o funcionamento:
            //O tabuleiro é desenhado da seguinte forma: colunas de "a" até "h" e linhas de 1 até 8.
            //começamos com o square a1 que fica no canto inferior esquerdo. A8 fica no superior esquerdo.
            //h1 fica no canto inferior direito e assim por diante. 
            //Esse array vai mostrar cada quadradinho, se é branco ou preto, se tem peça em cima de qual 
            //jogador, se a peça "x" está selecionada e qual célula desse tabuleiro é movível, ou seja, pode
            //receber a peça que está selecionada. 
            //A cada seleção de peça e a cada movimento o array é atualizado.
            console.log(squareClasses)

            //o clumnsRender foi um array vazio que criamos lá no começo desse código e agora 
            //vamos dar um push nele usando a função de renderSquare mandando os atributos de coordenada, etc.
            //essa função está lá no início tbm e é responsável por renderizar cada square com as informações certinhas. 
            columnsRender.push(this.renderSquare(coordinates, squareClasses, this.props.boardState[coordinates]));
            
            //esse if verifica se o comprimento de columnsRender é maior ou igual a 8 e se for atribui a
            //esse array o seu valor em ordem inversa.
            if (columnsRender.length >= 8) {
                columnsRender = columnsRender.reverse();
                //o boardRender é outro array criado lá no início e dentro desse if vamos também dar um push
                //nele com uma div contendo a classe "board-col" e retornando o valor de columnsRender.
                //no final vamos zerar o columnsRender por atribuir a ele mais uma vez um array vazio.
                boardRender.push(<div key={boardRender.length} className="board-col">{columnsRender}</div>);
                columnsRender = [];
                
            }
        }
        //tudo isso que está no Render vai culminar em um return de boardRender.
        return (boardRender);
    }
}

export default Board;