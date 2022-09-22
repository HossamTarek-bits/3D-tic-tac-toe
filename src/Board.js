var _ = require("lodash");
export default class Board {
  // 0 = empty
  // 1 = player 1
  // 2 = player 2
  constructor(n = 3) {
    this.n = n;
    this.board = [];
    this.available = [];
    for (let x = 0; x < n; x++) {
      this.board[x] = [];
      for (let y = 0; y < n; y++) {
        this.board[x][y] = [];
        for (let z = 0; z < n; z++) {
          this.board[x][y][z] = 0;
          this.available.push({ x, y, z });
        }
      }
    }
    this.difficulties = {
      random: 0,
      easy: 0.3,
      medium: 0.5,
      hard: 0.7,
      impossible: 1,
    };
  }

  checkState() {
    // state 0 = no winner
    // state 1 = player 1 wins
    // state 2 = player 2 wins
    // state 3 = draw

    // check for rows
    for (let x = 0; x < this.n; x++) {
      for (let y = 0; y < this.n; y++) {
        let player = this.board[x][y][0];
        if (player !== 0) {
          let win = true;
          for (let z = 1; z < this.n; z++) {
            if (this.board[x][y][z] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            return player;
          }
        }
      }
    }
    // check for columns
    for (let x = 0; x < this.n; x++) {
      for (let z = 0; z < this.n; z++) {
        let player = this.board[x][0][z];
        if (player !== 0) {
          let win = true;
          for (let y = 1; y < this.n; y++) {
            if (this.board[x][y][z] !== player) {
              win = false;
              break;
            }
          }
          if (win) {
            return player;
          }
        }
      }
    }
    // check for depth
    for (let y = 0; y < this.n; y++) {
      for (let z = 0; z < this.n; z++) {
        let player = this.board[0][y][z];
        if (player !== 0) {
          let win = true;
          for (let x = 1; x < this.n; x++) {
            if (this.board[x][y][z] !== player) {
              win = false;
              break;
            }
          }

          if (win) {
            return player;
          }
        }
      }
    }
    // check for diagonals
    for (let x = 0; x < this.n; x++) {
      let player = this.board[x][0][0];
      if (player !== 0) {
        let win = true;
        for (let y = 1; y < this.n; y++) {
          if (this.board[x][y][y] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return player;
        }
      }
    }
    for (let x = 0; x < this.n; x++) {
      let player = this.board[x][0][this.n - 1];
      if (player !== 0) {
        let win = true;
        for (let y = 1; y < this.n; y++) {
          if (this.board[x][y][this.n - 1 - y] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return player;
        }
      }
    }
    for (let y = 0; y < this.n; y++) {
      let player = this.board[0][y][0];
      if (player !== 0) {
        let win = true;
        for (let z = 1; z < this.n; z++) {
          if (this.board[z][y][z] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return player;
        }
      }
    }
    for (let y = 0; y < this.n; y++) {
      let player = this.board[0][y][this.n - 1];
      if (player !== 0) {
        let win = true;
        for (let z = 1; z < this.n; z++) {
          if (this.board[z][y][this.n - 1 - z] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return player;
        }
      }
    }
    for (let z = 0; z < this.n; z++) {
      let player = this.board[0][0][z];
      if (player !== 0) {
        let win = true;
        for (let y = 1; y < this.n; y++) {
          if (this.board[y][y][z] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return player;
        }
      }
    }
    for (let z = 0; z < this.n; z++) {
      let player = this.board[0][this.n - 1][z];
      if (player !== 0) {
        let win = true;
        for (let y = 1; y < this.n; y++) {
          if (this.board[y][this.n - 1 - y][z] !== player) {
            win = false;
            break;
          }
        }
        if (win) {
          return player;
        }
      }
    }
    // check for inside diagonals
    let player = this.board[0][0][0];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[x][x][x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[0][0][this.n - 1];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[x][x][this.n - 1 - x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[0][this.n - 1][0];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[x][this.n - 1 - x][x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[0][this.n - 1][this.n - 1];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[x][this.n - 1 - x][this.n - 1 - x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[this.n - 1][0][0];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[this.n - 1 - x][x][x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[this.n - 1][0][this.n - 1];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[this.n - 1 - x][x][this.n - 1 - x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[this.n - 1][this.n - 1][0];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (this.board[this.n - 1 - x][this.n - 1 - x][x] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    player = this.board[this.n - 1][this.n - 1][this.n - 1];
    if (player !== 0) {
      let win = true;
      for (let x = 1; x < this.n; x++) {
        if (
          this.board[this.n - 1 - x][this.n - 1 - x][this.n - 1 - x] !== player
        ) {
          win = false;
          break;
        }
      }
      if (win) {
        return player;
      }
    }
    // check for draw
    for (let x = 0; x < this.n; x++) {
      for (let y = 0; y < this.n; y++) {
        for (let z = 0; z < this.n; z++) {
          if (this.board[x][y][z] === 0) {
            return 0;
          }
        }
      }
    }
    return 3;
  }
  checkifValid(x, y, z) {
    if (this.board[x][y][z] === 0) {
      return true;
    }
    return false;
  }
  place(x, y, z, player) {
    if (this.checkifValid(x, y, z)) {
      this.board[x][y][z] = player;
      this.available = _.remove(this.available, function (n) {
        console.log(n);
        return n["x"] !== x || n["y"] !== y || n["z"] !== z;
      });

      return true;
    }
    return false;
  }

  reset() {
    for (let x = 0; x < this.n; x++) {
      for (let y = 0; y < this.n; y++) {
        for (let z = 0; z < this.n; z++) {
          this.board[x][y][z] = 0;
        }
      }
    }
  }

  monteCarloTreeSearch(difficulty = "medium") {
    if (Math.random() < this.difficulties[difficulty]) {
      let bestMove = null;
      let bestScore = -Infinity;
      for (let i = 0; i < this.available.length; i++) {
        let move = this.available[i];
        let board = new Board(this.n);
        board.board = _.cloneDeep(this.board);
        board.available = _.cloneDeep(this.available);
        board.place(move["x"], move["y"], move["z"], 1);
        let score = board.monteCarloSimulation(1);
        if (score >= bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      for (let i = 0; i < this.available.length; i++) {
        let move = this.available[i];
        let board = new Board(this.n);
        board.board = _.cloneDeep(this.board);
        board.available = _.cloneDeep(this.available);
        board.place(move["x"], move["y"], move["z"], 2);
        let score = board.monteCarloSimulation(2);
        if (score >= bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }
    return this.available[Math.floor(Math.random() * this.available.length)];
  }

  monteCarloSimulation(player) {
    let board = new Board(this.n);
    board.board = _.cloneDeep(this.board);
    board.available = _.cloneDeep(this.available);
    let winner = board.checkState();
    if (winner !== 0) {
      if (winner === player) {
        return 1;
      } else {
        return 0;
      }
    }
    let available = board.available;
    let randomMove = available[Math.floor(Math.random() * available.length)];
    board.place(
      randomMove["x"],
      randomMove["y"],
      randomMove["z"],
      player === 1 ? 2 : 1
    );
    return board.monteCarloSimulation(player);
  }
}
