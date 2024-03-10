import { v4 as uuidv4 } from 'uuid';

type CriarClienteDto = {
    nome: string
    email: string
    idade: number
}

class Cliente {
    id: string
    nome: string
    email: string
    idade: number


    constructor({ nome, email, idade }: CriarClienteDto, id?: string) {
        this.id = id ?? uuidv4()
        this.nome = nome
        this.email = email
        this.idade = idade
    }
}

interface ClienteRepository {
    salvar: (cliente: Cliente) => Promise<void>
}

export class ClienteService {
    constructor(private clienteRepository: ClienteRepository) { }

    async criarCliente(criarClienteDto: CriarClienteDto): Promise<void> {
        this.validaParametros(criarClienteDto)
        const cliente = new Cliente(criarClienteDto)
        await this.clienteRepository.salvar(cliente)
    }

    private validaParametros({ nome, email, idade }: CriarClienteDto): void {
        this.validaEmail(email)
        this.validaIdade(idade)
        this.validaNome(nome)
    }

    private validaNome(nome: string): void {
        nome = nome.trim()
        if (nome.length < 3) {
            throw new Error('Nome deve possuir no mínimo 3 letras')
        }
        if (nome.length > 50) {
            throw new Error('Nome deve possuir no máximo 50 letras')
        }
    }

    private validaEmail(email: string): void {
        email = email.trim()
        const testeEmailValido = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        const ehValido = testeEmailValido.test(email)
        console.log(email, ehValido)
        if (!ehValido) {
            throw new Error('Formato de email inválido')

        }
    }

    private validaIdade(idade: number): void {
        const idadeInteira = parseInt(idade.toString())

        if (idadeInteira !== idade) {
            throw new Error('Valor informado para idade é inválido.')
        }

        if (idade < 18) {
            throw new Error('Você deve possuir mais de 18 anos para se cadastrar')
        }

        if (idade > 110) {
            throw new Error('Você deve possuir menos de 110 anos para se cadastrar')
        }
    }
}