const fs = require("fs").promises;
const path = require("path");


class FileManager{
    constructor(dataDir = "data") {
    this.dataDir = dataDir;
  }
 async readData(filename){
    try{
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    }
    catch(error){
        if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
 }
 async writeData(filename,data){
     try {
      const filePath = path.join(this.dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      throw error;
    }
 }
 async updateData(filename,updateData,id){
   const data = await this.readData(filename);
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      return null;
    }
    data[index] = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    await this.writeData(filename, data);
    return data[index];
 }
 async deleteData(filename,id){
  const data = await this.readData(filename);
    const index = data.findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      return null;
    }
    const deletedItem = data.splice(index, 1)[0];
    await this.writeData(filename, data);
    return deletedItem;
 }
 async appendData(filename,newItem){
   const data = await this.readData(filename);
    const nextId =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
    newItem.id = nextId;
    newItem.createdAt = new Date().toISOString();
    data.push(newItem);
    await this.writeData(filename, data);
    return newItem;
 }
}
module.exports =new FileManager();