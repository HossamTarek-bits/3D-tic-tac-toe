export default class Board {
  // 0 = empty
  // 1 = player 1
  // 2 = player 2
  constructor(n = 3) {
    this.n = n;
    this.board = [];
    for (let x = 0; x < n; x++) {
      this.board[x] = [];
      for (let y = 0; y < n; y++) {
        this.board[x][y] = [];
        for (let z = 0; z < n; z++) {
          this.board[x][y][z] = 0;
        }
      }
    }
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
}
