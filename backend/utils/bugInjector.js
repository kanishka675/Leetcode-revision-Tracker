/**
 * Injects a small logical bug into a code string.
 * Strategies:
 * 1. Swap comparison operators (< to >, <= to >=)
 * 2. Reverse pointer movement (left++ to left--)
 * 3. Change true to false
 * 4. Change 0 to 1 or vice versa
 * 5. Remove 'return' in some places (though this might be too breaking)
 */
const injectBug = (code) => {
    let buggyCode = code;
    let hint = "There is a logical error in the algorithm.";

    const strategies = [
        {
            regex: /([a-zA-Z0-9_]+)\s*<\s*([a-zA-Z0-9_]+)/g,
            replacement: "$1 > $2",
            hint: "Check the comparison operators in the loops or conditions."
        },
        {
            regex: /([a-zA-Z0-9_]+)\s*<=\s*([a-zA-Z0-9_]+)/g,
            replacement: "$1 >= $2",
            hint: "Are we using the correct boundary conditions?"
        },
        {
            regex: /([a-zA-Z0-9_]+)\s*\+\+/g,
            replacement: "$1--",
            hint: "Look closely at how your pointers or indices are moving."
        },
        {
            regex: /([a-zA-Z0-9_]+)\s*--/g,
            replacement: "$1++",
            hint: "Is the index movement correct for this direction?"
        },
        {
            regex: /\s+true\s+/g,
            replacement: " false ",
            hint: "A boolean flag might be incorrectly set."
        },
        {
            regex: /=\s*0/g,
            replacement: "= 1",
            hint: "Check your initial values."
        }
    ];

    // Pick one strategy that actually matches
    const applicable = strategies.filter(s => buggyCode.match(s.regex));
    
    if (applicable.length > 0) {
        // Randomly pick one
        const strat = applicable[Math.floor(Math.random() * applicable.length)];
        // Only replace the FIRST occurrence to keep it a "small" bug
        buggyCode = buggyCode.replace(strat.regex, strat.replacement);
        hint = strat.hint;
    }

    return { buggyCode, hint };
};

module.exports = { injectBug };
