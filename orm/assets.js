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
});

const columnDataType = Object.freeze({
    // String
    CHAR: 'char',
    VARCHAR: 'varchar',
    TEXT: 'text',
    LONGTEXT: 'longtext',

    // Number
    BIT: 'bit',
    TINYINT: 'tinyint',
    BOOLEAN: 'boolean',
    SMALLINT: 'smallint',
    MEDIUMINT: 'mediumint',
    INT: 'int',
    BIGINT: 'bigint',
});

const maxColumnStrLength = Object.freeze({
    CHAR: 255,
    VARCHAR: 16300,
    TEXT: 65535,
    LONGTEXT: 4294967295
})

const maxColumnNumValue = Object.freeze({
    BIT: 64
})

module.exports = { 
    operators, 
    orderDirection,
    whereType,
    havingType,
    columnDataType,
    maxColumnNumValue,
    maxColumnStrLength
}