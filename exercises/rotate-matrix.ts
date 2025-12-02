function rotateMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;

  // 1. Transponer (fila → columna)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // 2. Invertir cada fila
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }

  return matrix;
}

console.log(
  rotateMatrix([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ])
); // [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
