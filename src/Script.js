import React from "react";
import Sketch from "react-p5";
import Board from "./Board";
import FallingSkyMedium from "./fonts/FallingSkyMedium.otf";
import Firebase from "./Firebase";
import arrowRight from "./icons/arrow-right.svg";
import arrowLeft from "./icons/arrow-left.svg";
import arrowUp from "./icons/arrow-up.svg";
import arrowDown from "./icons/arrow-down.svg";

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
let isMobile = false;
let placeButton;
let rightControlButton;
let leftControlButton;
let upControlButton;
let downControlButton;
let zButton;
let playWithAiButton;
let ai = false;
let difficultySelectionButton;
let aiDifficulty = "medium";
let backgroundColor = "#181818";
let primaryColor = "#8758FF";
let secondaryColor = "#5CB8E4";
let textColor = "#F2F2F2";
const Script = (props) => {
  font = FallingSkyMedium;

  const isMobileFunc = (p5) => {
    if (p5.windowWidth < 600) {
      isMobile = true;
    } else {
      isMobile = false;
    }
    if (isMobile) {
      placeButton = p5.createButton("Place");
      placeButton.attribute("class", "mobileButton placeButton");

      // placeButton.position(10, 110);
      placeButton.mousePressed(() => {
        if (
          state === 0 &&
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
      });
      rightControlButton = p5.createButton("");
      rightControlButton.attribute("class", "mobileButton rightControlButton");
      let rightControlImage = p5.createImg(arrowRight, "right arrow");
      rightControlButton.child(rightControlImage);
      // rightControlButton.position(10, 140);
      rightControlButton.mousePressed(() => {
        if (state === 0 && currentPosition[0] < 2) {
          currentPosition[0]++;
        }
      });
      leftControlButton = p5.createButton("");
      leftControlButton.attribute("class", "mobileButton leftControlButton");
      let leftControlImage = p5.createImg(arrowLeft, "left arrow");
      leftControlButton.child(leftControlImage);
      // leftControlButton.position(10, 170);
      leftControlButton.mousePressed(() => {
        if (state === 0 && currentPosition[0] > 0) {
          currentPosition[0]--;
        }
      });
      upControlButton = p5.createButton("");
      upControlButton.attribute("class", "mobileButton upControlButton");
      let upControlImage = p5.createImg(arrowUp, "up arrow");
      upControlButton.child(upControlImage);
      // upControlButton.position(10, 200);
      upControlButton.mousePressed(() => {
        if (state === 0 && currentPosition[1] > 0) {
          currentPosition[1]--;
        }
      });
      downControlButton = p5.createButton("");
      downControlButton.attribute("class", "mobileButton downControlButton");
      let downControlImage = p5.createImg(arrowDown, "down arrow");
      downControlButton.child(downControlImage);
      // downControlButton.position(10, 230);
      downControlButton.mousePressed(() => {
        if (state === 0 && currentPosition[1] < 2) {
          currentPosition[1]++;
        }
      });
      zButton = p5.createButton("Z");
      zButton.attribute("class", "mobileButton zButton");
      // zButton.position(10, 260);
      zButton.mousePressed(() => {
        if (state === 0 && currentPosition[2] > 0) {
          currentPosition[2]--;
        } else if (state === 0 && currentPosition[2] === 0) {
          currentPosition[2] = 2;
        }
      });
    } else {
      try {
        placeButton.hide();
        rightControlButton.hide();
        leftControlButton.hide();
        upControlButton.hide();
        downControlButton.hide();
        zButton.hide();
      } catch (e) {}
    }
  };

  const subscribeToGame = (callback) => {
    firebase.subscribeToGame(gameCode, (game) => {
      board.board = JSON.parse(game.board);
      currentPlayer = game.currentPlayer;
      currentPosition = game.currentPosition;
      state = game.state;
      waitingForOpponent = game.waitingForOpponent;
      state = board.checkState();
      joinButton.hide();
      createGameButton.hide();
      gameCodeInput.attribute("disabled", "true");
      difficultySelectionButton.hide();
      playWithAiButton.hide();
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
    if (!ai) {
      firebase.updateGame(gameCode, {
        board: JSON.stringify(board.board),
        currentPlayer,
        currentPosition,
        state,
        waitingForOpponent,
      });
    } else {
      waitingForOpponent = false;
      difficultySelectionButton.removeAttribute("disabled");
      playWithAiButton.removeAttribute("disabled");
    }
    resetButton.hide();
  };

  const setup = (p5, canvasParentRef) => {
    // 3x3x3 board

    board = new Board();
    firebase = new Firebase();
    firebase.deleteOldGames();
    isMobileFunc(p5);
    gameCodeInput = p5.createInput("game code");
    gameCodeInput.attribute("class", "gameCodeInput");
    gameCodeInput.input((e) => (gameCode = e.target.value));
    joinButton = p5.createButton("join");
    joinButton.attribute("class", "joinButton");
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
    createGameButton.attribute("class", "createGameButton");
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
    resetButton.attribute("class", "resetButton");
    resetButton.mousePressed(() => {
      resetRoutine();
    });
    resetButton.hide();
    playWithAiButton = p5.createButton("Play with AI");
    playWithAiButton.attribute("class", "playWithAiButton");
    playWithAiButton.mousePressed(() => {
      ai = true;
      player = 1;
      waitingForOpponent = false;
      gameCodeInput.hide();
      joinButton.hide();
      createGameButton.hide();
      difficultySelectionButton.attribute("disabled", true);
      playWithAiButton.attribute("disabled", true);
    });
    difficultySelectionButton = p5.createSelect();
    difficultySelectionButton.attribute("class", "difficultySelectionButton");
    difficultySelectionButton.option("Random");
    difficultySelectionButton.option("Easy");
    difficultySelectionButton.option("Medium");
    difficultySelectionButton.option("Hard");
    difficultySelectionButton.option("Impossible");
    difficultySelectionButton.value("Medium");
    difficultySelectionButton.changed(() => {
      aiDifficulty = difficultySelectionButton.value().toLowerCase();
    });
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
          if (!ai) {
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
  }

  const draw = (p5) => {
    p5.background(backgroundColor);
    p5.textFont(font);
    p5.textSize(isMobile ? 12 : 32);
    p5.textAlign(p5.CENTER, p5.CENTER);
    let shift = isMobile ? 0 : 100;
    if (state === 0 && !waitingForOpponent) {
      if (currentPlayer === 1) p5.fill(primaryColor);
      else p5.fill(secondaryColor);
      p5.text("current player " + currentPlayer, 0, -p5.height / 2 + 100);
    }
    p5.fill(primaryColor);
    p5.stroke(secondaryColor);
    p5.text(
      "Player 1 in this color",
      -p5.width / 2 + 100,
      -p5.height / 2 + 50 + shift
    );
    if (player === 1)
      p5.text("You", -p5.width / 2 + 100, -p5.height / 2 + 100 + shift);
    p5.fill(secondaryColor);
    p5.stroke(secondaryColor);
    p5.text(
      "Player 2 in this color",
      p5.width / 2 - 100,
      -p5.height / 2 + 50 + shift
    );
    if (player === 2)
      p5.text("You", p5.width / 2 - 100, -p5.height / 2 + 100 + shift);
    if (!isMobile) {
      p5.fill(textColor);
      p5.stroke(textColor);
      p5.text("3D XO", -p5.width / 2, p5.height / 2);
      p5.text(
        "Move through x-axis with left & right keys",
        0,
        p5.height / 2 - 150
      );
      p5.text(
        "Move through y-axis with up & down keys",
        0,
        p5.height / 2 - 100
      );
      p5.text("Move through z-axis using z key", 0, p5.height / 2 - 50);
      p5.text("Place with space", 0, p5.height / 2);
    }
    p5.orbitControl(3, 3, 0.1);
    p5.ambientLight(255);
    p5.ambientMaterial(textColor);
    p5.push();
    p5.translate(-200, -200, -300);
    if (!waitingForOpponent) {
      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
          for (let z = 0; z <= 2; z++) {
            p5.stroke(0);
            p5.push();
            p5.translate(x * 200, y * 200, z * 200);
            if (board.board[x][y][z] === 1) {
              p5.fill(primaryColor);
              p5.stroke(primaryColor);
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
              p5.fill(secondaryColor);
              p5.stroke(secondaryColor);
              p5.sphere(50);
              p5.pop();
            } else {
              p5.fill(textColor);
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
        p5.stroke(primaryColor);
        p5.fill(primaryColor);
      } else if (currentPlayer === 2) {
        p5.stroke(secondaryColor);
        p5.fill(secondaryColor);
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
      p5.stroke(textColor);
      p5.fill(textColor);
      p5.text("Waiting for opponent", 0, 0);
      p5.pop();
    }
    if (state !== 0) {
      resetButton.show();
    }
    p5.pop();
    p5.push();
    if (state === 1) {
      p5.fill(primaryColor);
      p5.stroke(primaryColor);
      p5.text("Player 1 won", 0, -p5.height / 2 + 100);
    } else if (state === 2) {
      p5.fill(secondaryColor);
      p5.stroke(secondaryColor);
      p5.text("Player 2 won", 0, -p5.height / 2 + 100);
    } else if (state === 3) {
      p5.fill(textColor);
      p5.stroke(textColor);
      p5.text("Draw", 0, -p5.height / 2 + 100);
    }
    p5.pop();
    if (ai && currentPlayer === 2) {
      let move = board.monteCarloTreeSearch(aiDifficulty);
      board.place(move["x"], move["y"], move["z"], 2);
      currentPosition = [move["x"], move["y"], move["z"]];
      currentPlayer = 1;
      state = board.checkState();
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
        isMobileFunc(p5);
      }}
    />
  );
};

export default Script;
