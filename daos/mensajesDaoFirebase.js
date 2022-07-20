const ContainerFirestore = require("../contenedores/ContainerFirestore")

class MensajeDaoFirestore extends ContainerFirestore {
    constructor() {
        super('mensajes')
        this.id = 0

        console.log("MensajeDaoFirestore Creado!")
    }

    async checkId() {
        let id = 0
        let lista = await this.getDataAll()
        if (lista.length > 0) {
            id = Math.max(...lista.map(p => p.id))

        }
        id = id + 1
        return id
    }
    async save(content)
    {
        let id= await this.checkId()
        return await this.saveData(content,id)
    }

    async getAll(){
        let lista = await this.getDataAll()
        let result = []

        lista.forEach(p => {
            result.push({id:p.id,...p.data})
        });

        return result
       
      }
  

}

module.exports = MensajeDaoFirestore