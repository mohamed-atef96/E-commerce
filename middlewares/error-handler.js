function errorHandler(err, req, res, next){
        if(err.name === "UnauthorizedError") return res.status(401).json({msg:'This user isnt authorized'})
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};
      
        // render the error page
        res.status(err.status || 500);
        res.json({ error: err })
      }
module.exports = errorHandler;