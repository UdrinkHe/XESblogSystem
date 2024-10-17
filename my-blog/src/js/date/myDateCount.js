let DateCounter = {
        getHourStrToMinNumber : function(hourStr){
            let hourStrArr = hourStr.split(':')
            let minNumber = (hourStrArr[0][0] == '0'?parseInt(hourStrArr[0][1])*60:parseInt(hourStrArr[0])*60)+(hourStrArr[1][0] == '0'?parseInt(hourStrArr[1][1]):parseInt(hourStrArr[1]))
            return minNumber
        },
        formatDate(date) {
            return new Date(date).toLocaleString('zh-CN', { 
                timeZone: 'Asia/Shanghai', 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }).replace(/\//g, '-').replace(',', '');
          },
}
export default DateCounter