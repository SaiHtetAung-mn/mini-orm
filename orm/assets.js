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

const orderDirection = Object.freeze({
    ASCENDING: 'asc',
    DESCENDING: 'desc'
});

const whereType = Object.freeze({
    BASIC: 'basic',
    IN: 'in'
});

const havingType = Object.freeze({
    BASIC: 'basic',
    BETWEEN: 'between'
})

module.exports = { 
    operators, 
    orderDirection,
    whereType,
    havingType
}