import React from "react";
import Sketch from "react-p5";
import Board from "./Board";
import FallingSkyMedium from "./fonts/FallingSkyMedium.otf";
import Firebase from "./Firebase";

let board;
let currentPlayer = 1;
let currentPosition = [1, 1, 2];
let font;
let firebase;
let state = 0;
let gameCode = "";
let joinButton;
let createGameButton;
let gameCodeInput;
let resetButton;
let waitingForOpponent = true;
let player = 1;
const Script = (props) => {
  font = FallingSkyMedium;
  const subscribeToGame = (callback) => {
    firebase.subscribeToGame(gameCode, (game) => {
      game = game.game;
      board.board = JSON.parse(game.board);
      currentPlayer = game.currentPlayer;
      currentPosition = game.currentPosition;
      state = game.state;
      waitingForOpponent = game.waitingForOpponent;
      state = board.checkState();
      joinButton.hide();
      createGameButton.hide();
      gameCodeInput.attribute("disabled", "true");
      if (state === 0) {
        resetButton.hide();
      }
    });
    if (callback) callback();
  };

  const resetRoutine = () => {
    board.reset();
    currentPlayer = 1;
    currentPosition = [1, 1, 2];
    state = 0;
    firebase.updateGame(gameCode, {
      board: JSON.stringify(board.board),
      currentPlayer,
      currentPosition,
      state,
      waitingForOpponent,
    });
    resetButton.hide();
  };

  const setup = (p5, canvasParentRef) => {
    // 3x3x3 board
    board = new Board();
    firebase = new Firebase();
    firebase.deleteOldGames();
    gameCodeInput = p5.createInput("game code");
    gameCodeInput.position(10, 10);
    gameCodeInput.input((e) => (gameCode = e.target.value));
    joinButton = p5.createButton("join");
    joinButton.position(10, 30);
    joinButton.mousePressed(() => {
      subscribeToGame(() => {
        player = 2;
        waitingForOpponent = false;
        firebase.updateGame(gameCode, {
          board: JSON.stringify(board.board),
          currentPlayer,
          currentPosition,
          state,
          waitingForOpponent,
        });
      });
    });
    createGameButton = p5.createButton("create game");
    createGameButton.position(10, 50);
    createGameButton.mousePressed(() => {
      firebase.createGame(
        {
          board: JSON.stringify(board.board),
          currentPlayer: currentPlayer,
          currentPosition: currentPosition,
          state: 0,
          timeCreated: Date.now(),
          waitingForOpponent: true,
        },
        (id) => {
          gameCode = id;
          gameCodeInput.value(id);
          gameCodeInput.attribute("disabled", true);
          subscribeToGame();
        }
      );
    });
    resetButton = p5.createButton("Reset");
    resetButton.position(10, 80);
    resetButton.mousePressed(() => {
      resetRoutine();
    });
    resetButton.hide();
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(
      canvasParentRef
    );
    p5.camera(0, 0, 1000, 0, 0, 0, 0, 1, 0);
  };
  const preload = (p5) =>
    (font = p5.loadFont(FallingSkyMedium, (font) => console.log(font)));

  function keyPressed(_p5) {
    state = board.checkState(currentPlayer);
    if (state === 0) {
      if (_p5.keyCode === 37) {
        if (currentPosition[0] > 0) {
          currentPosition[0]--;
        }
      } else if (_p5.keyCode === 39) {
        if (currentPosition[0] < 2) {
          currentPosition[0]++;
        }
      } else if (_p5.keyCode === 38) {
        if (currentPosition[1] > 0) {
          currentPosition[1]--;
        }
      } else if (_p5.keyCode === 40) {
        if (currentPosition[1] < 2) {
          currentPosition[1]++;
        }
      } else if (_p5.keyCode === 90) {
        if (currentPosition[2] > 0) {
          currentPosition[2]--;
        } else {
          currentPosition[2] = 2;
        }
      } else if (_p5.keyCode === 32) {
        if (
          currentPlayer === player &&
          !waitingForOpponent &&
          board.place(
            currentPosition[0],
            currentPosition[1],
            currentPosition[2],
            currentPlayer
          )
        ) {
          state = board.checkState(currentPlayer);
          if (state === 0) {
            if (currentPlayer === 1) {
              currentPlayer = 2;
            } else {
              currentPlayer = 1;
            }
          }
          firebase.updateGame(gameCode, {
            board: JSON.stringify(board.board),
            currentPlayer: currentPlayer,
            currentPosition: currentPosition,
            state: state,
            waitingForOpponent: waitingForOpponent,
          });
        }
      }
    }
  }

  const draw = (p5) => {
    p5.background(255);
    p5.textFont(font);
    p5.textSize(32);
    p5.textAlign(p5.CENTER, p5.CENTER);

    p5.fill(0);
    p5.text("3D XO", -p5.width / 2, p5.height / 2);
    p5.text("current player " + currentPlayer, 0, -p5.height / 2 + 50);
    p5.text("current position " + currentPosition, 0, -p5.height / 2 + 100);
    p5.fill(255, 0, 0);
    p5.text("Player 1 in red", -p5.width / 2 + 100, -p5.height / 2 + 50);
    p5.fill(0, 0, 255);
    p5.text("Player 2 in blue", p5.width / 2 - 100, -p5.height / 2 + 50);
    p5.fill(0);
    p5.text(
      "Move through x-axis with left & right keys",
      0,
      p5.height / 2 - 150
    );
    p5.text("Move through y-axis with up & down keys", 0, p5.height / 2 - 100);
    p5.text("Move through z-axis using z key", 0, p5.height / 2 - 50);
    p5.text("Place with space", 0, p5.height / 2);

    p5.orbitControl(3, 3, 0.1);
    p5.ambientLight(255);
    p5.ambientMaterial(100);
    p5.translate(-200, -200, -300);
    if (state === 0 && !waitingForOpponent) {
      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
          for (let z = 0; z <= 2; z++) {
            p5.stroke(0);
            p5.push();
            p5.translate(x * 200, y * 200, z * 200);
            if (board.board[x][y][z] === 1) {
              p5.fill(255, 0, 0);
              p5.stroke(255, 0, 0);
              // 3d x
              p5.push();
              p5.rotateZ(p5.PI / 4);
              p5.rotateX(p5.PI / 2);
              p5.box(100, 50, 10);
              p5.pop();
              p5.push();
              p5.rotateZ(-p5.PI / 4);
              p5.rotateX(p5.PI / 2);
              p5.box(100, 50, 10);
              p5.pop();
            } else if (board.board[x][y][z] === 2) {
              p5.push();
              p5.fill(0, 0, 255);
              p5.stroke(0, 0, 255);
              p5.sphere(50);
              p5.pop();
            } else {
              p5.fill(255);
              p5.stroke(0);
              p5.box(100);
            }

            p5.pop();
          }
        }
      }
      // draw current position
      p5.push();
      p5.translate(
        currentPosition[0] * 200,
        currentPosition[1] * 200,
        currentPosition[2] * 200
      );
      if (currentPlayer === 1) {
        p5.stroke(255, 0, 0);
        p5.fill(255, 0, 0);
      } else if (currentPlayer === 2) {
        p5.stroke(0, 0, 255);
        p5.fill(0, 0, 255);
      } else {
        p5.stroke(0);
        p5.fill(0);
      }
      if (
        !board.checkifValid(
          currentPosition[0],
          currentPosition[1],
          currentPosition[2]
        )
      ) {
        p5.noFill();
      }
      p5.box(100);
      p5.pop();
    } else if (state === 0 && waitingForOpponent) {
      p5.push();
      p5.translate(200, 200, 300);
      p5.fill(0);
      p5.text("Waiting for opponent", 0, 0);
      p5.pop();
    } else {
      resetButton.show();
    }

    if (state === 1) {
      p5.push();
      p5.translate(200, 200, 300);
      p5.fill(0);
      p5.text("Player 1 won", 0, 0);
      p5.pop();
    } else if (state === 2) {
      p5.push();
      p5.translate(200, 200, 300);
      p5.fill(0);
      p5.text("Player 2 won", 0, 0);
      p5.pop();
    } else if (state === 3) {
      p5.push();
      p5.translate(200, 200, 300);
      p5.fill(0);
      p5.text("Draw", 0, 0);
      p5.pop();
    }
  };
  return (
    <Sketch
      preload={preload}
      keyPressed={keyPressed}
      setup={setup}
      draw={draw}
      windowResized={(p5) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.camera(0, 0, 1000, 0, 0, 0, 0, 1, 0);
      }}
    />
  );
};

export default Script;
