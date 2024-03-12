import { v4 as uuidv4 } from 'uuid';

export type CriarClienteDto = {
    nome: string
    email: string
    idade: number
    telefone: number
}

class Cliente {
    id: string
    nome: string
    email: string
    idade: number
    telefone: number


    constructor({ nome, email, idade, telefone }: CriarClienteDto, id?: string) {
        this.id = id ?? uuidv4()
        this.nome = nome
        this.email = email
        this.idade = idade
        this.telefone = telefone!
    }
}

interface ClienteRepository {
    salvar: (cliente: Cliente) => Promise<boolean>
}

export class ClienteService {
    constructor(private clienteRepository: ClienteRepository) { }

    async criarCliente(criarClienteDto: CriarClienteDto): Promise<Cliente> {
        this.validaParametros(criarClienteDto)
        const cliente = new Cliente(criarClienteDto)
        const salvou = await this.clienteRepository.salvar(cliente)
        if (!salvou) {
            throw new Error('Não foi possível salvar no banco de dados')
        }

        return cliente
    }

    private validaParametros({ nome, email, idade, telefone }: CriarClienteDto): void {
        this.validaEmail(email)
        this.validaIdade(idade)
        this.validaNome(nome)
        this.validaTelefone(telefone)
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

    private validaTelefone(telefone: number): void {
        const testeTelefoneEhValido = new RegExp(/(\d{2})(9\d{8})/)
        const ehValido = testeTelefoneEhValido.test(telefone.toString())
        if (!ehValido) {
            throw new Error('Telefone inválido. O telefone precisa ser um celular com ddd. ex: 32988888888')
        }
    }
}