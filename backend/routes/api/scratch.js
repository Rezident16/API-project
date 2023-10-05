let date = new Date('03-31-2013');
let yesterday = new Date(date.getTime());
yesterday.setDate(date.getDate() - 1);
let tomorrow = new Date(date.getTime());
tomorrow.setDate(date.getDate() + 1)

console.log(date)
console.log(yesterday)
console.log (tomorrow)
