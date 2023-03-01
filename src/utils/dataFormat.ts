export const dataURLToBlob = (fileDataURL: string) => {
    let arr = fileDataURL.split(','),
        mime = arr[0].match(/:(.*?);/)![1],
        bstr = arr[1],
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

export const dataURLToFile = (dataURL:string, filename:string) => {
    let arr = dataURL.split(','),
        mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:"image/jpg"});
}