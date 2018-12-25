module.exports = class Mapper{
    constructor('handlerName'){
        this.dbHandler = new DataBaseHandler('handlerName');
    }
    create(){
        return query
    };
    select(){
        return query
    };
    insert(){
        return query
    };
    update(){
        return query
    };
    sendQuery(query){
        this.dbHandler.openConnection(db_name,host);
        this.dbHandler.sendQuery(query);
        this.dbHandler.closeConnection(db_name,host);
    };
}