export function solveLinearEquations(equations: number[][]): number[] | null {
    const n = equations.length;

    // Perform Gaussian elimination
    for (let i = 0; i < n; i++) {
        // Find the pivot row
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(equations[k][i]) > Math.abs(equations[maxRow][i])) {
                maxRow = k;
            }
        }

        // Swap the pivot row with the current row
        [equations[i], equations[maxRow]] = [equations[maxRow], equations[i]];

        // Make all rows below this one 0 in the current column
        for (let k = i + 1; k < n; k++) {
            const c = -equations[k][i] / equations[i][i];
            for (let j = i; j < n + 1; j++) {
                if (i === j) {
                    equations[k][j] = 0;
                } else {
                    equations[k][j] += c * equations[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = equations[i][n] / equations[i][i];
        for (let k = i - 1; k >= 0; k--) {
            equations[k][n] -= equations[k][i] * x[i];
        }
    }

    const isValid = x.every((val) => !isNaN(val));
    return isValid ? x : null;
}

// Example usage:
// const equations = [
//     [2, -1, 0, 0, 0, 0, 0, 0, 1],
//     [-1, 2, -1, 0, 0, 0, 0, 0, 0],
//     [0, -1, 2, -1, 0, 0, 0, 0, 0],
//     [0, 0, -1, 2, -1, 0, 0, 0, 0],
//     [0, 0, 0, -1, 2, -1, 0, 0, 0],
//     [0, 0, 0, 0, -1, 2, -1, 0, 0],
//     [0, 0, 0, 0, 0, -1, 2, -1, 0],
//     [0, 0, 0, 0, 0, 0, -1, 2, 1]
// ];

// const solution = solveLinearEquations(equations);
// console.log(solution);