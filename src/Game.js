import React from 'react';
import Board from './Board.js';
import {returnPlayerName} from './utils.js';
import {ReactCheckers} from './ReactCheckers.js';
import { Router } from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Opponent} from './Opponent.js';


//esse createBrowserHistory é da biblioteca history que importamos há pouco e
//ela permite gerenciar o histórico da sessão. Ela cria um objeto que
//fornece um API que nos permite consultar, navegar e usar dados entre sessões.
const browserHistory = createBrowserHistory();


//agora vamos criar uma classe para o jogo propriamente dito, com algumas atribuições
//de valor:
export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.columns = this.setColumns();
        this.ReactCheckers = new ReactCheckers(this.columns);
        this.Opponent = new Opponent(this.columns);

        //no state vai um objeto com os seus valores iniciais:
        this.state = {
            players: null,
            history: [{
                boardState: this.createBoard(),
                currentPlayer: true,
            }],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
        }
    }

    //aqui a função que servirrá de base para a const columns que começa como
    //um objeto com estas atribuições de valor.
    setColumns() {
        const columns = {};
        columns.a = 0;
        columns.b = 1;
        columns.c = 2;
        columns.d = 3;
        columns.e = 4;
        columns.f = 5;
        columns.g = 6;
        columns.h = 7;
        
        return columns;
    }

    //aqui uma função que cria o tabuleiro no jogo.
    //lá no Board.js criamos o tabuleiro mas aqui vamos inicializar ele
    //indicando que casa tem qual peça, de que jogador é a peça e se ela é dama.  
    createBoard() {
        let board = {};
        for (let key in this.columns) {
            if (this.columns.hasOwnProperty(key)) {
                for (let n = 1; n <= 8 ; ++n) {
                    let row = key + n;
                    board[row] = null;
                }
            }
        }
        board = this.initPlayers(board);
        //aqui é possível ver o objeto com a distribuição das peças e suas informações.
        console.log(board)
        return board;
    }

    //aqui os arrays com o "mapa" das peças de cada jogador no início do jogo. 
    initPlayers(board) {
        const player1 = ['a8', 'c8', 'e8', 'g8', 'b7', 'd7', 'f7', 'h7', 'a6', 'c6', 'e6', 'g6',];
        const player2 = ['b3', 'd3', 'f3', 'h3', 'a2', 'c2', 'e2', 'g2', 'b1', 'd1', 'f1', 'h1',];
        let self = this;
        //aqui fazemos um forEach para cada jogador e chamamos a função createPiece
        //com os argumentos de localização e jogador. Ele criará uma peça para
        //cada uma das listadas na const playerX acima.
        player1.forEach(function (i) {
            board[i] = self.createPiece(i, 'player1');
        });
        //mesma coisa para o player 2.
        player2.forEach(function (i) {
            board[i] = self.createPiece(i, 'player2');
        });

        //tudo isso retorna um tabuleiro.
        return board;
    }

    //aqui a função que chamamos antes. Ela cria um objeto pra cada peça informando
    //a sua localização, a quem pertence e se é dama.
    createPiece(location, player) {
        let piece = {};
        piece.player   = player;
        piece.location = location;
        piece.isKing   = false;
        console.log(piece)
        return piece;
    }

    //parei por aqui.../////////////////////////////////////////////
    getCurrentState() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        return history[history.length - 1];
    }

    handleClick(coordinates) {

        if (this.state.winner !== null) {
            return;
        }

        const currentState = this.getCurrentState();
        const boardState = currentState.boardState;
        const clickedSquare = boardState[coordinates];

        // Clicked on a piece
        if (clickedSquare !== null) {

            // Can't select opponents pieces
            if (clickedSquare.player !== returnPlayerName(currentState.currentPlayer)) {
                return;
            }

            // Unset active piece if it's clicked
            if (this.state.activePiece === coordinates && this.state.hasJumped === null) {
                this.setState({
                    activePiece: null,
                    moves: [],
                    jumpKills: null,
                });
                return;
            }

            // Can't choose a new piece if player has already jumped.
            if (this.state.hasJumped !== null && boardState[coordinates] !== null) {
                return;
            }

            // Set active piece
            let movesData = this.ReactCheckers.getMoves(boardState, coordinates, clickedSquare.isKing, false);

            this.setState({
                activePiece: coordinates,
                moves: movesData[0],
                jumpKills: movesData[1],
            });

            return;
        }

        // Clicked on an empty square
        if (this.state.activePiece === null) {
            return;
        }

        // Moving a piece
        if (this.state.moves.length > 0) {
            const postMoveState = this.ReactCheckers.movePiece(coordinates, this.state);

            if (postMoveState === null) {
                return;
            }

            this.updateStatePostMove(postMoveState);

            // Start computer move is the player is finished
            if (postMoveState.currentPlayer === false && postMoveState.winner === null) {
                this.computerTurn();
            }
        }
    }

    computerTurn(piece = null) {
        if (this.state.players > 1) {
            return;
        }

        setTimeout(()=> {
            const currentState = this.getCurrentState();
            const boardState = currentState.boardState;

            let computerMove;
            let coordinates;
            let moveTo;

            // If var piece != null, the piece has previously jumped.
            if (piece === null) {
                //computerMove = this.Opponent.getRandomMove(boardState, 'player2');
                computerMove = this.Opponent.getSmartMove(this.state, boardState, 'player2');
                
                coordinates = computerMove.piece;
                moveTo = computerMove.moveTo;
            } else {
                // Prevent the computer player from choosing another piece to move. It must move the active piece
                computerMove = this.ReactCheckers.getMoves(boardState, piece, boardState[piece].isKing, true);
                coordinates = piece;
                moveTo = computerMove[0][Math.floor(Math.random()*computerMove[0].length)];
            }

            const clickedSquare = boardState[coordinates];

            let movesData = this.ReactCheckers.getMoves(boardState, coordinates, clickedSquare.isKing, false);

            this.setState({
                activePiece: coordinates,
                moves: movesData[0],
                jumpKills: movesData[1],
            });

            setTimeout(()=> {
                const postMoveState = this.ReactCheckers.movePiece(moveTo, this.state);

                if (postMoveState === null) {
                    return;
                }

                this.updateStatePostMove(postMoveState);

                // If the computer player has jumped and is still moving, continue jump with active piece
                if (postMoveState.currentPlayer === false) {
                    this.computerTurn(postMoveState.activePiece);
                }
            },
            500);
        },
        1000);
    }

    updateStatePostMove(postMoveState) {
        this.setState({
            history: this.state.history.concat([{
                boardState: postMoveState.boardState,
                currentPlayer: postMoveState.currentPlayer,
            }]),
            activePiece: postMoveState.activePiece,
            moves: postMoveState.moves,
            jumpKills: postMoveState.jumpKills,
            hasJumped: postMoveState.hasJumped,
            stepNumber: this.state.history.length,
            winner: postMoveState.winner,
        });
    }

    undo() {
        const backStep = parseInt(this.state.stepNumber, 10) -1;
        if (backStep < 0) {
            return;
        }
        const unsetHistory = this.state.history.slice(0, backStep+1);
        this.setState({
            history: unsetHistory,
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: backStep,
            winner: null,
        });
    }

    setPlayers(players) {
        this.setState({
            players: players,
        })
    }

    render() {
        const columns = this.columns;
        const stateHistory = this.state.history;
        const activePiece = this.state.activePiece;
        const currentState = stateHistory[this.state.stepNumber];
        const boardState = currentState.boardState;
        const currentPlayer = currentState.currentPlayer;
        const moves = this.state.moves;

//        console.log(this.state);

        let gameStatus;

        let undoClass = 'undo';

        if (this.state.stepNumber < 1) {
            undoClass += ' disabled';
        }

        switch (this.state.winner) {
            case 'player1pieces':
                gameStatus = 'A Vacina venceu!!!';
                break;
            case 'player2pieces':
                gameStatus = 'COVID venceu... :-(';
                break;
            case 'player1moves':
                gameStatus = 'Sem mais possibildiades - A vacina venceu!';
                break;
            case 'player2moves':
                gameStatus = 'Sem mais possibildiades - COVID venceu... :-(';
                break;
            default:
                gameStatus = currentState.currentPlayer === true ? 'Vacina' : 'COVID';
                break;
        }

        if (this.state.players === null) {
            return(
                <Router history={browserHistory} basename={'react-checkers'} >
                    <div className="players-select">
                        <div className="players">
                            <div className="one-player" onClick={()=> this.setPlayers(1) }>Um jogador</div>
                        </div>
                        <div className="players">
                            <div className="two-player" onClick={()=> this.setPlayers(2) }>Dois jogadores</div>
                        </div>
                    </div>
                </Router>
            )
        }

        return(
            <Router history={browserHistory} basename={'react-checkers'} >
                <div className="reactCheckers">
                    <div className="game-status">
                        {gameStatus}
                    </div>
                    <div className="game-board">
                        <Board
                            boardState = {boardState}
                            currentPlayer = {currentPlayer}
                            activePiece = {activePiece}
                            moves = {moves}
                            columns = {columns}
                            onClick = {(coordinates) => this.handleClick(coordinates)}
                        />
                    </div>
                    <div className="time-travel">
                        <button className={undoClass} onClick={()=>this.undo()}>Undo</button>
                    </div>
                </div>
            </Router>
        );
    }
}