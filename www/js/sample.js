// This is a JavaScript file
/**
 * Date オブジェクトを yyyyMMddHHmmss 形式の文字列に変換
 * @param {Date} date 変換対象の Date オブジェクト
 */
function dateToString(date) {
    const strYear = String(date.getFullYear()).padStart(4, '0')
    const strMonth = String(date.getMonth()).padStart(2, '0')
    const strDate = String(date.getDate()).padStart(2, '0')
    const strHour = String(date.getHours()).padStart(2, '0')
    const strMin = String(date.getMinutes()).padStart(2, '0')
    const strSec = String(date.getSeconds()).padStart(2, '0')
    return strYear + strMonth + strDate + strHour + strMin + strSec
}

document.getElementById("kin").value = localStorage.getItem("kin");