import { ClienteService } from "./cliente-service";
import { validate, version } from 'uuid'
import { ClienteDtoBuilder } from './cliente-builder'

describe('ClienteService', () => {
    let clienteService: ClienteService
    let salvarCliente
    let builder: ClienteDtoBuilder

    beforeEach(() => {
        // erro estava aqui. eu coloquei um once e o teste do repositório estava com o only, daí estava resolvendo a promise e quebrando a toda a suite pois só ele estava rodando
        salvarCliente = jest.fn().mockResolvedValue(true)

        const clienteRepository = { salvar: salvarCliente }
        clienteService = new ClienteService(clienteRepository)
        builder = new ClienteDtoBuilder()
    })

    describe('Salvar no repositório', () => {
        test('Deve lançar uma excessão quando o repositório não conseguir salvar o cliente', () => {
            salvarCliente.mockResolvedValueOnce(false)
            const criarClienteDto = builder.build()

            expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Não foi possível salvar no banco de dados'))
        })

    })

    describe('Validacao do cliente', () => {
        describe('Nome', () => {
            test('Deve lançar um erro quando o nome do cliente tem menos de 3 caracteres', () => {
                const criarClienteDto = builder.comNome('ze').build()

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no mínimo 3 letras'))
            })

            test('Deve lançar um erro quando o nome do cliente esta vazio', () => {
                const criarClienteDto = builder.comNome('').build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no mínimo 3 letras'))
            })

            test('Deve lançar um erro quando o nome do cliente tem mais de 50 caracteres', () => {
                const criarClienteDto = builder.comNome(new Array(51).fill('a').join('')).build()

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no máximo 50 letras'))

            })

            test('Deve lançar um erro quando o nome do cliente tem mais 3 caracteres, mas tem menos ao excluir espaços vazios', async () => {
                const criarClienteDto = builder.comNome('ze     ').build()

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no mínimo 3 letras'))
            })

            test('Deve salvar o cliente quando seu nome tem 50 caracteres', async () => {
                const criarClienteDto = builder.comNome(new Array(50).fill('a').join('')).build()

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })

            test('Deve salvar o cliente quando seu nome tem 3 caracteres', async () => {
                const criarClienteDto = builder.comNome('Teo').build()

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })

        describe('Email', () => {
            test('Deve lançar um erro quando o email do cliente nao tem @', () => {
                const criarClienteDto = builder.comEmail('email.email.com').build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Formato de email inválido'))
            })

            test('Deve lançar um erro quando o email do cliente nao tem dominio', () => {
                const criarClienteDto = builder.comEmail('email@').build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Formato de email inválido'))
            })

            test('Deve lançar um erro quando o email do cliente nao tem endereco', () => {
                const criarClienteDto = builder.comEmail('@gmail.com').build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Formato de email inválido'))
            })

            test('Deve salvar o cliente quando o email for valido', async () => {
                const criarClienteDto = builder.comEmail('email@email.com').build()

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })

        describe('Idade', () => {
            test('Deve lançar um erro quando o cliente tem menos de 18 anos', () => {
                const criarClienteDto = builder.comIdade(17).build()

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Você deve possuir mais de 18 anos para se cadastrar'))
            })

            test('Deve lançar um erro quando o cliente possui uma idade que nao seja um numero inteiro', () => {
                const criarClienteDto = builder.comIdade(21.3).build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Valor informado para idade é inválido.'))
            })

            test('Deve lançar um erro quando o cliente possui uma idade negativa', () => {
                const criarClienteDto = builder.comIdade(-1).build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Você deve possuir mais de 18 anos para se cadastrar'))
            })

            test('Deve lançar um erro quando o cliente possui mais de 110 anos', () => {
                const criarClienteDto = builder.comIdade(111).build()


                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Você deve possuir menos de 110 anos para se cadastrar'))
            })


            test('Deve salvar o cliente quando possuir 18 anos', async () => {
                const criarClienteDto = builder.comIdade(18).build()

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })

            test('Deve salvar o cliente quando possuir 110 anos', async () => {
                const criarClienteDto = builder.comIdade(110).build()

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })

        describe('Telefone', () => {
            test('Deve lançar um erro quando o telefone não possuir ddd', () => {
                const criarClienteDto = builder.comTelefone(912345678).build()

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Telefone inválido. O telefone precisa ser um celular com ddd. ex: 32988888888'))
            })

            test('Deve lançar um erro quando o telefone não possuir o digito 9', () => {
                const criarClienteDto = builder.comTelefone(1112345678).build()

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Telefone inválido. O telefone precisa ser um celular com ddd. ex: 32988888888'))
            })

            test('Deve salvar o cliente quando o telefone possuir ddd, 9 e o numero', async () => {
                const criarClienteDto = builder.comTelefone(11912345678).build()

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })
    })

    describe('Criacao de id', () => {
        test('Deve criar um id do tipo uuidV4 para o cliente', async () => {
            const criarClienteDto = builder.build()

            const cliente = await clienteService.criarCliente(criarClienteDto)

            expect(validate(cliente.id)).toBeTruthy()
            expect(version(cliente.id)).toEqual(4)
        })
    })

})



