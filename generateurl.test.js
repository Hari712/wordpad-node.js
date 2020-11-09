const sum = require('./generateurl');

test('Generated Url Done', () => {
    expect(sum()).toMatch(/[0-9a-zA-Z]+/)
});

test('length is 6', ()=>{
    expect(sum().length).toBe(4);
})