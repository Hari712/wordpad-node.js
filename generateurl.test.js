const generate = require('./generateurl');

test('Generated Url Done', () => {
    expect(generate()).toMatch(/[0-9a-zA-Z]+/)
});

test('length is 6', ()=>{
    expect(generate().length).toBe(4);
})

