const operators = [
    "=",
    "<",
    ">",
    "<=",
    ">=",
    "<>",
    "!=",
    "<=>",
    "like",
    "like binary",
    "not like",
    "ilike",
    "&",
    "|",
    "^",
    "<<",
    ">>",
    "&~",
    "is",
    "is not",
    "rlike",
    "not rlike",
    "regexp",
    "not regexp",
    "~",
    "~*",
    "!~",
    "!~*",
    "similar to",
    "not similar to",
    "not ilike",
    "~~*",
    "!~~*"
];

const order = Object.freeze({
    ASCENDING: 'asc',
    DESCENDING: 'desc'
});

module.exports = { operators, order }