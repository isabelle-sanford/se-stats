

/**
 * Sort the retrieved data by the given key.
 * Then reformat it into a table.
 * @param {} field the field on which to sort.
 */
function doReSort(field) {
    sortBy(field);
    table_output.innerHTML = tabform1(nicer_data);
}

// ! nearly sure there's a better option here...
/**
 * Actually do the Sorting
 * @param {} pName the field by which to sort
 */
function sortBy(pName) {
    function compare(a, b) {
        if (a[pName] < b[pName]) {
            return -1;
        }
        if (a[pName] > b[pName]) {
            return 1;
        }
        return 0;
    }
    nicer_data.sort(compare);
    console.log(`sorted on ${pName}`);
    //console.log(qResult);
}


