/**
 * @param fileName (String) filename to saveas
 * @param data (String) file contents
 * @param {string} type - the MIME type of the data, e.g. 'text/csv' or 'application/json'
 **/
export default function saveLocal(fileName, data, type){
    var blob = new Blob([data], { type:type });

    if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveBlob(blob, fileName);
    else {
        var elem = document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
    console.log('ene')
};
