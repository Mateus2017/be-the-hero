const connection = require('../database/connection')
const bcrypt = require('bcryptjs')

const table_name_campanhas = 'campanhas'
const table_name_ongs = 'ongs'

module.exports = {
    async listar(req, res) {
        const ong_id = req.headers.authorization;

        const items = await connection(table_name_campanhas)
            .where('ong_id', ong_id).select('*')

        return res.json(items)
    },

    async login(req, res) {
        const { password, ong_id } = req.body;

        if (ong_id != '') {

            const profile = await connection(table_name_ongs).where('id', ong_id).first()

            if (!profile) {
                return res.json({
                    error: "ONG not found with ID"
                })
            } else {
                if (await bcrypt.compare(password, profile.password)) {
                    return res.json({ name: profile.name })
                } else {
                    return res.json({
                        error: "Password invalid"
                    })
                }
            }

        } else {
            return res.json({
                error: "Requered a ID"
            })
        }
    }
}