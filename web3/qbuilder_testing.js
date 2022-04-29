// params = {
//     format: {
//         LG: true,
//         MR: false,
//         QF: false,
//         AG: false,
//         BT: false
//     },
//     win: {
//         Won: true,
//         Lost: false,
//         Drew: true
//     },
//     alignment: {
//         V: false,
//         Elim: false,
//         F: false,
//         N: false,
//         Other: false
//     },
//     death: {
//         S: false,
//         Elim: false,
//         X: true,
//         Vig: false,
//         N: false,
//         Other: false
//     }
// }

// function buildQuery(params) {
//     let query = "SELECT * FROM data_view WHERE TRUE AND "

//     // format
//     let formats = params.format;
//     if (!formats.LG || !formats.MR || !formats.QF || !formats.AG || !formats.BT) {
//         let exists = false;

//         query += " (FALSE "

//         if (formats.LG) {
//             exists = true;
//             query += `OR game_format LIKE 'LG' `
//         }
//         if (formats.MR) {
//             exists = true;
//             query += `OR game_format LIKE 'MR' `
//         }
//         if (formats.QF) {
//             exists = true;
//             query += `OR game_format LIKE 'QF' `
//         }
//         if (formats.AG) {
//             exists = true;
//             query += `OR game_format LIKE 'AG' `
//         }
//         if (formats.BT) {
//             exists = true;
//             query += `OR game_format LIKE 'BT' `
//         }

//         if (!exists) {
//             console.log("all formats unchecked")
//             return false;
//         }
//         // or and?
//         query += ") AND "
//     }

//     // wins
//     let wins = params.win;
//     if (!wins.Won || !wins.Lost || !wins.Drew) {
//         let exists = false;

//         query += "(FALSE "

//         if (wins.Won) {
//             exists = true;
//             query += ` OR win `
//         }
//         if (wins.Lost) {
//             exists = true;
//             query += ` OR NOT win `
//         }
//         if (wins.Drew) {
//             exists = true;
//             query += ` OR win = NULL `
//         }
//         if (!exists) {
//             console.log("all wins unchecked")
//             return false;
//         }
//         query += ") AND "
//     }

//     // !! O
//     let alignments = params.alignment;
//     if (!alignments.V || !alignments.Elim || !alignments.F || !alignments.N || !alignments.Other) {
//         let exists = false;

//         query += " (FALSE "

//         if (alignments.V) {
//             exists = true;
//             query += ` OR alignment_char LIKE 'V'`
//         }
//         if (alignments.Elim) {
//             exists = true;
//             query += ` OR is_elim`
//         }
//         if (alignments.F) {
//             exists = true;
//             query += ` OR alignment_char LIKE 'F'`
//         }
//         if (alignments.N) {
//             exists = true;
//             query += ` OR alignment_char LIKE 'N'`
//         }
//         if (alignments.Other) {
//             exists = true;
//             // !
//             query += ` OR alignment_char LIKE 'O'`
//         }
//         if (!exists) {
//             console.log("all alignments unchecked")
//             return false;
//         }
//         query += ") AND "
//     }

//     // death
//     let deaths = params.death;
//     if (!deaths.S || !deaths.Elim || !deaths.X || !deaths.Vig || !deaths.N || !deaths.Other) {
//         let exists = false;
//         query += " (FALSE "

//         if (deaths.S) {
//             exists = true;
//             query += " OR death_char LIKE 'S'";
//         }
//         if (deaths.Elim) {
//             exists = true;
//             query += " OR death_char LIKE 'E' OR death_char LIKE 'M'";
//         }
//         if (deaths.X) {
//             exists = true;
//             query += " OR death_char LIKE 'X'";
//         }
//         if (deaths.Vig) {
//             exists = true;
//             query += " OR death_char LIKE 'V' OR death_char LIKE 'F'";
//         }
//         if (deaths.N) {
//             exists = true;
//             query += " OR death_char LIKE 'N'";
//         }
//         if (deaths.O) {
//             exists = true;
//             query += " OR death_char LIKE 'I' OR death_char LIKE 'O' OR death_char LIKE 'D' OR death_char LIKE 'P'";
//         }

//         if (!exists) {
//             console.log("all deaths unchecked")
//             return false;
//         }

//         query += " ) AND "

//     }
//     query += " TRUE;"

//     return query

// }


// q = buildQuery(params)
// console.log(q);
