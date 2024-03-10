import { ClienteService } from "./cliente-service";

describe('ClienteService', () => {

    describe('Validacao do cliente', () => {
        let clienteService: ClienteService
        let salvarCliente

        beforeAll(() => {
            salvarCliente = jest.fn()
            const clienteRepository = { salvar: salvarCliente }
            clienteService = new ClienteService(clienteRepository)
        })

        describe('Nome', () => {
            test('Deve lançar um erro quando o nome do cliente tem menos de 3 caracteres', () => {
                const criarClienteDto = {
                    nome: 'ze',
                    idade: 20,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no mínimo 3 letras'))
            })

            test('Deve lançar um erro quando o nome do cliente esta vazio', () => {
                const criarClienteDto = {
                    nome: '',
                    idade: 20,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no mínimo 3 letras'))
            })

            test('Deve lançar um erro quando o nome do cliente tem mais de 50 caracteres', async () => {
                const criarClienteDto = {
                    nome: new Array(51).fill('a').join(''),
                    idade: 20,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no máximo 50 letras'))

            })

            test('Deve lançar um erro quando o nome do cliente tem mais 3 caracteres, mas tem menos ao excluir espaços vazios', async () => {
                const criarClienteDto = {
                    nome: 'ze   ',
                    idade: 20,
                    email: 'teste@email.com'
                }
                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Nome deve possuir no mínimo 3 letras'))
            })

            test('Deve salvar o cliente quando seu nome tem 50 caracteres', async () => {
                const criarClienteDto = {
                    nome: new Array(5).fill('a').join(''),
                    idade: 20,
                    email: 'teste@email.com'
                }

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })

            test('Deve salvar o cliente quando seu nome tem 4 caracteres', async () => {
                const criarClienteDto = {
                    nome: 'Teo',
                    idade: 20,
                    email: 'teste@email.com'
                }

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })


        describe('Email', () => {
            test('Deve lançar um erro quando o email do cliente nao tem @', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 20,
                    email: 'teste.email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Formato de email inválido'))
            })

            test('Deve lançar um erro quando o email do cliente nao tem dominio', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 20,
                    email: 'teste@'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Formato de email inválido'))
            })

            test('Deve lançar um erro quando o email do cliente nao tem endereco', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 20,
                    email: '@gmail.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Formato de email inválido'))
            })

            test('Deve salvar o cliente quando o email for valido', async () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 20,
                    email: 'teste@gmail.com'
                }

                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })

        describe('Idade', () => {
            test('Deve lançar um erro quando o cliente tem menos de 18 anos', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 17,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Você deve possuir mais de 18 anos para se cadastrar'))
            })

            test('Deve lançar um erro quando o cliente possui uma idade que nao seja um numero inteiro', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 21.3,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Valor informado para idade é inválido.'))
            })

            test('Deve lançar um erro quando o cliente possui uma idade negativa', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: -1,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Você deve possuir mais de 18 anos para se cadastrar'))
            })

            test('Deve lançar um erro quando o cliente possui mais de 110 anos', () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 111,
                    email: 'teste@email.com'
                }

                expect(async () => await clienteService.criarCliente(criarClienteDto)).rejects.toThrow(new Error('Você deve possuir menos de 110 anos para se cadastrar'))
            })

            
            test('Deve salvar o cliente quando possuir 18 anos', async () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 18,
                    email: 'teste@email.com'
                }
                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })

            test('Deve salvar o cliente quando possuir 110 anos', async () => {
                const criarClienteDto = {
                    nome: 'Nome Valido',
                    idade: 110,
                    email: 'teste@email.com'
                }
                await clienteService.criarCliente(criarClienteDto)

                expect(salvarCliente).toHaveBeenCalled()
            })
        })
    })

})

