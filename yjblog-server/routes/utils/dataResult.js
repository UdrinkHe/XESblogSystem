/*处理一些从前端发送到后端的数据格式*/
let dataResult = {
    dateToStr : function(date){
        let dateRel = new Date(+new Date(date) + 8*3600*1000)
        return new Date(dateRel).toISOString().slice(0, 19).replace('T', ' ')
    }
}
module.exports = dataResult