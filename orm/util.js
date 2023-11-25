exports.colValue = (val) => {
    switch(typeof val) {
        case 'string': return `'${val}'`;
        default: return val;
    }
}