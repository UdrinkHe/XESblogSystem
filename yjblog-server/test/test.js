function make (date){
    let dateRel = new Date(date + 8*3600*1000)
    return new Date(dateRel).toISOString().slice(0, 19).replace('T', ' ')
}
let a = new Date()
let b = make(a)
console.log(b)
