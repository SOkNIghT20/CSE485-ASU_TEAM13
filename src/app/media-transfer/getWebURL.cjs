//Gets Frontend Web URL depending on whether in 'debug' or 'dev' mode
//Created by Bennett Godinho-Nelson 4/8/25
function getWebUrl(env){
    if(env == 'development'){
        return "http://localhost:4200"
    }else{
        return "http://44.231.94.92"
    }
}

module.exports = getWebUrl;