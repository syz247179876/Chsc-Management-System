import OSS from 'ali-oss'

function random_string(len) {
    len = len || 32
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = chars.length
    var pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}

/**
 *
 * @param event 上传图片的资源路径
 * @param type 图片资源类型
 * @param dir oss要保存的文件夹
 * @returns {OSS文件路径}
 */
async function uploadOSS(oss, file, dir = 'commodity/') {
    // 设置路径
    let randomName = `${dir}${random_string(6)}_${file.name}`;
    const res = await oss.multipartUpload(
        randomName,
        file
    )
    return res
}

export { uploadOSS }