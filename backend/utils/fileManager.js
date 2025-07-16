const fs = require("fs").promises;
const path = require("path");


class FileManager{
    constructor(dataDir = "data") {
    this.dataDir = dataDir;
  }
 async readData(filename){
    try{}
    catch(error){}
 }
 async writeData(filename,data){
    try{}
    catch(error){}
 }
 async updateData(filename,data){
    try{}
    catch(error){}
 }
 async deleteData(filename,id){
    try{}
    catch(error){}
 }
 async appendData(filename,newItem){
    try{}
    catch(error){}
 }
}
module.exports =new FileManager();