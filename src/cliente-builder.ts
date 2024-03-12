import { CriarClienteDto } from "./cliente-service";
import Chance from 'chance'

export class ClienteDtoBuilder {
    private chance: Chance.Chance
    private nome: string
    private idade: number
    private email: string
    private telefone: number

    constructor() {
        this.chance = new Chance()
        this.nome = this.chance.string({ length: 3, alpha: true, numeric: false, symbols: false })
        this.idade = this.chance.integer({ min: 18, max: 110 })
        this.email = this.chance.email()
        this.telefone = 32912345678
    }

    build(): CriarClienteDto {
        return {
            nome: this.nome,
            idade: this.idade,
            email: this.email,
            telefone: this.telefone
        }
    }

    comNome(nome: string) {
        this.nome = nome
        return this
    }

    comIdade(idade: number) {
        this.idade = idade
        return this
    }

    comEmail(email: string) {
        this.email = email
        return this
    }

    comTelefone(telefone: number) {
        this.telefone = telefone
        return this
    }
}