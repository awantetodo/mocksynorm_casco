class Contenedor {
    constructor(config, tabla) {
        this.config = config
        this.tabla = tabla
        this.knex = require('knex')(this.config);
    }

    async getAll() {
        let result = await this.knex.from(this.tabla).select('*');
        return result
    }

    async getById(id) {
        let result = await this.knex.from(this.tabla).select('*').where('id', '=', id);

        let item = result.find(elem => elem.id == id)
        return item
    }

    async delete(id) {
        return this.knex(this.tabla).where('id', id).del()
    }

    async update(content, id) {
        return this.knex('users')
            .where('id', id)
            .update(content)
    }

    async save(content, id) {
        return this.knex(this.tabla).insert(content)
    }


}
module.exports = { Contenedor }