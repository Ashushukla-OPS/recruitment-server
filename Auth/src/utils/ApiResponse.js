class ApiResponse{
    constructor(
        statusCode,
        data = null,
        success= true,
        message = "success",
    ){
        this.statusCode = statusCode &&  statusCode < 400 ? statusCode :  "This status code is not valid"
        this.success = success
        this.message = message
        this.data = data  
    }
}
export {ApiResponse}